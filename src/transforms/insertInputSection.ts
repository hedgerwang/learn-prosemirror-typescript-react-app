// @flow

import { Schema, Fragment } from "prosemirror-model";
import { Transaction, TextSelection } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";

function insertInputSectionAt(
  schema: Schema,
  tr: Transaction,
  pos: number,
  dryrun: boolean
): Transaction {
  if (dryrun) {
    return tr.setMeta("ok", true);
  }
  const inputSectionType = schema.nodes.inputSection;
  const paragraphType = schema.nodes.paragraph;

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
  tr = tr.insert(pos, frag);
  const sel = TextSelection.create(tr.doc, pos + 3);
  tr = tr.setSelection(sel);
  return tr;
}

export default function insertInputSection(
  schema: Schema,
  tr: Transaction,
  dryrun = false
) {
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

  const atInputSection = findParentNode((node) => {
    return node.type === inputSectionType;
  })(selection);

  if (atInputSection) {
    const { pos, node } = atInputSection;
    return insertInputSectionAt(schema, tr, pos + node.nodeSize, dryrun);
  }

  const headingType = schema.nodes.heading;
  const atHeading = findParentNode((node) => {
    return node.type === headingType;
  })(selection);

  if (atHeading) {
    const { pos, node } = atHeading;
    return insertInputSectionAt(schema, tr, pos + node.nodeSize, dryrun);
  }

  const atParagraph = findParentNode((node) => {
    return node.type === paragraphType;
  })(selection);

  if (!atParagraph) {
    return tr;
  }

  return insertInputSectionAt(schema, tr, to, dryrun);
}
