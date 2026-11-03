import { useEffect, useState } from "react";
import { Console } from "./components/console/Console";
import type { SectionId } from "./components/console/modules";
import { loadContent, type SiteContent } from "./data/content";

function readArticleId() {
  const match = /^#article\/([a-z0-9-]+)$/i.exec(window.location.hash);
  return match ? match[1].toLowerCase() : "";
}

function clearHash() {
  if (!window.location.hash) return;
  window.location.hash = "";
}

export default function App() {
  const initialArticle = readArticleId();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [contentError, setContentError] = useState("");
  const [articleId, setArticleId] = useState(initialArticle);
  const [section, setSection] = useState<SectionId | null>(initialArticle ? "projects" : null);
  const [scene, setScene] = useState<SectionId | null>(initialArticle ? "projects" : null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    loadContent()
      .then(setContent)
      .catch(() => setContentError("Could not read content.json"));
  }, []);

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash;
      if (hash && !hash.startsWith("#article/")) return;
      const id = readArticleId();
      setArticleId(id);
      if (id) {
        setTerminalOpen(false);
        setSection("projects");
        setScene("projects");
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function selectSection(id: SectionId) {
    setTerminalOpen(false);
    setArticleId("");
    clearHash();
    setScene(id);
    setSection(section === id ? null : id);
  }

  function toggleTerminal() {
    setArticleId("");
    clearHash();
    setSection(null);
    setTerminalOpen((open) => !open);
  }

  function openArticle(id: string) {
    setTerminalOpen(false);
    setScene("projects");
    setSection("projects");
    setArticleId(id);
    window.location.hash = `article/${id}`;
  }

  function closeArticle() {
    setArticleId("");
    clearHash();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Console
        content={content}
        error={contentError}
        section={section}
        scene={scene}
        articleId={articleId}
        terminalOpen={terminalOpen}
        onSelect={selectSection}
        onToggleTerminal={toggleTerminal}
        onOpenArticle={openArticle}
        onCloseArticle={closeArticle}
      />
    </>
  );
}
