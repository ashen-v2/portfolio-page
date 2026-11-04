import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const articleFile = /^[a-z0-9-]+\.md$/i;

function articleSrc(src: string | undefined) {
  const raw = src ?? "";
  if (raw.startsWith("http") || raw.startsWith("data:") || raw.startsWith("/")) return raw;
  return `${import.meta.env.BASE_URL}articles/${raw.replace(/^\.\//, "")}`;
}

export function QuestArticle({ file, onBack }: { file: string; onBack: () => void }) {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!articleFile.test(file)) {
      setError("This article is not available.");
      setMarkdown("");
      return;
    }

    const url = `${import.meta.env.BASE_URL}articles/${file}`;
    let cancel = false;
    setError("");
    setMarkdown("");
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("missing");
        return response.text();
      })
      .then((text) => {
        if (!cancel) setMarkdown(text);
      })
      .catch(() => {
        if (!cancel) setError("This article is not available.");
      });

    return () => {
      cancel = true;
    };
  }, [file]);

  return (
    <div className="article-view jrpg-card">
      <div className="quest-toolbar">
        <button type="button" className="btn secondary" onClick={onBack}>
          Back
        </button>
      </div>
      {error ? <p>{error}</p> : null}
      {markdown ? (
        <div className="article">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => <img src={articleSrc(src)} alt={alt ?? ""} />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
