// @flow
import { InputRule, inputRules } from "prosemirror-inputrules";
import editorActionInputRule from "./inputrules/editorActionInputRule";
import { Plugin } from "prosemirror-state";

export default function createInputRules(): Plugin {
  const rules: InputRule[] = [editorActionInputRule()];
  return inputRules({ rules });
}
