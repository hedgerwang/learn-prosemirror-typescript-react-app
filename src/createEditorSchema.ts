// @flow

import { Schema } from "prosemirror-model";
import DocNodeSpec from "./specs/DocNodeSpec";
import ParagraphNodeSpec from "./specs/ParagraphNodeSpec";
import TextNodeSpec from "./specs/TextNodeSpec";
import TextHighlightColorMarkSpec from "./specs/TextHighlightColorMarkSpec";
import InputSecionNodeSpec from "./specs/InputSecionNodeSpec";
import ImageNodeSpec from "./specs/ImageNodeSpec";
import HeadingNodeSpec from "./specs/HeadingNodeSpec";

export default function createEditorSchema(): Schema {
  return new Schema({
    nodes: {
      doc: DocNodeSpec,
      text: TextNodeSpec,
      heading: HeadingNodeSpec,
      paragraph: ParagraphNodeSpec,
      inputSection: InputSecionNodeSpec,
      image: ImageNodeSpec,
    },
    marks: {
      textHighlightColor: TextHighlightColorMarkSpec,
    },
  });
}
