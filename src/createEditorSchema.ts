// @flow

import { Schema } from "prosemirror-model";
import DocNodeSpec from "./specs/DocNodeSpec";
import ParagraphNodeSpec from "./specs/ParagraphNodeSpec";
import TextNodeSpec from "./specs/TextNodeSpec";
import TextHighlightColorMarkSpec from "./specs/TextHighlightColorMarkSpec";
import InputSecionNodeSpec from "./specs/InputSecionNodeSpec";
import ImageNodeSpec from "./specs/ImageNodeSpec";

export default function createEditorSchema(): Schema {
  return new Schema({
    nodes: {
      doc: DocNodeSpec,
      paragraph: ParagraphNodeSpec,
      inputSection: InputSecionNodeSpec,
      text: TextNodeSpec,
      image: ImageNodeSpec,
    },
    marks: {
      textHighlightColor: TextHighlightColorMarkSpec,
    },
  });
}
