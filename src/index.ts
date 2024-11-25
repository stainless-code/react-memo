import { memo } from "react";

/**
 * A higher-order function that enhances a React functional component with `React.memo` for memoization.
 *
 * - If `dependencyProps` is provided, the component will only re-render if any of the specified props in the
 *   `dependencyProps` array have changed.
 * - If `dependencyProps` is not provided, all props will be tested for equality to determine if the component
 *   should re-render.
 *
 * Equality checks are performed using `JSON.stringify` for deep comparison, and direct reference comparison for functions.
 *
 * @template T - The props type of the wrapped component.
 * @param {React.FC<T>} Component - The React functional component to be memoized.
 * @param {(keyof T)[]} [dependencyProps] - An optional array of prop names to check for equality. If not provided, all props are compared.
 * @returns {React.MemoExoticComponent<React.FC<T>>} A memoized version of the provided component.
 */
export function withMemo<T>(
  Component: React.FC<T>,
  dependencyProps?: (keyof T)[],
): React.MemoExoticComponent<React.FC<T>> {
  return memo(Component, (prevProps, nextProps) => {
    let isEqual = true;

    const allProps = Object.keys(prevProps) as (keyof T)[];
    const propsLength = dependencyProps
      ? dependencyProps.length
      : allProps.length;

    for (let i = 0; i < propsLength; i++) {
      const propName = dependencyProps ? dependencyProps[i] : allProps[i];
      const prevProp = prevProps[propName];
      const nextProp = nextProps[propName];

      // compare equality between functions
      if (typeof prevProp === "function") {
        if (prevProp !== nextProp) {
          isEqual = false;
          break;
        }
      }

      // compare equality between primitives, arrays, objects...
      if (JSON.stringify(prevProp) !== JSON.stringify(nextProp)) {
        isEqual = false;
        break;
      }
    }

    return isEqual;
  });
}

/**
 * A higher-order function that enhances a React functional component with `React.memo` for one-time memoization.
 *
 * The wrapped component will never re-render, regardless of prop changes.
 *
 * @template T - The props type of the wrapped component.
 * @param {React.FC<T>} Component - The React functional component to be memoized.
 * @returns {React.MemoExoticComponent<React.FC<T>>} A memoized version of the provided component that will not re-render.
 */
export function withMemoOnce<T>(
  Component: React.FC<T>,
): React.MemoExoticComponent<React.FC<T>> {
  return memo(Component, () => true);
}
