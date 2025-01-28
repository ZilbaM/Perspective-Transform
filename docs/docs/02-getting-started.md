---
title: Getting Started
slug: /getting-started
---

# Getting Started

This guide covers the basic setup, installation, and a minimal usage example.

## Installation

Use **npm** or **yarn**:

```bash
npm install react-perspective-transform
# or
yarn add react-perspective-transform
```

## Basic Usage 

```tsx
import React from 'react';
import PerspectiveTransform from 'react-perspective-transform';

function App() {
  return (
    <div style={{ width: 500, height: 300 }}>
      <PerspectiveTransform storageKey="example-transform">
        <img src="/my-image.png" alt="Transformable" style={{ width: '100%' }} />
      </PerspectiveTransform>
    </div>
  );
}

export default App;
```

### Explanation

- `storageKey` tells the component to persist corner positions in `localStorage` under "example-transform".
- If you hold **Shift + P** in the browser (default hotkey), corner handles become visible and can be dragged.

## Next Steps

- Learn the difference between **Uncontrolled** vs. **Controlled** usage (see **Controlled vs. Uncontrolled**).
- Dive deeper into **Edit Mode** toggles and customizing keys.
- Check out the [API Reference](./api/README.md) for all supported props.
  