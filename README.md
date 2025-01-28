# React Perspective Transform

A lightweight **React** component that applies a perspective transform to its children, allowing you to manipulate each corner independently. Perfect for interactive demos, image warping, or advanced UI effects.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Overview

`react-perspective-transform` handles corner-based transformations with just CSS `matrix3d`, preserving the crispness of text and images. It supports:

- **Draggable Corners**: Press <kbd>Shift + P</kbd> (or custom keys) to toggle edit mode.
- **Controlled or Uncontrolled** usage
- **Optional Local Storage** persistence
- **Matrix-based transforms** for smooth performance

For detailed documentation, including advanced usage, API reference, and guides, visit the **[official docs site](https://zilbam.github.io/react-perspective-transform)**.

---

## Installation

```bash
npm install react-perspective-transform
# or
yarn add react-perspective-transform
```

## Quick Start

```tsx
import React from 'react';
import PerspectiveTransform from 'react-perspective-transform';

export default function App() {
  return (
    <div style={{ width: 400, height: 300, border: '1px solid #ccc' }}>
      <PerspectiveTransform>
        <img src="/path/to/image.jpg" alt="Warp Me" style={{ width: '100%' }} />
      </PerspectiveTransform>
    </div>
  );
}
```

1. **Wrap your content** in `<PerspectiveTransform>`.
2. **Press <kbd>Shift + P</kbd>** in the browser to toggle edit mode and drag corners.
3. Adjust the parent container’s width and height to see real transformations.

---

## Documentation

Looking for **advanced guides**, **API reference**, or **contribution docs**?
Check out the **[Complete Documentation](./docs/intro.md)** for:

- **Controlled vs. Uncontrolled** usage  
- **Edit Mode** configuration and hotkeys  
- **Persistence** with `storageKey`  
- **TypeDoc** API reference  
- **FAQ** and more

---

## Contributing

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ZilbaM/react-perspective-transform.git
   cd react-perspective-transform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build and test**:
   ```bash
   npm run build
   npm test
   ```

4. **Open a pull request**:
   - Please open an issue to discuss major changes.
   - Ensure tests pass and updates are covered.

---

## License

[MIT License](./LICENSE) © 2023 ZilbaM

