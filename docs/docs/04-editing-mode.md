---
title: Editing Mode
slug: /editing-mode
---

# Editing Mode

## Toggling Edit Mode

By default, you can press **Shift+P** to toggle edit mode. Corner handles appear, letting you drag each corner individually. You can customize this key by passing `toggleKeys`:

```tsx
<PerspectiveTransform toggleKeys={["r", "m"]}>
  <img src="/photo.jpg" />
</PerspectiveTransform>
```

Now, **Shift+R** or **Shift+M** toggles edit mode.

## Editable Prop (Controlled Edit Mode)

If you want to handle edit mode from the parent, pass the `editable` boolean:

```tsx
function ControlledEditMode() {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <div>
      <button onClick={() => setIsEditable(!isEditable)}>Toggle Edit</button>
      <PerspectiveTransform
        editable={isEditable}
        onEditableChange={setIsEditable}
      >
        <img src="/photo.jpg" />
      </PerspectiveTransform>
    </div>
  );
}
```

- `onEditableChange` is called when Shift + `[toggleKeys]` is pressed, letting the parent know to update its `editable` state.

## Corner Control Points

When edit mode is **on**, each corner has a draggable handle. The styles for `.control-point` are in `style.css`. Customize these to change color, shape, or size.

---

### Alignment Guides

In edit mode, an overlay (`.alignment-guides`) is rendered **inside** the transformed wrapper. This means the grid will warp with the content. You can style `.alignment-guides` for grid lines, bounding boxes, or other alignment visuals.
