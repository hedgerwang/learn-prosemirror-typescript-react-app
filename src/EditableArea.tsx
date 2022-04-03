// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useEffect, useRef } from "react";

type Props = {
  editorState: EditorState;
  onTransaction: (tr: Transaction) => void;
  onReady: (view: EditorView) => void;
};

export default function EditableArea(props: Props) {
  const { editorState, onReady, onTransaction } = props;

  const elementRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const editorStateRef = useRef(editorState);
  const onReadyRef = useRef(onReady);

  // Changes of onTransaction does not trigger re-render.
  // Store it as local reference that can be used by `editorView` later.
  const onTransactionRef = useRef(onTransaction);

  useEffect(() => {
    // This creates EditorView when the component is mounted and destroys it
    // when the component is unmounted.
    const element = elementRef.current;
    if (element) {
      const editorView = new EditorView(element, {
        dispatchTransaction: (tr) => onTransactionRef.current(tr),
        state: editorStateRef.current,
      });

      editorViewRef.current = editorView;
      onReadyRef.current(editorView);

      const { dom } = editorView;
      if (!(dom instanceof HTMLElement)) {
        throw new Error("bad dom");
      }

      dom.className +=
        " bg-white border border-1 break-all h-full m-auto shadow mx-auto outline-none overflow-auto p-6 text-base w-full";

      dom.style.cssText = "max-width: 210mm;";

      let focusTimer = 0;

      const onFocus = () => {
        focusTimer && window.clearTimeout(focusTimer);
        focusTimer = window.setTimeout(() => {
          focusTimer = 0;
          // This will inform `textCaretPlugin()` to display UI.
          const tr = editorView.state.tr.setMeta("action", "focus");
          onTransactionRef.current(tr);
        }, 100);
      };

      const onBlur = () => {
        focusTimer && window.clearTimeout(focusTimer);
        focusTimer = window.setTimeout(() => {
          focusTimer = 0;
          // This will inform `textCaretPlugin()` to hide UI.
          const tr = editorView.state.tr.setMeta("action", "blur");
          onTransactionRef.current(tr);
        }, 100);
      };

      dom.addEventListener("focusin", onFocus, true);
      dom.addEventListener("focusout", onBlur, true);

      editorView.focus();
      return () => {
        clearTimeout(focusTimer);
        focusTimer = 0;
        dom.removeEventListener("focusin", onFocus, true);
        dom.removeEventListener("focusout", onBlur, true);
        editorView.destroy();
        editorViewRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    onTransactionRef.current = onTransaction;
  }, [onTransaction]);

  // Ensure that view always sync to editor state.
  useEffect(() => {
    editorStateRef.current = editorState;
    const editorView = editorViewRef.current;
    if (editorView && editorState && editorView.state !== editorState) {
      editorView.updateState(editorState);
    }
  }, [editorState]);

  return <div className="content flex flex-1" ref={elementRef} />;
}
