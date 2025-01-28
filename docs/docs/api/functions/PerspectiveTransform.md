[**react-perspective-transform**](../README.md)

***

[react-perspective-transform](../README.md) / PerspectiveTransform

# Function: PerspectiveTransform()

> **PerspectiveTransform**(`props`): `ReactNode` \| `Promise`\<`ReactNode`\>

Defined in: [src/PerspectiveTransform.tsx:93](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L93)

A React component that applies a perspective transform to its children.
It can be controlled (passing `points` and `editable`) or uncontrolled
(managing points internally, optionally persisting them to localStorage).

In edit mode, users can drag corner handles to adjust the perspective.
Edit mode can be toggled by SHIFT+[toggleKeys] or controlled via the `editable` prop.

## Parameters

### props

[`PerspectiveTransformProps`](../interfaces/PerspectiveTransformProps.md)

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
