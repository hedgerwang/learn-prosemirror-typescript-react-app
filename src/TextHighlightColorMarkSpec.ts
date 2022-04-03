import { Mark } from "prosemirror-model";
import type { MarkSpec } from "prosemirror-model";

const TextHighlightColorMarkSpec: MarkSpec = {
  attrs: {
    color: { default: null },
  },
  inline: true,
  group: "inline",
  parseDOM: [
    {
      style: "color",
      getAttrs: (color: string | Node) => {
        if (typeof color === "string") {
          return { color: color || null };
        } else if (color instanceof HTMLElement) {
          return { color: color.style.color || null };
        }
        return { color: null };
      },
    },
  ],
  toDOM(mark: Mark) {
    const { color } = mark.attrs;
    let style;
    if (color) {
      style = `background-color: ${color};`;
    }
    return ["span", { style }, 0];
  },
};

export default TextHighlightColorMarkSpec;
