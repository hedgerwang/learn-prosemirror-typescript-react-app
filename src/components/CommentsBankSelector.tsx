// @flow
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { useCallback, useEffect, useRef, useState } from "react";
import insertText from "../transforms/insertText";
import cx from "classnames";

let COMMENTS = [
  "As you worked toward this victory, you behaved with such humility, grace and kindness to others. I appreciate how you always share your success with your team, and your love for your community is one of the reasons you rise to the top.",
  "Cheers to you for a job well done! No one can compare to your creativity and passion, and it's no surprise that you've become so successful.",
  "Congratulations on the amazing news! This is an incredible milestone and you deserve the spotlight to celebrate the moment.",
  "Congratulations on your incredible success! I always knew you could do it, and I'm incredibly proud of you.",
  "I saw you work so hard every day to achieve this accomplishment, and I can't think of anyone who deserves it more. You set an amazing example for everyone at the company.",
  "I'm in awe of your skill and commitment. You're awesome!",
  "I'm so thrilled to hear that you reached your goal. You inspire by having such ambitious dreams then putting in the hard work to achieve them.",
  "This amazing accomplishment is just one step on your journey. Your ability to relentlessly search for solutions to problems and find innovative ways to improve the world is the key to this success and many to come.",
  "You overcame so many obstacles to achieve this win. Your perseverance is an inspiration to everyone you meet, and you earned all the rewards coming your way.",
  "You worked so hard and pushed your abilities to the limit to make this success happen. Congratulations!",
];

function MenuItem(props: {
  selected: boolean;
  query: string;
  text: string;
  onSubmit: (value: string) => void;
}) {
  const { selected, query, text, onSubmit } = props;
  const elRef = useRef<HTMLButtonElement | null>(null);
  const tokens = text.split(query);
  const parts: Array<any> = [];
  let kk = 0;

  while (tokens.length) {
    const token = tokens.shift();
    parts.push(token);
    if (tokens.length) {
      parts.push(
        <b className="text-blue-700" key={`p${kk++}`}>
          {query}
        </b>
      );
    }
  }

  useEffect(() => {
    const el = elRef.current;
    if (selected && el) {
      el.scrollIntoView(false);
    }
  }, [selected]);

  return (
    <li className={selected ? "bg-gray-200" : ""} key={`${text}`}>
      <button
        onClick={() => onSubmit(text)}
        ref={elRef}
        className="hover:bg-gray-100 block border-b break-all p-2 text-left text-xs w-full text-gray-600"
      >
        {parts}
      </button>
    </li>
  );
}

export default function CommentsBankSelector(props: {
  editorState: EditorState;
  editorView: EditorView | null;
  onTransaction: (tr: Transaction) => void;
  className?: string | null | undefined;
}) {
  const { editorView, onTransaction, className } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string[]>([]);
  const input = useRef<HTMLInputElement | null>(null);
  const timer = useRef(0);

  const onChange = useCallback(() => {
    const value = input.current?.value || "";
    timer.current = window.setTimeout(() => {
      const nextResult = value
        ? COMMENTS.filter((cc) => cc.includes(value))
        : [];
      setResult(nextResult);
      setSelectedIndex(0);
    }, 150);
    setQuery(value);
    return () => {
      window.clearTimeout(timer.current);
    };
  }, []);

  const onSubmit = useCallback(
    (text: string) => {
      setQuery("");
      setResult([]);
      const newText = text || query;
      if (!newText || !editorView) {
        return;
      }
      editorView.focus();
      const tr = insertText(editorView.state.tr, newText);
      onTransaction(tr);

      const comments = COMMENTS.concat([newText]);
      COMMENTS = Array.from(new Set(comments)).sort();
    },
    [editorView, query, onTransaction]
  );

  const onKeyDown = useCallback(
    (e) => {
      const { key } = e;
      if (key === "ArrowDown") {
        const ii = selectedIndex + 1;
        if (result[ii]) {
          setSelectedIndex(ii);
        }
      } else if (key === "ArrowUp") {
        const ii = selectedIndex - 1;
        if (result[ii]) {
          setSelectedIndex(ii);
        }
      } else if (key === "Enter") {
        onSubmit(result[selectedIndex] || "");
      }
    },
    [selectedIndex, result, onSubmit]
  );

  const flyout = result.length ? (
    <ul
      className="absolute bg-white border border-1 flex flex-col 
      left-0 max-h-96 my-2 overflow-auto p-2 shadow top-0 w-full"
    >
      {result.map((t, ii) => (
        <MenuItem
          key={`mi-${ii}`}
          onSubmit={onSubmit}
          query={query}
          selected={selectedIndex === ii}
          text={result[ii]}
        />
      ))}
    </ul>
  ) : null;

  const classNames = cx(
    "bg-white border-1 flex flex-col my-2 p-4 rounded-md shadow-sm text-gray-800 w-80 ",
    className
  );

  return (
    <div className={classNames}>
      <label className="block font-bold mb-2">comments bank</label>
      <div className="block border border-1 relative">
        <input
          className="p-2 rounded shadow-inner text-gray-800 w-full"
          type="text"
          onChange={onChange}
          placeholder="search comment..."
          ref={input}
          onKeyDown={onKeyDown}
          value={query}
        />
      </div>
      <div className="relative">{flyout}</div>
    </div>
  );
}
