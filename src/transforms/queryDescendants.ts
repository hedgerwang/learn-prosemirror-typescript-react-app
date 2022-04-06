// @flow
import { NodeWithPos } from "prosemirror-utils";
import { Node, NodeType } from "prosemirror-model";

type Predict = (node: Node, pos: number) => boolean;

export default function queryDescendants(
  node: Node,
  condition: Predict | NodeType
): NodeWithPos[] {
  const result: NodeWithPos[] = [];
  let check: Predict | null = null;
  if (condition instanceof NodeType) {
    const nodeType = condition;
    console.log(nodeType);
    check = (nn) => nn.type === nodeType;
  } else if (typeof condition === "function") {
    check = condition;
  } else {
    throw new Error(`invalid condition`);
  }
  const predict: Predict = check;
  node.descendants((nn, pp) => {
    if (predict(nn, pp)) {
      result.push({ node: nn, pos: pp });
    }
    return true;
  });

  return result;
}
