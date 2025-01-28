---
title: Controlled vs. Uncontrolled
slug: /controlled-vs-uncontrolled
---

# Controlled vs. Uncontrolled Mode

PerspectiveTransform can manage its own corner states (uncontrolled) or accept `points` and `editable` props from the parent (controlled). Below we explore both patterns:

## Uncontrolled Mode

In **uncontrolled mode**, you do _not_ pass the `points` prop. The component stores corner states internally. Optionally, you can provide a `storageKey` for persistence:

```tsx
<PerspectiveTransform storageKey="uncontrolled-demo">
  <img src="unicorn.png" alt="Unicorn" />
</PerspectiveTransform>
```

- The user can drag corners and toggle edit mode using SHIFT + P.
- If `storageKey` is set, changes are saved to `localStorage`.

## Controlled Mode

In **controlled mode**, you pass a `points` object and manage corner states in your own application. For example:

```tsx
function ControlledExample() {
  const [points, setPoints] = useState<Points>({
    topLeft: { x: 50, y: 50 },
    topRight: { x: 250, y: 50 },
    bottomRight: { x: 250, y: 200 },
    bottomLeft: { x: 50, y: 200 },
  });
  const [editable, setEditable] = useState(false);

  return (
    <PerspectiveTransform
      points={points}
      onPointsChange={setPoints}
      editable={editable}
      onEditableChange={setEditable}
    >
      <div style={{ width: 300, height: 150, background: 'blue' }} />
    </PerspectiveTransform>
  );
}
```

### Key Differences

- **Uncontrolled**: The component is simpler to set up, and can optionally persist data in localStorage. 
- **Controlled**: You have full control over `points` and `editable`. Perfect if you want to sync with Redux, a server, or your own state management.

---

## Changing Modes Dynamically

You generally want to pick one approach per instance. If you provide `points`, the component treats them as the source of truth. If you omit `points`, it manages them internally.
