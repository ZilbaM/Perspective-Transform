---
title: Persistence
slug: /persistence
---

# Persistence with LocalStorage

**PerspectiveTransform** supports localStorage-based persistence for **uncontrolled** corner states.

## Using `storageKey`

Pass a unique `storageKey` to store user-dragged corner values:

```tsx
<PerspectiveTransform storageKey="my-unique-key">
  <video src="clip.mp4" />
</PerspectiveTransform>
```

- On initial render, if localStorage has saved data under `"my-unique-key"`, the component loads those corners.
- Whenever corners change, the component saves them back to localStorage.

## Multiple Instances

If you have multiple transforms on one page, use distinct keys:

```tsx
<PerspectiveTransform storageKey="transform-1">
  <img src="left.png" />
</PerspectiveTransform>
<PerspectiveTransform storageKey="transform-2">
  <img src="right.png" />
</PerspectiveTransform>
```

## Potential Pitfalls

- If you switch from no `storageKey` to a particular `storageKey`, old data may override your default corners on reload.
- If you use the **controlled** mode (`points` prop), `storageKey` is ignored for that instance.
