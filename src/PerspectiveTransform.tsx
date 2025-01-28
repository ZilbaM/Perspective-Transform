/**
 * PerspectiveTransform.tsx
 *
 * A React component to apply an interactive perspective transform to its children.
 * Supports controlled and uncontrolled modes, optional localStorage persistence, and
 * shift+key toggling for edit mode.
 */

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  MouseEvent,
  ReactNode,
  FC,
} from "react";
import "./style.css";

/**
 * Represents an (x,y) coordinate for a corner.
 */
export interface Corner {
  x: number;
  y: number;
}

/**
 * Represents all four corner coordinates.
 */
export interface Points {
  topLeft: Corner;
  topRight: Corner;
  bottomRight: Corner;
  bottomLeft: Corner;
}

/**
 * Props for the PerspectiveTransform component.
 */
export interface PerspectiveTransformProps {
  /**
   * The child node(s) to which we apply the perspective transform.
   * Usually an image, video, or other content.
   */
  children: ReactNode;

  /**
   * If provided, points become controlled from outside.
   * The component will always use these points instead of its local state.
   */
  points?: Points;

  /**
   * Called whenever corner points change, e.g., when a user drags them.
   */
  onPointsChange?: (points: Points) => void;

  /**
   * If set, the component will store and retrieve corner points from localStorage
   * under this key (uncontrolled scenario). If `points` is controlled, localStorage
   * logic is not used.
   */
  storageKey?: string;

  /**
   * Whether the component is currently in edit mode. If provided, this prop controls
   * edit mode externally. If omitted, SHIFT+[toggleKeys] toggles a local edit mode.
   */
  editable?: boolean;

  /**
   * If edit mode is controlled from outside, this callback is triggered when SHIFT+[toggleKeys]
   * is pressed. Passes the next boolean value for edit mode.
   */
  onEditableChange?: (nextEditable: boolean) => void;

  /**
   * An array of lowercase keys that, when pressed with SHIFT, toggle edit mode.
   * Defaults to ["p"].
   */
  toggleKeys?: string[];
}

/**
 * A React component that applies a perspective transform to its children.
 * It can be controlled (passing `points` and `editable`) or uncontrolled
 * (managing points internally, optionally persisting them to localStorage).
 *
 * In edit mode, users can drag corner handles to adjust the perspective.
 * Edit mode can be toggled by SHIFT+[toggleKeys] or controlled via the `editable` prop.
 */
