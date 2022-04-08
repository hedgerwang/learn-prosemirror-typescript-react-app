import { Node } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import type { NodeView } from "prosemirror-view";

function createDOM(value: string): HTMLInputElement {
  const dom = document.createElement("input");
  dom.value = value;
  dom.className = "border border-1 px-4 py2 shadow";
  return dom;
}

function getValue(node: Node): string {
  return ("value" in node.attrs && node.attrs.value) || "";
}

export default class InputLineNodeView {
  _getPos: () => number;
  _view: EditorView;

  dom: HTMLInputElement;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    const value = getValue(node);
    const dom = createDOM(value);
    this._getPos = getPos;
    this._view = view;
    this.dom = dom;
    dom.addEventListener("change", this._onInput, false);
  }

  destroy() {
    console.log("destroy");
    const nodeView: NodeView = this;
    const { dom } = nodeView;
    dom && dom.removeEventListener("change", this._onInput, false);
  }

  stopEvent() {
    console.log("stopEvent");
    return true;
  }

  ignoreMutation() {
    console.log("ignoreMutation");
    return true;
  }

  selectNode() {
    this.dom.focus();
  }

  deselectNode() {
    this.dom.blur();
  }

  update(node: Node) {
    if (node.type.name !== "inputLine") {
      return false;
    }
    this.dom.value = getValue(node);
    return true;
  }

  _onInput = (e: Event) => {
    console.log(e);
    e.preventDefault();
    const view = this._view;
    const getPos = this._getPos;
    const { dom } = this;
    view.dispatch(
      view.state.tr.setNodeMarkup(getPos(), undefined, {
        value: dom.value,
      })
    );
  };
}
