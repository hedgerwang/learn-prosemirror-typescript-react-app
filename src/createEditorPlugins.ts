// @flow
import { Plugin } from "prosemirror-state";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import createEditorKeyMap from "./createEditorKeyMap";
import textCaretPlugin from "./textCaretPlugin";

export default function createEditorPlugins(): Array<Plugin> {
  return [
    // record edits
    history(),
    // xxx
    keymap(baseKeymap),
    // ...
    keymap(createEditorKeyMap()),
    //
    textCaretPlugin(),
  ];
}
