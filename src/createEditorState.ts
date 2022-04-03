// @flow
import { EditorState } from "prosemirror-state";
import { Plugin } from "prosemirror-state";
import { Schema } from "prosemirror-model";

// The JSON of an empty doc.
const EMPTY_DOC_JSON = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export default function createEditorState(
  schema: Schema,
  plugins: Array<Plugin>,
  json?: Object | null | typeof undefined
): EditorState {
  return EditorState.create({
    doc: schema.nodeFromJSON(json || EMPTY_DOC_JSON),
    schema,
    plugins,
  });
}
