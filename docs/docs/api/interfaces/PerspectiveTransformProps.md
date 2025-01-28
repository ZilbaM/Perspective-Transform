[**react-perspective-transform**](../README.md)

***

[react-perspective-transform](../README.md) / PerspectiveTransformProps

# Interface: PerspectiveTransformProps

Defined in: [src/PerspectiveTransform.tsx:41](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L41)

Props for the PerspectiveTransform component.

## Properties

### children

> **children**: `ReactNode`

Defined in: [src/PerspectiveTransform.tsx:46](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L46)

The child node(s) to which we apply the perspective transform.
Usually an image, video, or other content.

***

### editable?

> `optional` **editable**: `boolean`

Defined in: [src/PerspectiveTransform.tsx:70](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L70)

Whether the component is currently in edit mode. If provided, this prop controls
edit mode externally. If omitted, SHIFT+[toggleKeys] toggles a local edit mode.

***

### onEditableChange()?

> `optional` **onEditableChange**: (`nextEditable`) => `void`

Defined in: [src/PerspectiveTransform.tsx:76](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L76)

If edit mode is controlled from outside, this callback is triggered when SHIFT+[toggleKeys]
is pressed. Passes the next boolean value for edit mode.

#### Parameters

##### nextEditable

`boolean`

#### Returns

`void`

***

### onPointsChange()?

> `optional` **onPointsChange**: (`points`) => `void`

Defined in: [src/PerspectiveTransform.tsx:57](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L57)

Called whenever corner points change, e.g., when a user drags them.

#### Parameters

##### points

[`Points`](Points.md)

#### Returns

`void`

***

### points?

> `optional` **points**: [`Points`](Points.md)

Defined in: [src/PerspectiveTransform.tsx:52](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L52)

If provided, points become controlled from outside.
The component will always use these points instead of its local state.

***

### storageKey?

> `optional` **storageKey**: `string`

Defined in: [src/PerspectiveTransform.tsx:64](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L64)

If set, the component will store and retrieve corner points from localStorage
under this key (uncontrolled scenario). If `points` is controlled, localStorage
logic is not used.

***

### toggleKeys?

> `optional` **toggleKeys**: `string`[]

Defined in: [src/PerspectiveTransform.tsx:82](https://github.com/ZilbaM/react-perspective-transform/blob/0bebb08994811f7c5c3331829addf567b7ecffc1/src/PerspectiveTransform.tsx#L82)

An array of lowercase keys that, when pressed with SHIFT, toggle edit mode.
Defaults to ["p"].
