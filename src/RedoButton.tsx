// @flow
import {redo, redoDepth} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import * as React from 'react';
import {useCallback} from 'react';

export default function RedoButton(props: {
  editorState: EditorState
  editorView: EditorView | null;
}) {
  const {editorState, editorView} = props;

  const onClick = useCallback(() => {
    editorState && editorView && redo(editorState, editorView.dispatch);
  }, [editorState, editorView]);

  return (
    <button
      className="block my-2"
      disabled={!editorState || redoDepth(editorState) === 0}
      onClick={onClick}
    >
      Redo
    </button>
  );
}
