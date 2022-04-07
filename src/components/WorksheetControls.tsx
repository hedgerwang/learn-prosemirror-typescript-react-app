// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { BUTTON, BUTTON_DISABLED } from "./styles";
import cx from "classnames";
import insertInputSection from "../transforms/insertInputSection";
import setWorksheetMode from "../transforms/setWorksheetMode";
import insertInputLine from "../transforms/insertInputLine";

function isValidWorksheet(state: EditorState): boolean {
  const { inputSection } = state.schema.nodes;
  if (!inputSection) {
    return false;
  }
  let found = false;
  state.doc.descendants((node) => {
    if (node.type === inputSection) {
      found = true;
    }
    return found;
  });
  return found;
}

export default function WorksheetControls(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
}) {
  const { editorState, editorView, onTransaction } = props;
  const { schema } = editorState;
  const worksheetMode = !!editorState.doc.attrs.worksheetMode;
  const tr = insertInputSection(schema, editorState.tr, true);
  const disabled = (!tr.getMeta("ok") && !tr.docChanged) || worksheetMode;

  const onInsertInputSection = () => {
    if (editorView) {
      const tr2 = insertInputSection(schema, editorState.tr);
      onTransaction(tr2);
    }
  };

  const onInsertInputLine = () => {
    if (editorView) {
      const tr2 = insertInputLine(schema, editorState.tr);
      onTransaction(tr2);
    }
  };

  const toggleworksheetMode = (e: any) => {
    if (editorView) {
      const tr2 = setWorksheetMode(
        schema,
        editorView.state.tr,
        e.target.checked
      );
      onTransaction(tr2);
    }
  };

  const checkboxDisabled = !isValidWorksheet(editorState) && !worksheetMode;
  const checkboxStyle = checkboxDisabled ? "cursor-text text-gray-400" : "";

  return (
    <div className="bg-white border-1 flex flex-col my-2 p-4 rounded-md shadow-sm text-gray-800 w-80 ">
      <label className="block font-bold">worksheet</label>

      <label className={`block my-2 py-2 cursor-pointer ${checkboxStyle}`}>
        <input
          disabled={checkboxDisabled}
          checked={!!worksheetMode}
          type="checkbox"
          onChange={toggleworksheetMode}
          className={`form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 
            checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top
            inline-block mx-2 ${checkboxStyle}`}
        />
        <span className="select-none inline-block">enable worksheet mode</span>
      </label>

      <button
        className={cx(BUTTON, { [BUTTON_DISABLED]: disabled })}
        onClick={onInsertInputSection}
        disabled={disabled}
      >
        Add text block
      </button>
      <button
        className={cx(BUTTON, { [BUTTON_DISABLED]: disabled })}
        onClick={onInsertInputLine}
      >
        Add inline block
      </button>
    </div>
  );
}
