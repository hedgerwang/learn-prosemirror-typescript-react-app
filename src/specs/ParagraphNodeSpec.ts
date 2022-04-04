// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const ParagraphNodeSpec: NodeSpec = {
  attrs: {
    appearance: {
      default: null,
    },
    checked: {
      default: false,
    },
  },
  content: "inline*",
  group: "block",
  parseDOM: [
    {
      tag: "p",
      getAttrs: (source) => {
        return {};
      },
    },
  ],
  toDOM: (node: Node) => {
    const { appearance, checked } = node.attrs;
    const divAttrs = {
      class: "my-2 flex",
    };
    const pAttrs = {
      class: "flex-1",
    };

    if (appearance === "checkbox") {
      const cAttrs: { [k: string]: any } = {
        type: "checkbox",
        name: "paragraph-checkbox",
        class: "mt-1 pt-1 mx-2 w-4 h-4",
      };
      if (checked) {
        cAttrs.checked = "";
      }
      return ["div", divAttrs, ["input", cAttrs], ["p", pAttrs, 0]];
    } else {
      return ["div", divAttrs, ["p", pAttrs, 0]];
    }
  },
};

export default ParagraphNodeSpec;
