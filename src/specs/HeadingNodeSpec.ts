// @flow

import { Node } from "prosemirror-model";
import type { NodeSpec } from "prosemirror-model";

function getAttrs(source: any) {
  console.log(">>>>", source);
  if (source instanceof HTMLElement) {
    const matched = source.nodeName.match(/\d+/);
    if (matched) {
      return { level: parseInt(matched[0], 10) };
    }
  }
  return null;
}

const HEADING_STYLES: { [key: string]: string } = {
  h1: "text-5xl mb-4 text-gray-900",
  h2: "text-4xl mb-3 text-gray-800",
  h3: "text-2xl mb-2 text-gray-700",
  h4: "text-2xl mb-1 text-gray-600",
  default: "my-1",
};

const HeadingNodeSpec: NodeSpec = {
  attrs: {
    level: {
      default: 4,
    },
  },
  content: "inline*",
  group: "block",
  parseDOM: [
    { tag: "h1", getAttrs },
    { tag: "h2", getAttrs },
    { tag: "h3", getAttrs },
    { tag: "h4", getAttrs },
  ],
  toDOM: (node: Node) => {
    console.log(">>>>toDOM H", node);
    const { level } = node.attrs;
    let tag = `h${level}`;
    let styles = HEADING_STYLES[tag];
    if (!styles) {
      tag = "h3";
      styles = HEADING_STYLES.default;
    }
    const attrs = {
      class: "my-2 font-bold " + styles,
    };
    return [tag, attrs, 0];
  },
};

export default HeadingNodeSpec;
