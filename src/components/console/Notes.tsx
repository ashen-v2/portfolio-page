import { useId, useState } from "react";

const STORAGE_KEY = "console-notes";

function storedNotes() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function Notes() {
  const fieldId = useId();
  const [text, setText] = useState(storedNotes);

  function onChange(value: string) {
    setText(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* keep the note for this visit */
    }
  }

  return (
    <div className="tool-panel notes-tool" id="notes">
      <div className="notes-sheet">
        <h3>
          <label htmlFor={fieldId}>Field notes</label>
        </h3>
        <textarea
          id={fieldId}
          className="notes-pad"
          value={text}
          spellCheck={false}
          placeholder="Write something..."
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
