// @flow

import { Schema, NodeType } from "prosemirror-model";
import { Transaction, TextSelection } from "prosemirror-state";
import { findParentNode, NodeWithPos } from "prosemirror-utils";

function selectNextSiblingNode(tr: Transaction): Transaction {
  const pos = tr.selection.to;
  const position = tr.doc.resolve(pos);
  const startPos = position.start(position.depth);
  if (startPos === 0) {
    // This is the root node.
    debugger;
    return tr;
  }
  const parentPos = startPos - 1;
  const parentNode = tr.doc.nodeAt(parentPos);
  if (!parentNode) {
    debugger;
    return tr;
  }
  const index = position.index(position.depth);
  const lastIndex = parentNode.childCount - 1;
  if (index >= lastIndex) {
    // There's no following sibling node.
    debugger;
    return tr;
  }
  let nextIndex = index + 1;
  let nextPos = position.posAtIndex(nextIndex, position.depth);
  tr = tr.setSelection(TextSelection.create(tr.doc, nextPos));
  return tr;
}

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

  tr = tr.setSelection(TextSelection.create(tr.doc, sectionPos + 3));

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
    const { pos, node } = atInputSection;
    tr = tr.setSelection(TextSelection.create(tr.doc, pos + node.nodeSize + 1));
  }

  const atBlock = findParentNode((node) => {
    const { type } = node;
    const { heading, paragraph } = schema.nodes;
    return type === heading || type === paragraph;
  })(selection);

  if (atBlock) {
    return insertInputSectionAfter(schema, tr, atBlock, dryrun);
  }

  return tr;
}
