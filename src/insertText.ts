// @flow

import { Transaction } from "prosemirror-state";

export default function insertText(tr: Transaction, text: string): Transaction {
  tr = tr.insertText(text);
  return tr;
}
