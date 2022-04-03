// @flow

import { Schema } from "prosemirror-model";
import { Transaction, TextSelection } from "prosemirror-state";

export default function setTextHighlightColor(
  schema: Schema,
  tr: Transaction,
  color: string
): Transaction {
  const markType = schema.marks.textHighlightColor;
  if (!markType) {
    return tr;
  }
  const { selection } = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }
  const mark = markType.create({ color });
  tr = tr.addMark(selection.from, selection.to, mark);
  tr = tr.addStoredMark(mark);
  return tr;
}
