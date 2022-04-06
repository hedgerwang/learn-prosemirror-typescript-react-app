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
  className?: string | null | undefined;
}) {
  const { className, editorState, editorView, onTransaction } = props;
  const disabled = !editorState || redoDepth(editorState) === 0;
  const classNames = cx(BUTTON, { [BUTTON_DISABLED]: disabled }, className);

  const onClick = useCallback(() => {
    editorState && redo(editorState, onTransaction);
  }, [editorState, editorView, onTransaction]);

  return (
    <button className={classNames} disabled={disabled} onClick={onClick}>
      Redo
    </button>
  );
}
