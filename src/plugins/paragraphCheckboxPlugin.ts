// @flow

import { Plugin } from "prosemirror-state";
import EditorViewPlugin from "./EditorViewPlugin";
import { EditorView } from "prosemirror-view";
import { findParentNode } from "prosemirror-utils";
import { NodeType } from "prosemirror-model";

function handleDOMEvent(view: EditorView, evt: Event): boolean {
  const { target } = evt;

  const { schema, selection } = view.state;

  if (!(target instanceof HTMLInputElement)) {
    return false;
  }

  if (target.type !== "checkbox") {
    return false;
  }

  if (evt instanceof KeyboardEvent) {
    const { key } = evt;
    if (key !== "Space" && key !== "Enter") {
      // Only space or enter key could toggle checkbox.
      return false;
    }
  }

  const paragraphType: NodeType = schema.nodes.paragraph;
  const paragraph = findParentNode((node) => node.type === paragraphType)(
    selection
  );
  if (!paragraph) {
    return false;
  }
  let { tr } = view.state;

  const pos = view.posAtDOM(target, 0) - 1;
  const node = pos > 1 ? tr.doc.nodeAt(pos) : null;
  if (node?.type !== paragraphType) {
    return false;
  }

  const attrs = { ...node.attrs, checked: !node.attrs.checked };
  tr = tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
  view.dispatch(tr);
  return true;
}

export default function paragraphCheckboxPlugin(): Plugin {
  const plugin = new EditorViewPlugin({
    props: {
      handleDOMEvents: {
        click: handleDOMEvent,
        keydown: handleDOMEvent,
      },
    },
  });
  return plugin;
}
