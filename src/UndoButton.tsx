// @flow

import * as React from 'react';
import {undo, undoDepth} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {useCallback} from 'react';

export default function UndoButton(props: {
  editorState: EditorState;
  editorView: EditorView | null;
}) {
  const {editorState, editorView} = props;

  const onClick = useCallback(() => {
    editorState && editorView && undo(editorState, editorView.dispatch);
  }, [editorState, editorView]);

  return (
    <button
      className="block my-2"
      disabled={!editorState || undoDepth(editorState) === 0}
      onClick={onClick}
    >
      Undo
    </button>
  );
}
