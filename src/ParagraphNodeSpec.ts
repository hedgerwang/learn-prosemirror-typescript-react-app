// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const ParagraphNodeSpec: NodeSpec = {
  attrs: {},
  content: "inline*",
  group: "block",
  parseDOM: [
    {
      tag: "p",
      getAttrs: () => {
        return {};
      },
    },
  ],
  toDOM: (node: Node) => {
    const attrs = {
      class: "border border-1 border-gray-500 m-2",
    };
    return ["p", attrs, 0];
  },
};

export default ParagraphNodeSpec;
