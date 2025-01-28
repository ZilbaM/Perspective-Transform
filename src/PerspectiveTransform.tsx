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

interface Corner {
  x: number;
  y: number;
}

interface Points {
  topLeft: Corner;
  topRight: Corner;
  bottomRight: Corner;
  bottomLeft: Corner;
}

interface PerspectiveTransformProps {
  children: ReactNode;

  /**
   * Points can be controlled externally. If provided, this overrides internal state.
   */
  points?: Points;

  /**
   * Callback for whenever the points change (e.g. user drags a corner).
   */
  onPointsChange?: (points: Points) => void;

  /**
   * Key for persisting state in localStorage (uncontrolled scenario only).
   */
  storageKey?: string;

  /**
   * If provided, controls whether the PerspectiveTransform is in "edit" mode.
   * If omitted, SHIFT+key toggles local edit mode.
   */
  editable?: boolean;

  /**
   * Callback when the edit mode toggles. Useful if you want to track/toggle
   * edit state from outside (controlled scenario), or combine with local.
   */
  onEditableChange?: (nextEditable: boolean) => void;

  /**
   * Keys (lowercase) that should toggle edit mode when pressed with SHIFT.
   * Defaults to ["p"].
   */
  toggleKeys?: string[];
}

const PerspectiveTransform: FC<PerspectiveTransformProps> = ({
  children,
  points: controlledPoints,
  onPointsChange,
  storageKey,
  editable,
  onEditableChange,
  toggleKeys = ["p"],
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Local state for corners
  const [points, setPoints] = useState<Points>(
    controlledPoints || {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    }
  );

  // Local state for edit mode (when 'editable' is not controlled)
  const [localEditable, setLocalEditable] = useState(false);

  // Merge localEditable with the controlled "editable" prop
  // If 'editable' is defined, it takes precedence, otherwise we rely on localEditable.
  const isEditMode = editable !== undefined ? editable : localEditable;

  const [matrix, setMatrix] = useState("");

  // On mount, attempt to load from localStorage (uncontrolled scenario)
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

  // Whenever points change, save them to localStorage if a storageKey is provided
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(points));
      } catch (e) {
        console.error("Failed to store perspective points", e);
      }
    }
  }, [points, storageKey]);

  // Sync controlled points with internal state
  useEffect(() => {
    if (controlledPoints) {
      setPoints(controlledPoints);
    }
  }, [controlledPoints]);

  // Compute the CSS matrix
  function computeCssMatrix(srcPoints: Corner[], dstPoints: Corner[]): string {
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

    const m1 = basisToPoints(
      srcPoints[0],
      srcPoints[1],
      srcPoints[2],
      srcPoints[3]
    );
    const m2 = basisToPoints(
      dstPoints[0],
      dstPoints[1],
      dstPoints[2],
      dstPoints[3]
    );
    if (!m1 || !m2) return "";

    const m3 = multmm(m2, adj(m1));
    for (let i = 0; i < m3.length; i += 1) {
      m3[i] /= m3[8];
    }

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

  // SHIFT+ key toggling logic, even if we have a controlled editable.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && toggleKeys.includes(e.key.toLowerCase())) {
        // We'll either use onEditableChange if provided
        // or toggle localEditable if editable is uncontrolled.

        // If 'editable' is provided, treat it as controlled.
        // We can still call onEditableChange to request the parent to toggle.
        if (onEditableChange) {
          onEditableChange(!isEditMode);
        } else {
          // Fallback if no onEditableChange is provided:
          // just toggle local state. If 'editable' is defined
          // but there's no onEditableChange, we override the parent-provided state.
          // That might cause a mismatch, but it's what the user requested.
          if (editable !== undefined) {
            console.warn(
              "PerspectiveTransform: Toggling local edit mode, but 'editable' prop is controlled without onEditableChange. This can lead to inconsistent state."
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

  // Adjust corners if we have no controlled points
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

  // Recompute matrix whenever points change
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

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>, corner: string) => {
    e.preventDefault();
    e.stopPropagation();

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

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={containerRef} className="perspective-container">
      {/* Show alignment guides only if isEditMode == true */}
tr
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