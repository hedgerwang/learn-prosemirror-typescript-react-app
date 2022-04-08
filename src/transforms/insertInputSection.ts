// @flow

import { Schema } from "prosemirror-model";
import { Transaction, TextSelection } from "prosemirror-state";
import { findParentNode, NodeWithPos } from "prosemirror-utils";

function insertInputSectionAfter(
  schema: Schema,
  tr: Transaction,
  nodePos: NodeWithPos,
  dryrun: boolean
): Transaction {
  if (dryrun) {
    return tr.setMeta("ok", true);
  }
  const pos = tr.selection.to;
  const inputSectionType = schema.nodes.inputSection;
  const paragraphType = schema.nodes.paragraph;
  const paragraph = () => paragraphType.create({}, schema.text(" "));

  const section = inputSectionType.create({}, paragraph());
  tr = tr.insert(pos, section);

  let sectionPos = pos;
  tr.doc.nodesBetween(pos, pos + nodePos.node.nodeSize, (nn, pp) => {
    if (nn.type === inputSectionType) {
      sectionPos = pp;
    }
    return !sectionPos;
  });

  // tr = tr.setSelection(TextSelection.create(tr.doc, sectionPos + 3));

  if (!tr.doc.nodeAt(sectionPos + section.nodeSize)) {
    // Need an empty paragraph after the section.
    tr = tr.insert(sectionPos + section.nodeSize, paragraph());
  }
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
    return tr;
  }

  const atBlock = findParentNode((node) => {
    const { type } = node;
    const { heading, paragraph } = schema.nodes;
    return type === heading || type === paragraph;
  })(selection);

  if (!atBlock) {
    return tr;
  }

  const paragraph = () => paragraphType.create({}, schema.text(" "));
  const nodeAfter = tr.doc.nodeAt(to + 1);
  if (nodeAfter?.type !== paragraphType) {
    tr = tr.insert(to, paragraph());
  }

  const section = inputSectionType.create({}, paragraph());
  tr = tr.insert(to, section);

  return tr;
}
