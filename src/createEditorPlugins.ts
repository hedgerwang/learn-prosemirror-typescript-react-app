// @flow
import { Plugin } from "prosemirror-state";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import createEditorKeyMap from "./createEditorKeyMap";
import textCaretPlugin from "./textCaretPlugin";
import createInputRules from "./createInputRules";
import editorActionMenuPlugin from "./editorActionMenuPlugin";
import commentsBankMenuPlugin from "./commentsBankMenuPlugin";

export default function createEditorPlugins(): Array<Plugin> {
  return [
    //
    commentsBankMenuPlugin(),
    //
    history(),
    //
    keymap(baseKeymap),
    //
    keymap(createEditorKeyMap()),
    //
    textCaretPlugin(),
    //
    createInputRules(),
    //
    editorActionMenuPlugin(),
  ];
}
