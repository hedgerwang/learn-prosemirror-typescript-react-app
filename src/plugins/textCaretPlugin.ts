// @flow
import {
  Plugin,
  Transaction,
  TextSelection,
  EditorState,
} from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import EditorViewPlugin from "./EditorViewPlugin";

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
  const plugin = new EditorViewPlugin({
    state: {
      init: () => {
        return DecorationSet.empty;
      },

      apply(tr: Transaction, set: DecorationSet): DecorationSet {
        const { editorView } = plugin;
        const focused = editorView ? editorView.hasFocus() : false;
        const decos = set.find(undefined, undefined, findSpec);

        if (!focused && decos.length === 1) {
          // Text caret is visible.
          return set;
        }

        if (focused) {
          // Editor has focus.
          // Clear text caret.
          set = set.remove(decos);
        } else {
          // Editor lost focus.
          const { selection } = tr;
          if (selection instanceof TextSelection) {
            // Show text caret.
            const { to } = selection;
            const newDeco = Decoration.widget(to, createElement(), {
              type: DECO_TYPE,
            });
            set = set.add(tr.doc, [newDeco]);
          }
        }

        return set;
      },
    },
    props: {
      decorations(state: EditorState): DecorationSet | null {
        return plugin.getState(state);
      },
      handleDOMEvents: {
        focus(view: EditorView) {
          console.log("focus");
          const { blurTimer } = plugin;
          plugin.editorView = view;
          blurTimer && window.clearTimeout(blurTimer);
          return false;
        },
        blur(view: EditorView) {
          console.log("blur");
          const { blurTimer } = plugin;
          blurTimer && window.clearTimeout(blurTimer);
          plugin.editorView = view;
          plugin.blurTimer = window.setTimeout(() => {
            const tr = view.state.tr.setMeta("action", "show-text-caret");
            view.dispatch(tr);
          }, 100);
          return false;
        },
      },
    },
  });
  return plugin;
}
