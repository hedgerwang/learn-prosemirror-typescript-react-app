// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { BUTTON, BUTTON_DISABLED } from "./styles";
import cx from "classnames";
import insertInputSection from "./insertInputSection";
import setInputSectionMode from "./setInputSectionMode";

export default function InputSectionPanel(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
}) {
  const { editorState, editorView, onTransaction } = props;
  const { schema } = editorState;
  const inputSectionMode = !!editorState.doc.attrs.inputSectionMode;
  const nextTr = insertInputSection(schema, editorState.tr);
  const disabled = !nextTr.docChanged;

  const onInsertInputSection = () => {
    if (editorView) {
      editorView.focus();
      onTransaction(nextTr);
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
    <div className="bg-white border-1 flex flex-col my-2 my-4 p-4 rounded shadow-sm text-gray-800 w-80 ">
      <label className="block font-bold mb-2">input section</label>

      <label className="block my-2 py-2 cursor-pointer">
        <input
          checked={inputSectionMode}
          type="checkbox"
          onChange={toggleInputSectionMode}
          className="
            form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 
            checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top
            inline-block mx-2"
        />
        <span className="select-none inline-block">
          Only allow editing input sections.
        </span>
      </label>

      <button
        className={cx(BUTTON, { [BUTTON_DISABLED]: disabled })}
        onClick={onInsertInputSection}
        disabled={disabled}
      >
        Insert input section
      </button>
    </div>
  );
}
