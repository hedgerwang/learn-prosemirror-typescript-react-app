// @flow

import { Schema, Fragment } from "prosemirror-model";
import { Transaction, TextSelection } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";

export default function insertInputSection(schema: Schema, tr: Transaction) {
  if (tr.doc.attrs.inputSectionMode) {
    return tr;
  }

  const inputSectionType = schema.nodes.inputSection;
  if (!inputSectionType) {
    return tr;
  }
  const paragraphType = schema.nodes.paragraph;
  if (!paragraphType) {
    return tr;
  }
  const { selection } = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }
  const { from, to } = selection;

  if (from !== to) {
    return tr;
  }

  const atParagraph = findParentNode((node) => {
    return node.type === paragraphType;
  })(selection);

  if (!atParagraph) {
    return tr;
  }

  const atInputSection = findParentNode((node) => {
    return node.type === inputSectionType;
  })(selection);

  if (atInputSection) {
    return tr;
  }

  const frag = Fragment.from([
    inputSectionType.create(
      {},
      Fragment.from([
        paragraphType.create({}, schema.text(" ")),
        paragraphType.create({}, schema.text(" ")),
        paragraphType.create({}, schema.text(" ")),
      ])
    ),
    paragraphType.create({}, schema.text(" ")),
  ]);
  tr = tr.insert(to, frag);
  const sel = TextSelection.create(tr.doc, tr.selection.to + 2);
  tr = tr.setSelection(sel);
  return tr;
}
