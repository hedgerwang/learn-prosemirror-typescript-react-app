## Learning ProseMirror

[ProseMirror](https://prosemirror.net/) is a collection of open-sourced libraries which provides the utilities for rich text editing.

## Why ProseMirror?

- It's free & open-sourced.
- It has [well-documented](https://prosemirror.net/docs/guide/#doc) APIs.
- It has [active community support](https://discuss.prosemirror.net/).
- It supports [collaborative editing](https://prosemirror.net/docs/guide/#collab).
- It's is [designed](https://marijnhaverbeke.nl/blog/prosemirror-1.html) to support modern editor featured. Such as collaborative editing, custom rich contents...etc.

## Core Data Structures

### Schema

A [schema](https://prosemirror.net/docs/guide/#schema) defined the supported contents in the editor. The simplest schema could be the one that only supports plain text. In Notebooks, it uses the schema that supports `list`, `table`, `image`, `video`, `rurbic-card`...etc.

Different products that want to build different kind of editors that support their own specific needs. For example, we have different editors for comments and students work.

### EditorState

- The serializable [state](https://prosemirror.net/docs/ref/#state.EditorState) of the editor which renders the state.
- It's immutable and read-only.
- It contains the [selection](https://prosemirror.net/docs/ref/#state.EditorState.selection) and [the root node](https://prosemirror.net/docs/ref/#model.Node) of the document.

A state can be created from raw JSON blob:

```typescript
const editorState = EditorState.create({
  doc: schema.nodeFromJSON(json),
  schema: schema,
});
```

Or it can be created by applying [transform](https://prosemirror.net/docs/guide/#transform)

```typescript
const editorState = previousEditorState.apply(transform);
```

### Transform

Most editing features could be handled by writing codes that handle [transform](https://prosemirror.net/docs/guide/#transform). A transform defines sequential steps of how to update editor state.

For example, applying a transform to an editor state will generate a new editor state.

```typescript
let transform = editorState.tr;
transform = formatTextHighlightColor(transform, "#222");
transform = insertText(transform, "hello");
const nextEditorState = editorState.apply(transform);
```

## Build your your first editor.

ProseMirror does not provide any UI, so we need to build the UI and all the interactions from scratch.

1. Create schema.
2. Create editor state.
3. Create editor view.
4. Add basic editing plugins (e.g. history)
5. Add basic keyboard shorts bindings (e.g. undo, redo, new line...etc).

## Advance editor features.

1. Add plugin for text caret.
2. Add transform to modify document.

---

# Developer Guide

1. This app is created with [create-react-app](https://github.com/facebook/create-react-app). Please read its instruction if needed.
