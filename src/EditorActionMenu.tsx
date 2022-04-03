// @flow
import { redo, redoDepth } from "prosemirror-history";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback, useEffect, useRef } from "react";
import cx from "classnames";
import { BUTTON, BUTTON_DISABLED } from "./styles";

export default function EditorActionMenu(props: { editorView: EditorView }) {
  const { editorView } = props;
  const elRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = elRef.current;
      if (el) {
        const button = el.querySelector("button");
        button && button.focus();
      }
    });
    return () => clearTimeout(timer);
  }, []);

  const onKeyDown = useCallback(
    (e: any) => {
      const { key, target } = e;
      let nextFocusEl;
      let action = "close-action-menu";
      if (target instanceof HTMLButtonElement) {
        if (key === "ArrowDown" || key === "ArrowRight") {
          nextFocusEl = target.nextElementSibling;
          e.preventDefault();
        } else if (key === "ArrowUp" || key === "ArrowLeft") {
          nextFocusEl = target.previousElementSibling;
          e.preventDefault();
        } else if (key === "Enter") {
          e.preventDefault();
          // perform action.
        }
      }

      if (nextFocusEl instanceof HTMLButtonElement) {
        nextFocusEl.focus();
        e.stopPropagation();
      } else {
        editorView.focus();
        const tr = editorView.state.tr.setMeta("action", action);
        editorView.dispatch(tr);
      }
    },
    [editorView]
  );
  return (
    <div
      className="absolute bg-white left-0 p-4 shadow top-0 flex flex-col"
      tabIndex={-1}
      ref={elRef}
      onKeyDown={onKeyDown}
    >
      <button className={BUTTON}>AAA</button>
      <button className={BUTTON}>AAA</button>
      <button className={BUTTON}>AAA</button>
    </div>
  );
}
