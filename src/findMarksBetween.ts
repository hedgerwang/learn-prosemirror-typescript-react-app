// @flow

import { Mark, Node } from "prosemirror-model";
import type { MarkType } from "prosemirror-model";

export default function findMarksBetween(
  doc: Node,
  markType: MarkType,
  from: number,
  to: number
): Mark[] {
  const marks: Mark[] = [];
  doc.nodesBetween(from, to, (node) => {
    if (node.marks && node.marks.length) {
      const mark = node.marks.find((m) => m.type === markType);
      if (mark) {
        marks.push(mark);
      }
    }
    return true;
  });
  return marks;
}
