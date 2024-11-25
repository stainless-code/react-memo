import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { withMemo, withMemoOnce } from "./index";

// A simple functional component for testing
const TestComponent: React.FC<{ value: number; onClick: () => void }> = ({
  value,
  onClick,
}) => <button onClick={onClick}>{value}</button>;

describe("withMemo", () => {
  it("should re-render when a dependency prop changes", () => {
    const MemoizedComponent = withMemo(TestComponent, ["value"]);

    const onClickMock = vi.fn();
    const { rerender, container } = render(
      <MemoizedComponent value={1} onClick={onClickMock} />,
    );

    // Initial render
    expect(container.textContent).toBe("1");

    // Rerender with different "value" prop
    rerender(<MemoizedComponent value={2} onClick={onClickMock} />);
    expect(container.textContent).toBe("2");
  });

  it("should not re-render when a non-dependency prop changes", () => {
    const MemoizedComponent = withMemo(TestComponent, ["value"]);

    const onClickMock1 = vi.fn();
    const onClickMock2 = vi.fn();
    const { rerender, container } = render(
      <MemoizedComponent value={1} onClick={onClickMock1} />,
    );

    // Initial render
    expect(container.textContent).toBe("1");

    // Rerender with the same "value" but different "onClick"
    rerender(<MemoizedComponent value={1} onClick={onClickMock2} />);
    expect(container.textContent).toBe("1");
  });

  it("should re-render when no dependency props are provided and any prop changes", () => {
    const MemoizedComponent = withMemo(TestComponent);

    const onClickMock1 = vi.fn();
    const onClickMock2 = vi.fn();
    const { rerender, container } = render(
      <MemoizedComponent value={1} onClick={onClickMock1} />,
    );

    // Initial render
    expect(container.textContent).toBe("1");

    // Rerender with a different "value"
    rerender(<MemoizedComponent value={2} onClick={onClickMock1} />);
    expect(container.textContent).toBe("2");

    // Rerender with a different "onClick"
    rerender(<MemoizedComponent value={2} onClick={onClickMock2} />);
    expect(container.textContent).toBe("2");
  });

  it("should not throw an error but will compare undefined values", () => {
    // @ts-expect-error intended
    const MemoizedComponent = withMemo(TestComponent, ["invalidProp"]);

    const { rerender, container } = render(
      <MemoizedComponent value={1} onClick={() => {}} />,
    );

    expect(container.textContent).toBe("1");

    // Rerendering will not change the displayed value because "invalidProp" doesn't affect rendering
    rerender(<MemoizedComponent value={2} onClick={() => {}} />);
    expect(container.textContent).toBe("1"); // No re-render triggered.
  });
});

describe("withMemoOnce", () => {
  it("should not re-render regardless of prop changes", () => {
    const MemoizedOnceComponent = withMemoOnce(TestComponent);

    const onClickMock1 = vi.fn();
    const onClickMock2 = vi.fn();
    const { rerender, container } = render(
      <MemoizedOnceComponent value={1} onClick={onClickMock1} />,
    );

    // Initial render
    expect(container.textContent).toBe("1");

    // Attempt to rerender with different "value"
    rerender(<MemoizedOnceComponent value={2} onClick={onClickMock1} />);
    expect(container.textContent).toBe("1");

    // Attempt to rerender with different "onClick"
    rerender(<MemoizedOnceComponent value={2} onClick={onClickMock2} />);
    expect(container.textContent).toBe("1");
  });
});
