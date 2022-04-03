import { RefObject, useEffect, useRef } from "react";

export default function useFocusBoundary(
  focusRoot: RefObject<HTMLElement | null>,
  props: {
    autoFocus?: boolean | null | typeof undefined | number;
    onFocusLeave: () => void;
  }
) {
  const { onFocusLeave, autoFocus } = props;
  const isFocused = useRef(false);

  useEffect(() => {
    const el = autoFocus ? focusRoot.current : null;
    if (!el) {
      return;
    }
    const delay = typeof autoFocus === "number" ? autoFocus : 0;
    const timer = setTimeout(() => {
      const ff = el.querySelector("input, button");
      if (ff instanceof HTMLElement) {
        ff.focus();
      }
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [autoFocus, focusRoot]);

  useEffect(() => {
    const el = focusRoot.current;
    if (el) {
      let timer = 0;
      const onFocus = () => {
        timer && window.clearTimeout(timer);
        timer = 0;
        if (!isFocused.current) {
          isFocused.current = true;
        }
      };
      const onBlur = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (isFocused.current) {
            isFocused.current = false;
            timer = 0;
            onFocusLeave();
          }
        });
      };
      el.addEventListener("focusin", onFocus);
      el.addEventListener("focusout", onBlur);
      return () => {
        window.clearTimeout(timer);
        el.removeEventListener("focusin", onFocus);
        el.removeEventListener("focusout", onBlur);
      };
    }
  }, [focusRoot, onFocusLeave]);
}
