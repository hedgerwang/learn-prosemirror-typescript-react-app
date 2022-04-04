// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const ImageNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    height: { default: null },
    src: { default: null },
    width: { default: null },
  },

  group: "inline",
  draggable: true,
  parseDOM: [
    {
      tag: "img",
      getAttrs: (obj) => {
        if (obj instanceof HTMLElement) {
          const dom = obj;
          return {
            src: dom.getAttribute("src") || null,
            width: dom.getAttribute("width") || null,
            height: dom.getAttribute("height") || null,
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
      class: "border border-1 inline-block mx-2 my-1 resize shadow",
    };
    return ["span", { class: "inline-block relative" }, ["img", attrs]];
  },
};

export default ImageNodeSpec;
