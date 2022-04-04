// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useEffect, useRef } from "react";
import applyDevTools from "prosemirror-dev-tools";

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
        " bg-white border border-1 break-all min-h-full m-auto mx-auto" +
        " outline-none p-6 shadow text-base shadow w-full" +
        " whitespace-pre-wrap";

      dom.style.cssText = "max-width: 210mm;";

      editorView.focus();

      applyDevTools(editorView);
      return () => {
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
