---
title: Usage Examples
slug: /usage-examples
---

# Usage Examples

This page shows more complete scenarios showcasing the capabilities of PerspectiveTransform.

## Basic Image Warp

```tsx
function ImageWarp() {
  return (
    <div style={{ width: 400, height: 300 }}>
      <PerspectiveTransform>
        <img src=\"/images/mona-lisa.png\" alt=\"Mona Lisa\" style={{ width: '100%' }} />
      </PerspectiveTransform>
    </div>
  );
}
````

- Press Shift+P to drag corners.

## Controlled with External State & Buttons

```tsx
function ControlledDemo() {
  const [points, setPoints] = useState<Points>({
    topLeft: { x: 40, y: 40 },
    topRight: { x: 360, y: 40 },
    bottomRight: { x: 360, y: 260 },
    bottomLeft: { x: 40, y: 260 },
  });
  const [isEditable, setIsEditable] = useState(false);

  return (
    <>
      <button onClick={() => setIsEditable(!isEditable)}>
        {isEditable ? "Disable Edit" : "Enable Edit"}
      </button>
      <PerspectiveTransform
        points={points}
        onPointsChange={setPoints}
        editable={isEditable}
      >
        <div style={{ background: "#f0f0f0", width: 320, height: 220 }}>
          <h2>Transform me!</h2>
        </div>
      </PerspectiveTransform>
    </>
  );
}
```

## With Different Toggle Keys

```tsx
<PerspectiveTransform toggleKeys={["t"]}>
  <h1>Warpable Title</h1>
</PerspectiveTransform>
```

- Now Shift+T toggles edit mode.

Feel free to explore more advanced usage like restricting corner movement or hooking into other state management libraries (Redux, Zustand, etc.).
