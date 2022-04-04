// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";

export default function HistoryControls(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
}) {
  const { editorState, editorView, onTransaction } = props;
  return (
    <div className="flex flex-row my-2 overflow-hidden rounded-md">
      <UndoButton
        editorState={editorState}
        editorView={editorView}
        onTransaction={onTransaction}
        className="flex-1"
      />
      <RedoButton
        editorState={editorState}
        editorView={editorView}
        onTransaction={onTransaction}
        className="flex-1"
      />
    </div>
  );
}
