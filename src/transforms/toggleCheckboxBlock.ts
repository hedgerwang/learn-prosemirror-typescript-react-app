// @flow
import { Transaction } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";
import { Schema } from "prosemirror-model";

export default function toggleCheckboxBlock(
  schema: Schema,
  tr: Transaction
): Transaction {
  const paragraphType = schema.nodes.paragraph;
  const headingType = schema.nodes.heading;
  if (!paragraphType) {
    return tr;
  }

  const headingFinder = findParentNode((nn) => nn.type === headingType);
  const heading = headingFinder(tr.selection);
  if (heading) {
    const { pos, node } = heading;
    const attrs = {
      ...node.attrs,
      appearance: "checkbox",
    };
    tr = tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
    return tr;
  }

  const paragraphFinder = findParentNode((nn) => nn.type === paragraphType);
  const paragraph = paragraphFinder(tr.selection);
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
