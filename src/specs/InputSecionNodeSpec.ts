// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const InputSecionNodeSpec: NodeSpec = {
  attrs: {},
  content: "(paragraph|heading)+",
  group: "block",
  parseDOM: [
    {
      tag: "section[data-input-section]",
      getAttrs: () => {
        return {};
      },
    },
  ],
  toDOM: (node: Node) => {
    const attrs = {
      class:
        "bg-white border border-1 border-gray-800 my-4 p-4 rounded shadow ring-2 ring-gray-500",
      "data-input-section": "true",
    };
    return ["section", attrs, 0];
  },
};

export default InputSecionNodeSpec;
