// @flow
import { inputRules } from "prosemirror-inputrules";
import editorActionInputRule from "./inputrules/editorActionInputRule";
import { Plugin } from "prosemirror-state";
import catInputRule from "./inputrules/catInputRule";

export default function createInputRules(): Plugin {
  return inputRules({
    rules: [
      //
      editorActionInputRule(),
      //
      catInputRule(),
    ],
  });
}
