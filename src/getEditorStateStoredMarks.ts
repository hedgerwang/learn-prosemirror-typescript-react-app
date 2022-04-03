// @flow

import { EditorState } from "prosemirror-state";
import type { Mark } from "prosemirror-model";

export default function getEditorStateStoreMarks(
  editorState: EditorState
): Mark[] | null {
  const { storedMarks, selection } = editorState;
  if (storedMarks && storedMarks.length) {
    return storedMarks;
  }
  if (selection.$to.parentOffset) {
    return selection.$from.marks();
  }
  return null;
}