const PerspectiveTransform: FC<PerspectiveTransformProps> = ({
  children,
  points: controlledPoints,
  onPointsChange,
  storageKey,
  editable,
  onEditableChange,
  toggleKeys = ["p"],
}) => {
  /**
   * A reference to the outer container for measuring its dimensions.
   */
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Local state for corner points when uncontrolled.
   * If `points` is passed from outside, we'll sync to that.
   */
  const [points, setPoints] = useState<Points>(
    controlledPoints || {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    }
  );

  /**
   * Local state for edit mode when `editable` is not provided.
   */
  const [localEditable, setLocalEditable] = useState(false);

  /**
   * Computed boolean for whether we're in edit mode.
   * If `editable` is defined, it takes precedence.
   * Otherwise, we use localEditable.
   */
  const isEditMode = editable !== undefined ? editable : localEditable;

  /**
   * CSS matrix string for the perspective transform.
   */
  const [matrix, setMatrix] = useState("");

  /**
   * On mount, if `storageKey` is provided and we have no controlled points,
   * load any saved corner points from localStorage.
   */
  useEffect(() => {
    if (!controlledPoints && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Points;
          if (
            parsed.topLeft &&
            parsed.topRight &&
            parsed.bottomRight &&
            parsed.bottomLeft
          ) {
            setPoints(parsed);
          }
        } catch (e) {
          console.error("Failed to parse stored perspective points", e);
        }
      }
    }
  }, [controlledPoints, storageKey]);

  /**
   * Whenever `points` change, store them in localStorage (if `storageKey` is set).
   */
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(points));
      } catch (e) {
        console.error("Failed to store perspective points", e);
      }
    }
  }, [points, storageKey]);

  /**
   * If `points` is passed from outside (controlled), sync our local state.
   */
  useEffect(() => {
    if (controlledPoints) {
      setPoints(controlledPoints);
    }
  }, [controlledPoints]);

  /**
   * Helper function to compute a CSS 3D matrix for the perspective transform.
   *
   * @param srcPoints The rectangle representing the container's original corners.
   * @param dstPoints The user-manipulated corner coordinates.
   * @returns A CSS `matrix3d(...)` string.
   */
  function computeCssMatrix(srcPoints: Corner[], dstPoints: Corner[]): string {
    /**
     * Solve a system of linear equations.
     */
    function solve(A: number[], b: number[]): number[] | null {
      const det =
        A[0] * (A[4] * A[8] - A[5] * A[7]) -
        A[1] * (A[3] * A[8] - A[5] * A[6]) +
        A[2] * (A[3] * A[7] - A[4] * A[6]);

      if (det === 0) return null;
      const invDet = 1 / det;

      const adjA = [
        A[4] * A[8] - A[5] * A[7],
        A[2] * A[7] - A[1] * A[8],
        A[1] * A[5] - A[2] * A[4],
        A[5] * A[6] - A[3] * A[8],
        A[0] * A[8] - A[2] * A[6],
        A[2] * A[3] - A[0] * A[5],
        A[3] * A[7] - A[4] * A[6],
        A[1] * A[6] - A[0] * A[7],
        A[0] * A[4] - A[1] * A[3],
      ].map((val) => val * invDet);

      return [
        adjA[0] * b[0] + adjA[1] * b[1] + adjA[2] * b[2],
        adjA[3] * b[0] + adjA[4] * b[1] + adjA[5] * b[2],
        adjA[6] * b[0] + adjA[7] * b[1] + adjA[8] * b[2],
      ];
    }

    /**
     * Compute the adjoint matrix.
     */
    function adj(m: number[]): number[] {
      return [
        m[4] * m[8] - m[5] * m[7],
        m[2] * m[7] - m[1] * m[8],
        m[1] * m[5] - m[2] * m[4],
        m[5] * m[6] - m[3] * m[8],
        m[0] * m[8] - m[2] * m[6],
        m[2] * m[3] - m[0] * m[5],
        m[3] * m[7] - m[4] * m[6],
        m[1] * m[6] - m[0] * m[7],
        m[0] * m[4] - m[1] * m[3],
      ];
    }

    /**
     * Multiply two 3x3 matrices.
     */
    function multmm(a: number[], b: number[]): number[] {
      const c: number[] = [];
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          let cij = 0;
          for (let k = 0; k < 3; k += 1) {
            cij += a[3 * i + k] * b[3 * k + j];
          }
          c[3 * i + j] = cij;
        }
      }
      return c;
    }

    /**
     * Convert from 3 corner vectors + 1 target vector to a 3x3 transform matrix.
     */
    function basisToPoints(
      p1: Corner,
      p2: Corner,
      p3: Corner,
      p4: Corner
    ): number[] | null {
      const m = [p1.x, p2.x, p3.x, p1.y, p2.y, p3.y, 1, 1, 1];
      const v = [p4.x, p4.y, 1];
      const s = solve(m, v);
      if (s === null) return null;
      const m2 = [
        m[0] * s[0],
        m[1] * s[1],
        m[2] * s[2],
        m[3] * s[0],
        m[4] * s[1],
        m[5] * s[2],
        m[6] * s[0],
        m[7] * s[1],
        m[8] * s[2],
      ];
      return m2;
    }

    // Compute basis transformations for source and destination corners.
    const m1 = basisToPoints(srcPoints[0], srcPoints[1], srcPoints[2], srcPoints[3]);
    const m2 = basisToPoints(dstPoints[0], dstPoints[1], dstPoints[2], dstPoints[3]);
    if (!m1 || !m2) return "";

    // Multiply m2 * adj(m1) to get final matrix.
    const m3 = multmm(m2, adj(m1));

    // Normalize by the last element.
    for (let i = 0; i < m3.length; i += 1) {
      m3[i] /= m3[8];
    }

    // Convert to CSS matrix3d format.
    const matrix3d = [
      m3[0],
      m3[3],
      0,
      m3[6],
      m3[1],
      m3[4],
      0,
      m3[7],
      0,
      0,
      1,
      0,
      m3[2],
      m3[5],
      0,
      m3[8],
    ];

    return `matrix3d(${matrix3d.join(",")})`;
  }

  /**
   * SHIFT + [toggleKeys] toggling logic, for both controlled and uncontrolled usage.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && toggleKeys.includes(e.key.toLowerCase())) {
        // If we have onEditableChange, call it to request toggling from the parent.
        if (onEditableChange) {
          onEditableChange(!isEditMode);
        } else {
          // Otherwise, if there's a controlled 'editable' but no onEditableChange,
          // toggling local state might conflict with the parent's state.
          if (editable !== undefined) {
            console.warn(
              "PerspectiveTransform: Toggling local edit mode, but 'editable' prop is controlled without 'onEditableChange'. " +
                "This can lead to inconsistent state."
            );
          }
          setLocalEditable((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditMode, onEditableChange, editable, toggleKeys]);

  /**
   * If no controlled points are provided, adjust the corners once based on container size.
   */
  useLayoutEffect(() => {
    if (!controlledPoints && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setPoints((prevPoints) => ({
          ...prevPoints,
          topRight: { x: rect.width, y: 0 },
          bottomRight: { x: rect.width, y: rect.height },
          bottomLeft: { x: 0, y: rect.height },
        }));
      }
    }
  }, [children, controlledPoints]);

  /**
   * Recompute the perspective transform matrix whenever points change.
   */
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const srcCorners: Corner[] = [
        { x: 0, y: 0 },
        { x: rect.width, y: 0 },
        { x: rect.width, y: rect.height },
        { x: 0, y: rect.height },
      ];
      const dstCorners: Corner[] = [
        points.topLeft,
        points.topRight,
        points.bottomRight,
        points.bottomLeft,
      ];
      const transform = computeCssMatrix(srcCorners, dstCorners);
      setMatrix(transform);
    }
  }, [points]);

  /**
   * Handler for when the user starts dragging a specific corner.
   * Tracks mouse movement and updates corner positions.
   */
  const handleDrag = (e: MouseEvent<HTMLDivElement>, corner: string) => {
    e.preventDefault();
    e.stopPropagation();

    /**
     * Move event updates the selected corner.
     */
    const onMove = (event: globalThis.MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const updatedPoints = {
          ...points,
          [corner]: { x, y },
        };

        setPoints(updatedPoints);
        onPointsChange?.(updatedPoints);
      }
    };

    /**
     * Cleanup after mouse up.
     */
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={containerRef} className="perspective-container">
      {/**
       * The transformed child content. We apply the matrix to this wrapper
       * so the alignment guides also transform.
       */}
      <div
        style={{
          transform: matrix,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {isEditMode && <div className="alignment-guides" />}
        {children}
      </div>

      {/**
       * Corner control points, rendered only in edit mode.
       */}
      {isEditMode &&
        Object.entries(points).map(([corner, { x, y }]) => (
          <div
            key={corner}
            className="control-point"
            style={{ left: x, top: y }}
            onMouseDown={(e) => handleDrag(e, corner)}
          />
        ))}
    </div>
  );
};

export default PerspectiveTransform;