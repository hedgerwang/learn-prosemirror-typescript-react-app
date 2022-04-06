// @flow

import { Transaction } from "prosemirror-state";
import setDocNodeAttrs from "./setDocNodeAttrs";
import { Schema } from "prosemirror-model";

export default function setWorksheetMode(
  schema: Schema,
  tr: Transaction,
  enabled: boolean
): Transaction {
  if (enabled === !!tr.doc.attrs.worksheetMode) {
    return tr;
  }
  tr = setDocNodeAttrs(tr, { worksheetMode: enabled });
  return tr;
}
