// @flow

import { Plugin } from "prosemirror-state";
import EditorViewPlugin from "./EditorViewPlugin";
import { EditorView } from "prosemirror-view";
import { findParentNode } from "prosemirror-utils";

function handleDOMEvent(view: EditorView, evt: Event): boolean {
  const { target } = evt;
  if (!(target instanceof HTMLInputElement)) {
    return false;
  }
  if (target.name !== "paragraph-checkbox") {
    return false;
  }
  const { schema, selection } = view.state;
  const paragraphType = schema.nodes.paragraph;
  const paragraph = findParentNode((node) => node.type === paragraphType)(
    selection
  );
  if (!paragraph) {
    return false;
  }
  const { pos, node } = paragraph;
  const attrs = { ...node.attrs, checked: target.checked };
  const tr = view.state.tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
  view.dispatch(tr);
  return false;
}

export default function paragraphCheckboxPlugin(): Plugin {
  const plugin = new EditorViewPlugin({
    props: {
      handleDOMEvents: {
        change: handleDOMEvent,
        click: handleDOMEvent,
        keydown: handleDOMEvent,
      },
    },
  });
  return plugin;
}
