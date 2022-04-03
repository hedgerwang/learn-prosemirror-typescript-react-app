// @flow
import { Plugin } from "prosemirror-state";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import createEditorKeyMap from "./createEditorKeyMap";
import textCaretPlugin from "./textCaretPlugin";
import createInputRules from "./createInputRules";
import selectActionMenuPlugin from "./selectActionMenuPlugin";

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
    //
    createInputRules(),
    //
    selectActionMenuPlugin(),
  ];
}
