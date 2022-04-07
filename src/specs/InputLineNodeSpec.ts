// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const InputLineNodeSpec: NodeSpec = {
  inline: true,
  group: "inline",
  attrs: {
    value: { default: null },
  },
  parseDOM: [
    {
      tag: 'input[type="text"]',
      getAttrs: (obj) => {
        if (obj instanceof HTMLElement) {
          const dom = obj;
          return {
            value: dom.getAttribute("value") || "",
          };
        } else {
          return {};
        }
      },
    },
  ],

  toDOM(node: Node) {
    const attrs = {
      ...node.attrs,
      value: node.attrs.value || "",
      type: "text",
      class: "border border-1 inline-block mx-2 my-1 shadow",
    };
    return ["input", attrs, 0];
  },
};

export default InputLineNodeSpec;
