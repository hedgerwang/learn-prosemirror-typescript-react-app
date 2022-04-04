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
      getAttrs: (source) => {
        console.log("parseDOM P ", source);
        return {};
      },
    },
  ],
  toDOM: (node: Node) => {
    console.log(">>>>toDOM P", node);
    const attrs = {
      class: "my-2",
    };
    return ["p", attrs, 0];
  },
};

export default ParagraphNodeSpec;
