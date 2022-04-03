// @flow

import { EditorState, Transaction } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";

export const INPUT_RULE_ACTION_NAME = "selection-action-input";

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
  let tr = state.tr.setMeta("action", INPUT_RULE_ACTION_NAME);
  tr.insertText(token, end);
  return tr;
}

export default function selectActionInputRule(): InputRule {
  return new InputRule(/\/+$/, handleActionInputRule);
}
