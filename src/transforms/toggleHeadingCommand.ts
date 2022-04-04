// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { Command } from "prosemirror-commands";
import { findParentNode } from "prosemirror-utils";

export default function toggleHeadingCommand(level: number): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void) => {
    const { schema, selection } = state;
    const headingType = schema.nodes.heading;
    const paragraphType = schema.nodes.paragraph;
    if (!headingType && !paragraphType) {
      return false;
    }

    let { tr } = state;

    const findHeading = findParentNode((nn) => nn.type === headingType);
    const heading = findHeading(selection);
    if (heading) {
      const { node, pos } = heading;
      if (node.attrs.level === level) {
        // heading =>  paragraph
        const nodeAttrs = { ...node.attrs, level: undefined };
        tr = tr.setNodeMarkup(pos, paragraphType, nodeAttrs, node.marks);
        dispatch && dispatch(tr);
        return tr.docChanged;
      } else {
        // heading 1 =>  Heading 2
        const { node, pos } = heading;
        const nodeAttrs = { ...node.attrs, level };
        tr = state.tr.setNodeMarkup(pos, headingType, nodeAttrs, node.marks);
        dispatch && dispatch(tr);
        return tr.docChanged;
      }
    }

    const findParagraph = findParentNode((nn) => nn.type === paragraphType);
    const paragraph = findParagraph(selection);
    if (paragraph) {
      // paragraph => heading
      const { node, pos } = paragraph;
      const nodeAttrs = { ...node.attrs, level };
      tr = state.tr.setNodeMarkup(pos, headingType, nodeAttrs, node.marks);
      dispatch && dispatch(tr);
      return tr.docChanged;
    }

    return false;
  };
}

export const TOGGLE_H1_COMMAND = toggleHeadingCommand(1);
export const TOGGLE_H2_COMMAND = toggleHeadingCommand(2);
export const TOGGLE_H3_COMMAND = toggleHeadingCommand(3);
export const TOGGLE_H4_COMMAND = toggleHeadingCommand(4);
