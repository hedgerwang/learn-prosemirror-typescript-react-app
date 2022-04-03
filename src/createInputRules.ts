// @flow
import { InputRule, inputRules } from "prosemirror-inputrules";
import selectActionInputRule from "./selectActionInputRule";
import { Plugin } from "prosemirror-state";

export default function createInputRules(): Plugin {
  const rules: InputRule[] = [selectActionInputRule()];
  return inputRules({ rules });
}
