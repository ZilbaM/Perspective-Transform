---
title: FAQ
slug: /faq
---

# Frequently Asked Questions

## 1. Why isn't edit mode toggling when I press Shift+P?

- Make sure your window has focus, and check that no other event listeners are preventing the keydown event.
- If you changed the toggle key with `toggleKeys`, confirm you’re pressing the right keys (e.g., Shift+R).
- If you’re using a parent’s `editable` prop, ensure `onEditableChange` is implemented.

## 2. My content is cropped or not visible. Why?

- Ensure the parent container has a fixed **width** and **height**. The perspective transform is calculated based on the container’s bounding rect, so `width: 100%` and `height: 100%` inside a zero-height parent can be problematic.

## 3. Can I restrict corner movement or add snapping?

- Not currently built-in. You can add logic in `onPointsChange` to clamp or round corner positions before storing them.
- Alternatively, fork the code to enhance the drag logic or add a “snap to grid” approach.

## 4. How do I change the color and size of corner handles?

- Override the `.control-point` CSS class. You can give them backgrounds, borders, etc. For example:

  ```css
  .control-point {
    width: 16px;
    height: 16px;
    background-color: red;
    border-radius: 50%;
    cursor: grab;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  ```

## 5. Where can I see a live demo?

- Create a simple CRA or Next.js app with `PerspectiveTransform`, or check any [codesandbox.io](https://codesandbox.io/) links in the README.

## 6. Can I transform multiple child elements simultaneously?

- Yes, if you wrap multiple elements in the same `<PerspectiveTransform>`:

  ```tsx
  <PerspectiveTransform>
    <img src=\"left.png\" />
    <img src=\"right.png\" />
  </PerspectiveTransform>
  ```

  Both images are in the same transform plane. For separate transforms, use two separate `<PerspectiveTransform>` components.
