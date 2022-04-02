// @flow

import * as React from 'react';
import {EditorState, Transaction} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {useEffect, useRef} from 'react';

type Callbacks = {
  onTransaction: (tr: Transaction) => void;
  onReady: (view: EditorView) => void;
};

type Props = Callbacks & {
  editorState: EditorState;
};

export default function EditableArea(props: Props) {
  const {editorState, onTransaction, onReady} = props;
  const elementRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const editorStateRef = useRef<EditorState>(editorState);
  const callbacksRef = useRef<Callbacks>({onReady, onTransaction});

  useEffect(() => {
    // This creates EditorView when the component is mounted and destroys it
    // when the component is unmounted.
    const element = elementRef.current;
    if (element) {
      const editorView = new EditorView(element, {
        dispatchTransaction: tr => callbacksRef.current.onTransaction(tr),
        state: editorStateRef.current,
      });
      editorView.dom.className +=
        ' h-full overflow-auto p-4 text-base w-full break-all';
      editorViewRef.current = editorView;
      callbacksRef.current.onReady(editorView);
      return () => {
        editorView.destroy();
        editorViewRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    // Changes of callbacks does not trigger re-render. Store them as references
    // so they can be used by `editorView` later.
    callbacksRef.current = {onReady, onTransaction};
  }, [onReady, onTransaction]);

  // Ensure that view always sync to editor state.
  useEffect(() => {
    editorStateRef.current = editorState;
    const editorView = editorViewRef.current;
    if (editorView && editorState && editorView.state !== editorState) {
      editorView.updateState(editorState);
    }
  }, [editorState]);

  return <div className="flex flex-1 content" ref={elementRef} />;
}
