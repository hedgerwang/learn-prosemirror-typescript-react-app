// @flow
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";
import { EditorView } from "prosemirror-view";

// By default, pressing ENTER key might split the input section by other
// commands. This command will prevent that happen.
export default function insertParagraphAtInputSection(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  const { selection, schema } = state;

  const paragraphType = schema.nodes.paragraph;
  if (!paragraphType) {
    return false;
  }

  const inputSectionType = schema.nodes.inputSection;
  if (!inputSectionType) {
    return false;
  }

  if (!(selection instanceof TextSelection)) {
    return false;
  }

  const { from, to } = selection;
  if (from !== to) {
    return false;
  }

  const atParagraph = findParentNode((node) => {
    return node.type === paragraphType;
  })(selection);

  if (!atParagraph) {
    return false;
  }

  const atInputSection = findParentNode((node) => {
    return node.type === inputSectionType;
  })(selection);

  if (!atInputSection) {
    return false;
  }

  let { tr } = state;

  const prevNode = tr.doc.nodeAt(from - 1);
  if (prevNode?.type === paragraphType) {
    // At the beginning of an empty paragraph.
    if (prevNode?.childCount === 0) {
      const node = paragraphType.create({}, schema.text(" "));
      tr = tr.insert(from - 1, node);
      const sel = TextSelection.create(tr.doc, to + 3);
      tr = tr.setSelection(sel);
    }
  } else {
    const node = paragraphType.create({}, schema.text(" "));
    tr = tr.insert(to, node);
    const sel = TextSelection.create(tr.doc, to + node.nodeSize - 1);
    tr = tr.setSelection(sel);
  }

  if (tr.docChanged) {
    dispatch && dispatch(tr);
    return true;
  }
  return false;
}
