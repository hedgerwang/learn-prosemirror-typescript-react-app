// @flow

import { EditorState } from "prosemirror-state";
import findParentNodeAtSelection from "../transforms/findParentNodeAtSelection";

export default function isAtHeadingNode(
  state: EditorState,
  level: number
): boolean {
  const headingType = state.schema.nodes.heading;
  if (!headingType) {
    return false;
  }
  const nodePos = findParentNodeAtSelection(headingType, state.selection);
  if (!nodePos) {
    return false;
  }
  return level === nodePos.node.attrs.level;
}
