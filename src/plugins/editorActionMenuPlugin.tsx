// @flow

import {
  Plugin,
  Transaction,
  TextSelection,
  EditorState,
} from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import { createRoot } from "react-dom/client";
import React from "react";
import EditorActionMenu from "../components/EditorActionMenu";
import EditorViewPlugin from "./EditorViewPlugin";
import {
  SHOW_ACTION_MENU,
  HIDE_ACTION_MENU,
} from "../components/EditorActionMenu";

const DECO_TYPE = "select-action-menu";

function createElement(editorView: EditorView): Element {
  const el = document.createElement("span");
  el.className = "h-0 inline-block relative text-bottom w-0";
  return el;
}

function findSpec(spec: any) {
  return spec.type === DECO_TYPE;
}

export default function editorActionMenuPlugin(): Plugin {
  const plugin = new EditorViewPlugin({
    view(view: EditorView) {
      plugin.editorView = view;
      return {
        update(v: EditorView, s: EditorState) {
          plugin.editorView = v;
        },
        destroy() {
          plugin.editorView = null;
        },
      };
    },
    state: {
      init: () => {
        return DecorationSet.empty;
      },

      apply(tr: Transaction, set: DecorationSet): DecorationSet {
        const { editorView, reactRoot } = plugin;
        const { selection } = tr;
        const action = tr.getMeta("action") || {};
        const decos = set.find(undefined, undefined, findSpec);

        // Remove menu.
        if (action[HIDE_ACTION_MENU] || tr.docChanged) {
          set = set.remove(decos);
          reactRoot && reactRoot.unmount();
          plugin.reactRoot = null;
        }

        if (action[SHOW_ACTION_MENU]) {
          if (selection instanceof TextSelection && editorView) {
            const { to } = selection;
            // Apply new decorations.

            const el = createElement(editorView);

            const newDeco = Decoration.widget(to, el, {
              type: DECO_TYPE,
              selection,
            });
            set = set.add(tr.doc, [newDeco]);

            const root = createRoot(el);
            root.render(
              <React.StrictMode>
                <EditorActionMenu editorView={editorView} />
              </React.StrictMode>
            );
            plugin.reactRoot = root;
          }
        }

        return set;
      },
    },
    props: {
      decorations(state: EditorState): DecorationSet | null {
        return plugin.getState(state);
      },
    },
  });
  return plugin;
}
