// @flow

import type { NodeSpec } from "prosemirror-model";

const DocNodeSpec: NodeSpec = {
  attrs: {
    worksheetMode: {
      default: false,
    },
  },
  content: "block+",
};

export default DocNodeSpec;
