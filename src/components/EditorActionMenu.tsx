// @flow

import { EditorView } from "prosemirror-view";
import { useCallback, useRef } from "react";
import { SHOW_COMMENTS_BANK_MENU } from "./CommentsBankMenu";
import useFocusBoundary from "./useFocusBoundary";

export const SHOW_ACTION_MENU = "show_action_menu";
export const HIDE_ACTION_MENU = "hide_action_menu";

function MenuItem(props: {
  editorView: EditorView;
  label: string;
  action: string;
}) {
  const { label, action, editorView } = props;

  const onClick = useCallback(() => {
    editorView.focus();
    let tr = editorView.state.tr.setMeta("action", {
      [HIDE_ACTION_MENU]: true,
      [action]: true,
    });
    // Delete the starting "/" character that opens the menu.
    tr = tr.deleteRange(tr.selection.to - 1, tr.selection.to);
    // Insert space character.
    tr = tr.insertText(" ");
    editorView.dispatch(tr);
  }, [action, editorView]);

  const onKeyDown = useCallback(
    (e) => {
      e.preventDefault();
      const { key, target } = e;
      const { nextElementSibling, previousElementSibling } = target;
      if (
        key === "ArrowDown" &&
        nextElementSibling instanceof HTMLButtonElement
      ) {
        nextElementSibling.focus();
      } else if (
        key === "ArrowUp" &&
        previousElementSibling instanceof HTMLButtonElement
      ) {
        previousElementSibling.focus();
      } else if (key === "Enter") {
        target.click();
      } else {
        editorView.focus();
      }
    },
    [editorView]
  );
  return (
    <button
      onClick={onClick}
      style={{ marginBottom: "1px" }}
      onKeyDown={onKeyDown}
      className="block break-all px-4 py-1
        focus:bg-blue-600
        hover:bg-blue-600
        outline-none
        text-left whitespace-nowrap
        text-white
        rounded-lg
        w-full"
    >
      {label}
    </button>
  );
}

export default function EditorActionMenu(props: { editorView: EditorView }) {
  const { editorView } = props;
  const elRef = useRef<HTMLDivElement | null>(null);

  const onFocusLeave = useCallback(() => {
    const tr = editorView.state.tr.setMeta("action", {
      [HIDE_ACTION_MENU]: true,
    });
    editorView.dispatch(tr);
  }, [editorView]);

  useFocusBoundary(elRef, { autoFocus: true, onFocusLeave });

  return (
    <div
      className="absolute bg-gray-900 border border-2 border-gray-200 left-0 overflow-hidden p-2 rounded-md shadow-xl text-sm text-white top-0"
      tabIndex={-1}
      ref={elRef}
    >
      <div className="px-2 py-1 font-bold whitespace-nowrap">
        Quick actions...
      </div>
      <MenuItem
        label="Insert math comments"
        action={SHOW_COMMENTS_BANK_MENU}
        editorView={editorView}
      />
      <MenuItem
        label="Insert cogskill comments"
        action={SHOW_COMMENTS_BANK_MENU}
        editorView={editorView}
      />
      <MenuItem
        label="Insert checkpoint comments"
        action={SHOW_COMMENTS_BANK_MENU}
        editorView={editorView}
      />
      <MenuItem
        label="Insert final product comments"
        action={SHOW_COMMENTS_BANK_MENU}
        editorView={editorView}
      />
    </div>
  );
}
