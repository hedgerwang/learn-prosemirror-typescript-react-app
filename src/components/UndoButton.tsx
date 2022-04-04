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
  className?: string | null | undefined;
}) {
  const { editorState, editorView, onTransaction, className } = props;
  const disabled = !editorState || undoDepth(editorState) === 0;
  const classNames = cx(BUTTON, { [BUTTON_DISABLED]: disabled }, className);

  const onClick = useCallback(() => {
    editorView && editorView.focus();
    editorState && undo(editorState, onTransaction);
  }, [editorState, editorView, onTransaction]);

  return (
    <button className={classNames} disabled={disabled} onClick={onClick}>
      Undo
    </button>
  );
}
