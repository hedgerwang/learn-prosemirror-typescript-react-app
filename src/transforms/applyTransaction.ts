// @flow

import { EditorState, Transaction } from "prosemirror-state";
import getEditorStateStoredMarks from "./getEditorStateStoredMarks";
import checkWorksheetMode from "./checkWorksheetMode";

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

  return checkWorksheetMode(editorState, tr);
}
