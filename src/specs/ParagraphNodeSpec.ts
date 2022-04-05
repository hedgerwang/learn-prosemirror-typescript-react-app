// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

const CHECK_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <text x="5" y="16" fill="white">✓</text>
  </svg>`;

const CHECK_BOX_BG_STYLE = `background-image: url("data:image/svg+xml,${window.encodeURIComponent(
  CHECK_MARK_SVG
)}");`;

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

    const dom: any = ["div", divAttrs];

    if (appearance === "checkbox") {
      dom.push([
        "label",
        { class: "contents relative" },
        [
          "input",
          {
            class:
              "appearance-none bg-center bg-no-repeat border border-1 cursor-pointer h-6 inline-block mx-2 rounded select-none shadow-md w-6 hover:bg-gray-400 " +
              (checked ? "bg-blue-500" : "bg-white"),
            type: "checkbox",
            style: checked ? CHECK_BOX_BG_STYLE : "",
          },
        ],
      ]);
    }
    dom.push(["p", { class: "flex-1" }, 0]);
    return dom;
  },
};

export default ParagraphNodeSpec;
