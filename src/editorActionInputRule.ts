// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import { SHOW_ACTION_MENU } from "./EditorActionMenu";

function handleActionInputRule(
  state: EditorState,
  match: Array<any>,
  start: number,
  end: number
): Transaction | null {
  const token = match[0];
  if (token !== "/") {
    return null;
  }
  let tr = state.tr.setMeta("action", { [SHOW_ACTION_MENU]: true });
  tr.insertText(token, end);
  return tr;
}

export default function editorActionInputRule(): InputRule {
  return new InputRule(/\/+$/, handleActionInputRule);
}
