// @flow

import { EditorState, TextSelection } from "prosemirror-state";
import findMarksBetween from "../transforms/findMarksBetween";
import getEditorStateStoreMarks from "../transforms/getEditorStateStoredMarks";
import { useEffect, useState } from "react";

export default function useActiveTextHighlightColor(
  editorState: EditorState
): string {
  const [activeColor, setActiveColor] = useState<string>("#fff");

  useEffect(() => {
    let color: string | null = null;
    const { selection, schema, doc } = editorState;
    const markType = schema.marks.textHighlightColor;
    if (!markType) {
      return;
    }
    if (!(selection instanceof TextSelection)) {
      return;
    }

    const marks = findMarksBetween(doc, markType, selection.from, selection.to);
    if (marks.length === 0 && selection.empty) {
      const storedMarks = getEditorStateStoreMarks(editorState);
      if (storedMarks) {
        marks.push.apply(marks, storedMarks);
      }
    }

    const firstMark = marks[0];
    const firstMarkColor = firstMark?.attrs?.color;

    if (
      firstMarkColor &&
      marks.every((m) => m.attrs.color === firstMarkColor)
    ) {
      color = firstMarkColor;
    }

    color = color || "#fff";
    if (color !== activeColor) {
      setActiveColor(color);
    }
  }, [activeColor, setActiveColor, editorState]);

  return activeColor;
}
