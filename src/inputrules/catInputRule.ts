// @flow

import { NodeType } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";

function handleInputRule(
  state: EditorState,
  match: Array<any>,
  start: number,
  end: number
): Transaction | null {
  const token = match[0];
  if (!token) {
    return null;
  }

  const nodeType: NodeType | null = state.schema.nodes.image;
  if (!nodeType) {
    return null;
  }

  const { selection } = state;
  if (!(selection instanceof TextSelection)) {
    return null;
  }
  const { from, to } = selection;
  if (from !== to) {
    return null;
  }

  const size = match[1] || "";
  const macthedSize = size.match(/(\d+)x(\d+)/) ||
    size.match(/(\d+)/) || ["", "50", "50"];

  let ww = 0;
  let hh = 0;
  if (macthedSize[1] && macthedSize[2]) {
    ww = parseInt(macthedSize[1], 10);
    hh = parseInt(macthedSize[2], 10);
  } else if (macthedSize[1]) {
    ww = parseInt(macthedSize[1], 10);
    hh = ww;
  } else {
    ww = 50;
    hh = 50;
  }
  if (!ww || !hh) {
    return null;
  }

  const src = `https://placekitten.com/${ww}/${hh}`;
  const node = nodeType.create({ src, width: ww, height: hh });

  let { tr } = state;
  tr = tr.setSelection(TextSelection.create(tr.doc, to - token.length, to));
  tr = tr.deleteSelection();
  tr = tr.insert(tr.selection.to, node);
  return tr;
}

export default function catInputRule(): InputRule {
  return new InputRule(/:cat(\d+|\d+x\d+)?\s/, handleInputRule);
}
