// @flow
import {
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  chainCommands,
  Command,
} from "prosemirror-commands";
import insertParagraphAtInputSection from "./insertParagraphAtInputSection";

export default function enterParagraphCommand(): Command {
  return chainCommands(
    insertParagraphAtInputSection,
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock
  );
}

export const ENTER_PARAGRAPH_COMMAND = enterParagraphCommand();
