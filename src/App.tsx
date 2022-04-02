// @flow
import * as React from 'react';
import {EditorState, Transaction} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {useCallback, useState} from 'react';
import EditableArea from './EditableArea';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import createEditorState from './createEditorState';
import createEditorSchema from './createEditorSchema';
import createEditorPlugins from './createEditorPlugins';

function createInitialEditorState() {
  const schema = createEditorSchema();
  const plugins = createEditorPlugins();
  return createEditorState(schema, plugins);
}

export default function App() {
  const [editorState, setEditorState] = useState<EditorState>(createInitialEditorState);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  const onReady = useCallback(
    (view: EditorView) => {
      setEditorState(view.state);
      setEditorView(view);
    },
    [setEditorState, setEditorView],
  );

  const onTransaction = useCallback(
    (tr: Transaction) => editorState && setEditorState(editorState.apply(tr)),
    [editorState, setEditorState],
  );

  return (
    <div className="box-border flex flex-row p-6 h-screen bg-gray-50">
      <div className="border border-gray-50 flex flex-row flex-1">
        <EditableArea
          editorState={editorState}
          onReady={onReady}
          onTransaction={onTransaction}
        />
      </div>
      <div className="w-6" />
      <div className="border border-gray-50 flex flex-col p-4 w-max">
        <UndoButton editorState={editorState} editorView={editorView} />
        <RedoButton editorState={editorState} editorView={editorView} />
      </div>
    </div>
  );
}
