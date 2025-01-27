# react-perspective-transform

A lightweight React component that applies a perspective transform to its children, allowing you to shift each corner independently. Useful for drag-and-drop transformations, interactive demos, or animating UI elements.

## Table of Contents
- [react-perspective-transform](#react-perspective-transform)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
    - [Explanation](#explanation)
  - [Props](#props)
    - [`children`](#children)
  - [Advanced Editing](#advanced-editing)
    - [Interaction Details](#interaction-details)
  - [How It Works](#how-it-works)
  - [Development and Contributing](#development-and-contributing)
    - [Contributing](#contributing)
  - [License](#license)

---

## Installation

```bash
npm install react-perspective-transform
```

or

```bash
yarn add react-perspective-transform
```

## Basic Usage

Here's a quick example of how to use `react-perspective-transform` in your React application:

```tsx
import React from 'react';
import PerspectiveTransform from 'react-perspective-transform';

function App() {
  return (
    <div style={{ width: 400, height: 400, border: '1px solid #ccc' }}>
      <PerspectiveTransform>
        <div style={{ backgroundColor: 'lightblue', width: '100%', height: '100%' }}>
          <h3>Hello World</h3>
        </div>
      </PerspectiveTransform>
    </div>
  );
}

export default App;
```

### Explanation
1. **Wrapping Content**: The `PerspectiveTransform` component will apply a transform to whatever you place inside it.
2. **Container Size**: For transformations to work correctly, ensure the parent container has a defined width and height.
3. **Dragging Corners**: By default, corners are not visible. Press `Shift+P` in the browser to toggle corner edit mode.

---

## Props

### `children`
Type: `React.ReactNode`

- The content you want to apply the perspective transform to.

*(No other props are needed—transformation logic is managed internally.)*

---

## Advanced Editing

By pressing `Shift + P` in the browser, you can toggle an **edit mode** that shows draggable corner points. Drag the corners around to change the perspective.

### Interaction Details
- **Corner Points**: Each corner can be positioned independently.
- **Transforms**: The transform is recalculated on each drag.
- **React Synthetic vs. DOM Events**: The corners use native DOM events under the hood to capture movement.

---

## How It Works

Unlike some libraries that copy your content into a `<canvas>` for perspective transformations—which can cause pixelation or aliasing—**react-perspective-transform** relies on the native **CSS transform** property. This ensures that:

- **No Loss in Quality**: Text, images, and other elements remain sharp as they are rendered using HTML/CSS rather than rasterized canvas pixels.
- **Better Performance**: The library only recalculates and applies a `matrix3d` CSS transform, avoiding the overhead of redrawing onto a canvas.
- **Seamless Integration**: You can nest standard React components or HTML elements inside, and they’ll transform correctly without additional effort.

Under the hood, the library calculates a perspective transform using four draggable corners. These corners update the `matrix3d` function in real time, letting you dynamically warp your layout without re-rasterizing the content.

---

## Development and Contributing

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/ZilbaM/react-perspective-transform.git
   cd react-perspective-transform
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Build**:
   ```bash
   npm run build
   ```
4. **Local Development**:
   ```bash
   npm start
   ```
   This will start a dev server (if configured) so you can test changes.

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Make sure to add or update tests as appropriate.

---

## License

[MIT](./LICENSE)

