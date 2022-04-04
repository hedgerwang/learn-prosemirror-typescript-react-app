// @flow
import {
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  chainCommands,
  Command,
} from "prosemirror-commands";

export default function enterParagraphCommand(): Command {
  return chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock);
}

export const ENTER_PARAGRAPH_COMMAND = enterParagraphCommand();
