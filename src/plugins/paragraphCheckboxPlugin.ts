// @flow

import { Plugin } from "prosemirror-state";
import EditorViewPlugin from "./EditorViewPlugin";
import { EditorView } from "prosemirror-view";
import { findParentNode } from "prosemirror-utils";
import { NodeType } from "prosemirror-model";

function handleDOMEvent(view: EditorView, evt: Event): boolean {
  const { target } = evt;
  let { tr } = view.state;
  const action = tr.getMeta("action");
  console.log(action);
  if (!(target instanceof HTMLInputElement)) {
    return false;
  }
  if (target.name !== "paragraph-checkbox") {
    return false;
  }

  const { schema, selection } = view.state;
  const paragraphType: NodeType = schema.nodes.paragraph;
  const paragraph = findParentNode((node) => node.type === paragraphType)(
    selection
  );
  if (!paragraph) {
    return false;
  }
  const pos = view.posAtDOM(target, 0) - 1;
  const node = pos > 1 ? tr.doc.nodeAt(pos) : null;
  if (node?.type !== paragraphType) {
    return false;
  }

  const attrs = { ...node.attrs, checked: !node.attrs.checked };
  tr.setMeta("action", "toggle-paragraph-checkbox");

  tr = tr.setNodeMarkup(pos, paragraphType, attrs, node.marks);
  view.dispatch(tr);
  evt.preventDefault();
  return true;
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
