// @flow
import { undo, redo } from "prosemirror-history";
import type { Keymap } from "prosemirror-commands";
import enterParagraphCommand from "./enterParagraphCommand";

const IS_MAC =
  /Mac/.test(String(window.navigator.platform)) ||
  /Mac/.test(String(window.navigator.userAgent));

const MOD_KEY = IS_MAC ? "Cmd" : "Ctrl";

export default function createEditorKeyMap(): Keymap {
  return {
    Enter: enterParagraphCommand,
    [`${MOD_KEY}-z`]: undo,
    [`${MOD_KEY}-u`]: redo,
  };
}
