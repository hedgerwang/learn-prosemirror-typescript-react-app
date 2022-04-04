// @flow
import { Plugin } from "prosemirror-state";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import createEditorKeyMap from "./createEditorKeyMap";
import textCaretPlugin from "./plugins/textCaretPlugin";
import createInputRules from "./createInputRules";
import editorActionMenuPlugin from "./plugins/editorActionMenuPlugin";
import commentsBankMenuPlugin from "./plugins/commentsBankMenuPlugin";
import paragraphCheckboxPlugin from "./plugins/paragraphCheckboxPlugin";

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
    //
    paragraphCheckboxPlugin(),
  ];
}
