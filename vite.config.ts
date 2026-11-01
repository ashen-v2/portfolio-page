import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function sameFile(left: string, right: string) {
  const a = path.resolve(left);
  const b = path.resolve(right);
  return process.platform === "win32" ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function reloadContentFile(): Plugin {
  const file = path.resolve("public/content.json");
  return {
    name: "reload-content-json",
    configureServer(server) {
      server.watcher.add(file);
      server.watcher.on("change", (changed) => {
        if (sameFile(changed, file)) server.ws.send({ type: "full-reload" });
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), reloadContentFile()],
});
