import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  CSSProperties,
} from "react";

interface FakeTextareaProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  style?: CSSProperties;
  autoResize?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface FakeTextareaRef {
  value: string;
  reset: () => void;
}

export const FakeTextarea = forwardRef<FakeTextareaRef, FakeTextareaProps>(
  ({ placeholder, defaultValue, className, style, autoResize, size }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isEmpty, setIsEmpty] = useState(!defaultValue);

    useImperativeHandle(ref, () => ({
      get value() {
        return divRef.current?.textContent || "";
      },
      reset: () => {
        if (divRef.current) {
          divRef.current.textContent = "";
          setIsEmpty(true);
        }
      },
    }));

    useEffect(() => {
      if (divRef.current && defaultValue) {
        divRef.current.textContent = defaultValue;
        setIsEmpty(false);
      }
    }, [defaultValue]);

    const handleInput = () => {
      const content = divRef.current?.textContent || "";
      setIsEmpty(content.length === 0);
    };

    const handleFocus = () => {
      if (!divRef.current) return;

      if (isEmpty && divRef.current?.textContent === placeholder) {
        divRef.current.textContent = "";
      }
    };

    const handleBlur = () => {
      const content = divRef.current?.textContent || "";
      if (content.length === 0) {
        setIsEmpty(true);
      }
    };

    return (
      <div
        ref={divRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "600px",
          outline: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          ...style,
        }}
        suppressContentEditableWarning
      >
        {isEmpty && placeholder && (
          <span
            style={{
              color: "var(--vapor-color-text-placeholder, #999)",
              pointerEvents: "none",
              position: "absolute",
            }}
          >
            {placeholder}
          </span>
        )}
      </div>
    );
  }
);

FakeTextarea.displayName = "FakeTextarea";
