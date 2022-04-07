// @flow

import { Schema, Fragment } from "prosemirror-model";
import { Transaction } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";

export default function insertInputLine(
  schema: Schema,
  tr: Transaction,
  dryrun = false
) {
  const { inputSection, paragraph, inputLine } = schema.nodes;
  if (!inputSection || !inputLine || !paragraph) {
    return tr;
  }

  const { selection } = tr;

  const atInputSection = findParentNode((node) => {
    return node.type === inputSection;
  })(selection);

  if (atInputSection) {
    return tr;
  }

  const atBlock = findParentNode((node) => {
    const { type } = node;
    return type === paragraph;
  })(selection);

  if (!atBlock) {
    return tr;
  }

  const line = inputLine.create({});
  tr = tr.insert(
    selection.to,
    Fragment.from([schema.text(" "), line, schema.text(" ")])
  );

  return tr;
}
