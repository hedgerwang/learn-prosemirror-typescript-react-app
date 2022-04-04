// @flow
import { redo, redoDepth } from "prosemirror-history";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback } from "react";
import cx from "classnames";
import { BUTTON, BUTTON_DISABLED } from "./styles";

export default function RedoButton(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
}) {
  const { editorState, editorView, onTransaction } = props;

  const disabled = !editorState || redoDepth(editorState) === 0;

  const className = cx(BUTTON, "block my-2", { [BUTTON_DISABLED]: disabled });

  const onClick = useCallback(() => {
    editorView && editorView.focus();
    editorState && redo(editorState, onTransaction);
  }, [editorState, editorView, onTransaction]);

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      Redo
    </button>
  );
}
