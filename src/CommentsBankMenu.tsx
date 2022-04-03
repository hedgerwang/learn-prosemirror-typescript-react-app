// @flow

import { EditorView } from "prosemirror-view";
import { useCallback, useRef } from "react";
import useFocusBoundary from "./useFocusBoundary";
import CommentsBankSelector from "./CommentsBankSelector";

export const SHOW_COMMENTS_BANK_MENU = "show_comments_bank_menu";
export const HIDE_COMMENTS_BANK_MENU = "hide_comments_bank_menu";

export default function CommentsBankMenu(props: { editorView: EditorView }) {
  const { editorView } = props;
  const elRef = useRef<HTMLDivElement | null>(null);

  const onFocusLeave = useCallback(() => {
    const tr = editorView.state.tr.setMeta("action", {
      [HIDE_COMMENTS_BANK_MENU]: true,
    });
    editorView.dispatch(tr);
  }, [editorView]);

  useFocusBoundary(elRef, { autoFocus: true, onFocusLeave });

  return (
    <div ref={elRef} className="top-0 left-0 absolute">
      <CommentsBankSelector
        className="shadow-lg bg-gray-600 text-gray-100"
        editorState={editorView.state}
        editorView={editorView}
        onTransaction={editorView.dispatch}
      />
    </div>
  );
}
