// @flow
import * as React from 'react';
import {redo, redoDepth} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {useCallback} from 'react';
import cx from 'classnames';
import {BUTTON, BUTTON_DISABLED} from './styles';

export default function RedoButton(props: {
  editorState: EditorState
  editorView: EditorView | null;
}) {
  const {editorState, editorView} = props;

  const disabled = !editorState || redoDepth(editorState) === 0;

  const className = cx(BUTTON, 'block my-2', {[BUTTON_DISABLED]: disabled});
  
  const onClick = useCallback(() => {
    editorState && editorView && redo(editorState, editorView.dispatch);
  }, [editorState, editorView]);

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      Redo
    </button>
  );
}
