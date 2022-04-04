// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  chainCommands,
} from "prosemirror-commands";

export default function enterParagraphCommand(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  const command = chainCommands(
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock
  );
  return command(state, dispatch, view);
}
