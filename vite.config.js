import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Use the official Vite React plugin
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all IPv6 and IPv4 addresses
    port: 3000, // Set the port to 8080
  },
  plugins: [
    react({
      include: "**/*.{js,jsx}", // Treat .js files as JSX
    }), // Use the official Vite React plugin
    mode === "development" && componentTagger(), // Conditionally apply the component tagger plugin in development
  ].filter(Boolean), // Remove falsy values from the plugins array
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Set up path aliases for cleaner imports
    },
  },
  build: {
    outDir: "dist", // Output directory for the build
    sourcemap: true, // Generate source maps for debugging
  },
  optimizeDeps: {
    include: ["react", "react-dom"], // Optimize dependencies for faster development
  },
}));