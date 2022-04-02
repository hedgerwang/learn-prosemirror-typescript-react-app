// @flow

import {
  Plugin,
  Transaction,
  TextSelection,
  EditorState,
} from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const DECO_TYPE = "text-caret";

const CARET_HTML = `
  <span
    class="absolute bg-gray-600 top-0 bottom-0"
    style="width: 2px; left: -1px; height: 1.2em">
  </span>
`;

let elementTemplate: Element | null = null;

function createElement(): Element {
  if (!elementTemplate) {
    elementTemplate = document.createElement("span");
    elementTemplate.className =
      "inline-block align-text-top relative w-0 h-0 select-none pointer-events-none";
    elementTemplate.innerHTML = CARET_HTML;
  }
  const el = elementTemplate.cloneNode(true);
  if (el instanceof Element) {
    return el;
  }
  throw new Error("not an element");
}

function findSpec(spec: any) {
  return spec.type === DECO_TYPE;
}

export default function textCaretPlugin(): Plugin {
  return new Plugin({
    state: {
      init: () => {
        return DecorationSet.empty;
      },

      apply(tr: Transaction, set: DecorationSet): DecorationSet {
        const action = tr.getMeta("action");

        if (action === "focus") {
          const decos = set.find(undefined, undefined, findSpec);
          // Remove existing decorations.
          return set.remove(decos);
        } else if (action === "blur") {
          const { selection } = tr;
          if (selection instanceof TextSelection) {
            const { to } = selection;
            // Apply new decorations.
            const newDeco = Decoration.widget(to, createElement(), {
              type: DECO_TYPE,
            });
            return set.add(tr.doc, [newDeco]);
          } else {
            return set;
          }
        }

        return set;
      },
    },
    props: {
      decorations(state: EditorState): DecorationSet | null {
        const plugin: Plugin = this;
        if (plugin instanceof Plugin) {
          return plugin.getState(state);
        } else {
          return null;
        }
      },
    },
  });
}
