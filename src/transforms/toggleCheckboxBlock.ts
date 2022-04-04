// @flow
import { Transaction } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";
import { Schema } from "prosemirror-model";

export default function toggleCheckboxBlock(
  schema: Schema,
  tr: Transaction
): Transaction {
  const paragraphType = schema.nodes.paragraph;
  if (!paragraphType) {
    return tr;
  }
  const finder = findParentNode((nn) => nn.type === paragraphType);
  const paragraph = finder(tr.selection);
  if (!paragraph) {
    return tr;
  }
  const { pos, node } = paragraph;
  const attrs = {
    ...node.attrs,
    appearance: node.attrs.appearance === "checkbox" ? null : "checkbox",
  };
  tr = tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
  return tr;
}
