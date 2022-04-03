// @flow

import { Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import type { Root } from "react-dom/client";

// Custom plugin that allows developer to store editor view at plugin level.

export default class EditorViewPlugin extends Plugin {
  _editorView: EditorView | null = null;

  blurTimer: number | null = null;
  reactRoot: Root | null = null;

  get editorView(): EditorView | null {
    return this._editorView;
  }

  set editorView(nextView: EditorView | null) {
    const currentView = this._editorView;
    if (nextView && !(nextView instanceof EditorView)) {
      throw new Error("Expect EditorView");
    }
    if (nextView === currentView) {
      return;
    }
    if (nextView && currentView && nextView !== currentView) {
      if (!currentView.isDestroyed) {
        throw new Error("Do not reuse plugin with for different views.");
      }
    }
    this._editorView = nextView;
  }
}
