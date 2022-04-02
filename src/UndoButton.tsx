// @flow
import { undo, undoDepth } from "prosemirror-history";
import { EditorState, Transaction } from "prosemirror-state";
import { useCallback } from "react";
import cx from "classnames";
import { BUTTON, BUTTON_DISABLED } from "./styles";
import { EditorView } from "prosemirror-view";

export default function UndoButton(props: {
  editorView: EditorView | null;
  editorState: EditorState;
  onTransaction: (tr: Transaction) => void;
}) {
  const { editorState, editorView, onTransaction } = props;

  const disabled = !editorState || undoDepth(editorState) === 0;

  const className = cx(BUTTON, "block my-2", { [BUTTON_DISABLED]: disabled });

  const onClick = useCallback(() => {
    editorState && undo(editorState, onTransaction);
    editorView && editorView.focus();
  }, [editorState, editorView, onTransaction]);

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      Undo
    </button>
  );
}
