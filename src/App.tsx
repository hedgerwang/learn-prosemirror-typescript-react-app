// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback, useState } from "react";
import createEditorPlugins from "./createEditorPlugins";
import createEditorSchema from "./createEditorSchema";
import createEditorState from "./createEditorState";
import EditableArea from "./EditableArea";
import RedoButton from "./RedoButton";
import TextHighlightColorSelector from "./TextHighlightColorSelector";
import UndoButton from "./UndoButton";
import applyTransaction from "./applyTransaction";
import CommentsBankSelector from "./CommentsBankSelector";

function createInitialEditorState() {
  const schema = createEditorSchema();
  const plugins = createEditorPlugins();
  return createEditorState(schema, plugins);
}

export default function App() {
  const [editorState, setEditorState] = useState<EditorState>(
    createInitialEditorState
  );

  const [editorView, setEditorView] = useState<EditorView | null>(null);

  const onTransaction = useCallback(
    (tr: Transaction) => setEditorState(applyTransaction(editorState, tr)),
    [editorState, setEditorState]
  );

  return (
    <div className="bg-gray-100 box-border flex flex-row h-screen p-6">
      <div className="border border-gray-50 flex flex-1 flex-row">
        <EditableArea
          editorState={editorState}
          onReady={setEditorView}
          onTransaction={onTransaction}
        />
      </div>
      <div className="w-6" />
      <div className="border border-gray-50 flex flex-col p-4 w-max overflow-auto">
        <UndoButton
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />
        <RedoButton
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />
        <TextHighlightColorSelector
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />
        <CommentsBankSelector
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />
      </div>
    </div>
  );
}
