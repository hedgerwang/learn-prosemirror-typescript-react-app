//
import { Selection } from "prosemirror-state";
import { findParentNode, ContentNodeWithPos } from "prosemirror-utils";
import { NodeType } from "prosemirror-model";

type Finder = (selection: Selection) => ContentNodeWithPos | undefined;

const cachedFinders = new Map<NodeType, Finder>();

export default function findParentNodeAtSelection(
  nodeType: NodeType,
  selection: Selection
): ContentNodeWithPos | null {
  let finder = cachedFinders.get(nodeType);
  if (!finder) {
    finder = findParentNode((node) => node.type === nodeType);
    cachedFinders.set(nodeType, finder);
  }
  return finder(selection) || null;
}
