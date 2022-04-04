// @flow

import { TextSelection, Transaction } from "prosemirror-state";
import setDocNodeAttrs from "./setDocNodeAttrs";
import { Schema, Node } from "prosemirror-model";
import insertInputSection from "./insertInputSection";

type NodePos = {
  node: Node;
  pos: number;
};

export default function setInputSectionMode(
  schema: Schema,
  tr: Transaction,
  enabled: boolean
): Transaction {
  if (enabled && !!tr.doc.attrs.inputSectionMode) {
    return tr;
  }
  if (!enabled && !tr.doc.attrs.inputSectionMode) {
    return tr;
  }

  const inputSectionType = schema.nodes.inputSection;
  if (!inputSectionType) {
    return tr;
  }

  if (enabled) {
    let nodePos: NodePos | null = null;
    tr.doc.descendants((node, pos) => {
      if (!nodePos && node.type === inputSectionType) {
        nodePos = { node, pos };
      }
      return nodePos === null;
    });
    if (nodePos) {
      const nn: NodePos = nodePos;
      tr = tr.setSelection(TextSelection.create(tr.doc, nn.pos));
    } else {
      tr = insertInputSection(schema, tr);
    }
  }

  tr = setDocNodeAttrs(tr, { inputSectionMode: enabled });
  return tr;
}
