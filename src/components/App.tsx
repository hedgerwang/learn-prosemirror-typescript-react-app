// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback, useEffect, useRef, useState } from "react";
import createEditorPlugins from "../createEditorPlugins";
import createEditorSchema from "../createEditorSchema";
import createEditorState from "../createEditorState";
import EditableArea from "./EditableArea";
import TextControls from "./TextControls";
import TextHighlightColorSelector from "./TextHighlightColorSelector";
import applyTransaction from "../transforms/applyTransaction";
import CommentsBankSelector from "./CommentsBankSelector";
import WorksheetControls from "./WorksheetControls";
import HistoryControls from "./HistoryControls";

function createInitialEditorState() {
  const schema = createEditorSchema();
  const plugins = createEditorPlugins();
  let json: Object | null = null;
  try {
    json = JSON.parse(window.name);
  } catch (ex) {
    // skip;
  }
  return createEditorState(schema, plugins, json);
}

export default function App() {
  const savedDoc = useRef({});

  const [editorState, setEditorState] = useState<EditorState>(
    createInitialEditorState
  );

  const [editorView, setEditorView] = useState<EditorView | null>(null);

  const onTransaction = useCallback(
    (tr: Transaction) => {
      editorView && editorView.focus();
      const state = applyTransaction(editorState, tr);
      setEditorState(state);
    },
    [editorState, editorView, setEditorState]
  );

  useEffect(() => {
    const { doc } = editorState;
    if (savedDoc.current !== doc) {
      document.title = "Saving...";
      const timer = setTimeout(() => {
        savedDoc.current = doc;
        const json = editorState.doc.toJSON();
        // Store json into current tab's session
        window.name = JSON.stringify(json);
        document.title = "Saved";
        return () => clearTimeout(timer);
      }, 500);
    }
  }, [editorState]);

  return (
    <div className="bg-gray-200 box-border flex flex-row min-h-screen p-6">
      <div className="flex flex-1 flex-row">
        <EditableArea
          editorState={editorState}
          onReady={setEditorView}
          onTransaction={onTransaction}
        />
      </div>
      <div className="w-6" />
      <div className="flex flex-col p-4 w-max overflow-auto select-none">
        <HistoryControls
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />
        <TextControls
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
        <WorksheetControls
          editorState={editorState}
          editorView={editorView}
          onTransaction={onTransaction}
        />

        <div className="mt-4">
          <a
            className="text-blue-700 hover:underline text-sm"
            href="https://github.com/hedgerwang/learn-prosemirror-typescript-react-app"
            target="new"
          >
            &raquo; View the github project
          </a>
        </div>
      </div>
    </div>
  );
}
