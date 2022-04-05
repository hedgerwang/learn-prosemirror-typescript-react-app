// @flow

import cx from "classnames";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { ReactNode } from "react";
import isAtHeadingNode from "./isAtHeadingNode";
import {
  TOGGLE_H1_COMMAND,
  TOGGLE_H2_COMMAND,
  TOGGLE_H3_COMMAND,
  TOGGLE_H4_COMMAND,
} from "../transforms/toggleHeadingCommand";
import { Command } from "prosemirror-commands";
import toggleCheckboxBlock from "../transforms/toggleCheckboxBlock";
import { findParentNode } from "prosemirror-utils";

type Props = {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
};

function ControlButton(
  props: Props & {
    active?: boolean;
    command: Command;
    label: string | ReactNode;
  }
) {
  const { active, command, label, editorState, editorView, onTransaction } =
    props;
  const classNames = cx(
    "bg-gray-100 border border-1 border-white flex-1 p-4 hover:bg-gray-200 focus:bg-gray-200 text-gray-400",
    { ["text-black"]: active, ["font-bold"]: active }
  );
  const onClick = () => {
    editorView && editorView.focus();
    command(editorState, onTransaction);
  };
  return (
    <button className={classNames} onClick={onClick}>
      {label}
    </button>
  );
}

const TOGGLE_CHECKBOX_COMMAND: Command = (state, dispatch, view) => {
  let tr = state.tr;
  tr = toggleCheckboxBlock(state.schema, tr);
  dispatch && dispatch(tr);
  return tr.docChanged;
};

function isAtCheckboxBlock(state: EditorState): boolean {
  const nodeType = state.schema.nodes.paragraph;
  if (!nodeType) {
    return false;
  }
  const nodePos = findParentNode((nn) => nn.type === nodeType)(state.selection);
  if (!nodePos) {
    return false;
  }
  return nodePos.node.attrs.appearance === "checkbox";
}

function noop() {}

export default function TextControls(props: Props) {
  const state = props.editorState;
  const isCheckbox = isAtCheckboxBlock(state);
  return (
    <div className="flex flex-row my-2 overflow-hidden rounded-md">
      <ControlButton
        {...props}
        active={isAtHeadingNode(state, 1)}
        label="h1"
        command={TOGGLE_H1_COMMAND}
      />
      <ControlButton
        {...props}
        label="h2"
        active={isAtHeadingNode(state, 2)}
        command={TOGGLE_H2_COMMAND}
      />
      <ControlButton
        {...props}
        label="h3"
        active={isAtHeadingNode(state, 3)}
        command={TOGGLE_H3_COMMAND}
      />
      <ControlButton
        {...props}
        label="h4"
        active={isAtHeadingNode(state, 4)}
        command={TOGGLE_H4_COMMAND}
      />
      <ControlButton
        {...props}
        label={
          <input
            className="pointer-events-none"
            checked={!!isCheckbox}
            onChange={noop}
            type="checkbox"
          />
        }
        command={TOGGLE_CHECKBOX_COMMAND}
        active={isCheckbox}
      />
    </div>
  );
}
