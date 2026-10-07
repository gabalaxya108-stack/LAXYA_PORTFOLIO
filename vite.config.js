import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        home: resolve(import.meta.dirname, "home/index.html"),
        about: resolve(import.meta.dirname, "about/index.html"),
        projects: resolve(import.meta.dirname, "projects/index.html"),
        coa: resolve(import.meta.dirname, "coa/index.html"),
        gallery: resolve(import.meta.dirname, "gallery/index.html"),
        resume: resolve(import.meta.dirname, "resume/index.html"),
        document: resolve(import.meta.dirname, "document/index.html"),
        contact: resolve(import.meta.dirname, "contact/index.html")
      }
    }
  }
});
