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
    const tr = editorView.state.tr.setMeta("action", {
      [HIDE_ACTION_MENU]: true,
      [action]: true,
    });
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
      className="block break-all px-4 py-2
        bg-gray-500
        text-white
        text-left whitespace-nowrap
        hover:bg-gray-600
        focus:bg-gray-600
        pl-8
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
      className="absolute bg-white border left-0 overflow-hidden rounded shadow top-0"
      tabIndex={-1}
      ref={elRef}
    >
      <div className="px-4 py-2 font-bold border-b bg-gray-200 whitespace-nowrap">
        Quick actions...
      </div>
      <MenuItem
        label="Insert text from comments bank"
        action={SHOW_COMMENTS_BANK_MENU}
        editorView={editorView}
      />
      <MenuItem
        label="Upload image"
        action="upload-image"
        editorView={editorView}
      />
    </div>
  );
}
