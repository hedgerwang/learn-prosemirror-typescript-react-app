// @flow

import { EditorState, Transaction } from "prosemirror-state";
import getEditorStateStoredMarks from "./getEditorStateStoredMarks";

export default function applyTransaction(
  editorState: EditorState,
  tr: Transaction
): EditorState {
  const { storedMarks } = tr;
  if (!storedMarks || !storedMarks.length) {
    const marks = getEditorStateStoredMarks(editorState);
    if (marks) {
      tr = tr.setStoredMarks(marks);
    }
  }
  return editorState.apply(tr);
}
