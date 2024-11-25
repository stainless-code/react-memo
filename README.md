# @stainless-code/react-memo

A utility library to simplify and enhance memoization for React functional components using `React.memo`.

## Features

- Simplify memoization with `React.memo`.
- Fine-grained control over dependency-based re-renders.
- Support for one-time memoization where components never re-render.
- Fully type-safe with TypeScript.

## Installation

### npm

```bash
npm install @stainless-code/react-memo
```

### yarn

```bash
yarn add @stainless-code/react-memo
```

### pnpm

```bash
pnpm add @stainless-code/react-memo
```

### bun

```bash
bun add @stainless-code/react-memo
```

## Usage

Enhance your React components with precise memoization:

```tsx
import { withMemo, withMemoOnce } from "@stainless-code/react-memo";
import React from "react";

const MyComponent: React.FC<{ value: number; onClick: () => void }> = ({
  value,
  onClick,
}) => <button onClick={onClick}>{value}</button>;

// Memoize based on specific dependencies
const MemoizedComponent = withMemo(MyComponent, ["value"]);

// Memoize the component to never re-render
const MemoizedOnceComponent = withMemoOnce(MyComponent);

export default function App() {
  return (
    <>
      <MemoizedComponent value={10} onClick={() => console.log("Clicked!")} />
      <MemoizedOnceComponent
        value={20}
        onClick={() => console.log("Clicked again!")}
      />
    </>
  );
}
```

## Typesafety

### Example: Type Mismatch (Fails)

If the `dependencyProps` contain keys that don't exist on the component's props, TypeScript will throw an error:

```tsx
import { withMemo } from "@stainless-code/react-memo";
import React from "react";

const MyComponent: React.FC<{ value: number; onClick: () => void }> = ({
  value,
  onClick,
}) => <button onClick={onClick}>{value}</button>;

// ❌ TypeScript Error: "nonExistentProp" does not exist on the props of MyComponent.
const MemoizedComponent = withMemo(MyComponent, ["value", "nonExistentProp"]);

export default MemoizedComponent;
```

### Example: Type Match (Succeeds)

If the `dependencyProps` accurately reflect the keys of the component's props, TypeScript ensures everything works smoothly:

```tsx
import { withMemo } from "@stainless-code/react-memo";
import React from "react";

const MyComponent: React.FC<{ value: number; onClick: () => void }> = ({
  value,
  onClick,
}) => <button onClick={onClick}>{value}</button>;

// ✅ TypeScript passes: "value" and "onClick" are valid props for MyComponent.
const MemoizedComponent = withMemo(MyComponent, ["value", "onClick"]);

export default MemoizedComponent;
```

## API

### `withMemo`

Enhance a functional component with memoization, allowing re-renders only when specific dependencies or props change.

| Parameter          | Type          | Default     | Description                                                                      |
| ------------------ | ------------- | ----------- | -------------------------------------------------------------------------------- |
| `Component`        | `React.FC<T>` | Required    | The React functional component to memoize.                                       |
| `dependencyProps?` | `(keyof T)[]` | `undefined` | An array of prop names to check for changes. If omitted, all props are compared. |

Returns a `React.MemoExoticComponent` that wraps the input component.

### `withMemoOnce`

Memoize a functional component such that it never re-renders, regardless of prop changes.

| Parameter   | Type          | Default  | Description                                |
| ----------- | ------------- | -------- | ------------------------------------------ |
| `Component` | `React.FC<T>` | Required | The React functional component to memoize. |

Returns a `React.MemoExoticComponent` that wraps the input component.

## Contributing

Feel free to submit issues or pull requests to improve the library. Every bit of help is appreciated. 💖

[Read the contribution guidelines](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
