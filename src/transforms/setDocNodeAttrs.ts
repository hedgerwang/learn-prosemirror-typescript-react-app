// @flow

import { Transaction } from "prosemirror-state";
import SetDocAttrStep from "./SetDocAttrStep";

export default function setDocNodeAttrs(
  tr: Transaction,
  attrs: { [key: string]: any }
): Transaction {
  const newAttrs = {
    ...tr.doc.attrs,
    ...attrs,
  };

  Object.keys(newAttrs).forEach((key) => {
    tr = tr.step(new SetDocAttrStep(key, newAttrs[key]));
  });
  return tr;
}
