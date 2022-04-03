// @flow

import { Schema } from "prosemirror-model";
import DocNodeSpec from "./DocNodeSpec";
import ParagraphNodeSpec from "./ParagraphNodeSpec";
import TextNodeSpec from "./TextNodeSpec";
import TextHighlightColorMarkSpec from "./TextHighlightColorMarkSpec";

export default function createEditorSchema(): Schema {
  return new Schema({
    nodes: {
      doc: DocNodeSpec,
      paragraph: ParagraphNodeSpec,
      text: TextNodeSpec,
    },
    marks: {
      textHighlightColor: TextHighlightColorMarkSpec,
    },
  });
}
