// @flow

import { NodeType } from "prosemirror-model";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";

function checkEditorState(editorState: EditorState): boolean {
  const nodeType: NodeType = editorState.schema.nodes.inputSection;
  if (!nodeType) {
    return true;
  }

  const { selection, doc } = editorState;

  if (selection instanceof TextSelection) {
    const { from, to } = selection;
    const fromNodePos = findParentNode((node) => node.type === nodeType)(
      TextSelection.create(doc, from)
    );

    const toNodePos = findParentNode((node) => node.type === nodeType)(
      TextSelection.create(doc, to)
    );

    if (
      fromNodePos &&
      toNodePos &&
      fromNodePos?.node === toNodePos?.node &&
      fromNodePos?.pos === toNodePos?.pos
    ) {
      return true;
    }
  }

  return false;
}

export default function checkworksheetMode(
  editorState: EditorState,
  tr: Transaction
): EditorState {
  const nextEditorState = editorState.apply(tr);
  if (!tr.docChanged) {
    return nextEditorState;
  }

  const lastStep: any = tr.steps[tr.steps.length - 1];
  if (lastStep?.key === "worksheetMode") {
    // allow step to toggle  "worksheetMode".
    return nextEditorState;
  }

  if (!nextEditorState.doc.attrs.worksheetMode) {
    return nextEditorState;
  }

  return checkEditorState(editorState) && checkEditorState(nextEditorState)
    ? nextEditorState
    : editorState;
}
