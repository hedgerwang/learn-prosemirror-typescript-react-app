// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { BUTTON, BUTTON_DISABLED } from "./styles";
import cx from "classnames";
import insertInputSection from "../transforms/insertInputSection";
import setInputSectionMode from "../transforms/setInputSectionMode";

export default function InputSectionPanel(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
}) {
  const { editorState, editorView, onTransaction } = props;
  const { schema } = editorState;
  const inputSectionMode = !!editorState.doc.attrs.inputSectionMode;
  const dryRun = insertInputSection(schema, editorState.tr, true);
  const disabled = dryRun.getMeta("ok") ? false : true;

  const onInsertInputSection = () => {
    if (editorView) {
      editorView.focus();
      const tr2 = insertInputSection(schema, editorState.tr);
      onTransaction(tr2);
    }
  };

  const toggleInputSectionMode = (e: any) => {
    if (editorView) {
      editorView.focus();
      const tr2 = setInputSectionMode(
        schema,
        editorView.state.tr,
        e.target.checked
      );
      onTransaction(tr2);
    }
  };

  return (
    <div className="bg-white border-1 flex flex-col my-2 p-4 rounded-md shadow-sm text-gray-800 w-80 ">
      <label className="block font-bold">worksheet</label>

      <label className="block my-2 py-2 cursor-pointer">
        <input
          checked={!!inputSectionMode}
          type="checkbox"
          onChange={toggleInputSectionMode}
          className="
            form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 
            checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top
            inline-block mx-2"
        />
        <span className="select-none inline-block">enable worksheet mode</span>
      </label>

      <button
        className={cx(BUTTON, { [BUTTON_DISABLED]: disabled })}
        onClick={onInsertInputSection}
        disabled={disabled}
      >
        Add work sheet section
      </button>
    </div>
  );
}
