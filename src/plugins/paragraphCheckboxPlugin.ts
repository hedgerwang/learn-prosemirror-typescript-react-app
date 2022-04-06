// @flow

import { Plugin, TextSelection } from "prosemirror-state";
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
    console.log("space");
    if (key !== " " && key !== "Enter") {
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

  const pos = Math.max(view.posAtDOM(target, 0) - 1, 0);
  const node = tr.doc.nodeAt(pos);

  if (node?.type !== paragraphType) {
    return false;
  }

  const attrs = { ...node.attrs, checked: !node.attrs.checked };
  tr = tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
  tr = tr.setSelection(TextSelection.create(tr.doc, pos + 1));
  view.dispatch(tr);
  evt.preventDefault();
  return true;
}

export default function paragraphCheckboxPlugin(): Plugin {
  const plugin = new EditorViewPlugin({
    props: {
      handleDOMEvents: {
        mousedown: handleDOMEvent,
        keydown: handleDOMEvent,
      },
    },
  });
  return plugin;
}
