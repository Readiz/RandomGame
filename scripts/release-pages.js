import { cp, rename } from "node:fs/promises";

// GitHub Pages serves master:/docs. Publish assets before either entry point.
await cp("dist", "docs", {
  recursive: true,
  filter: (source) => !source.endsWith(".html"),
});
for (const page of ["classic.html", "index.html"]) {
  await cp(`dist/${page}`, `docs/${page}.next`);
  await rename(`docs/${page}.next`, `docs/${page}`);
}
