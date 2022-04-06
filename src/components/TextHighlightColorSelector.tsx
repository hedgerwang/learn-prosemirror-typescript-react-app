// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback, useRef, useEffect } from "react";
import setTextHighlightColor from "../transforms/setTextHighlightColor";
import drawColorGradient from "./drawColorGradient";
import getEventOffset from "./getEventOffset";
import useActiveTextHighlightColor from "./useActiveTextHighlightColor";

const WIDTH = 300;
const HEIGHT = 100;

export default function TextHighlightColorSelector(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
}) {
  const { editorState, editorView, onTransaction } = props;
  const colorsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeColor = useActiveTextHighlightColor(editorState);
  const domWin: any = window;
  const EyeDropper = domWin.EyeDropper;

  const setColor = useCallback(
    (color) => {
      const tr = setTextHighlightColor(
        editorState.schema,
        editorState.tr,
        color
      );
      onTransaction(tr);
    },
    [editorState, onTransaction]
  );

  const onEyeDropperClick = useCallback(async () => {
    if (EyeDropper) {
      let eyeDropper = new EyeDropper();
      try {
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
      } finally {
        eyeDropper = null;
      }
    }
  }, [setColor, EyeDropper]);

  useEffect(() => {
    const colors = colorsCanvasRef.current;
    colors && drawColorGradient(colors, WIDTH, HEIGHT);
  }, []);

  const onClick = useCallback(
    (event) => {
      const { target } = event;
      if (!(target instanceof HTMLCanvasElement)) {
        return;
      }
      const ctx = target.getContext("2d");
      if (!ctx) {
        return;
      }

      const [x, y] = getEventOffset(event);
      const [rr, gg, bb] = Array.from(ctx.getImageData(x, y, 1, 1).data);
      const color = `rgb(${rr},${gg},${bb})`;
      setColor(color);
    },
    [setColor]
  );

  return (
    <div className="bg-white border border-1 focus-within:outline-black my-2 overflow-hidden rounded-md shadow-sm">
      <label className="block flex flex-col">
        <span className="block font-bold px-2 py-2 bg-gray-800">
          <button
            className="align-middle border-1 h-5 inline-block mx-2 rounded-full shadow w-5"
            style={{ backgroundColor: activeColor }}
            onClick={onEyeDropperClick}
            disabled={!EyeDropper}
          />
          <span className="text-white">highlight color</span>
        </span>

        <button
          className="outline-none rounded-br rounded-bl overflow-hidden border-t block"
          onClick={EyeDropper ? onEyeDropperClick : onClick}
        >
          <canvas
            className="outline-none block cursor-crosshair"
            ref={colorsCanvasRef}
          />
        </button>
      </label>
    </div>
  );
}
