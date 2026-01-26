import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        alias: {
            "styles": "./src/styles",
            "components": "./src/components",
            "lib": "./src/lib",
        },

        experimental: {
            remoteFunctions: true
        }
    },

    compilerOptions: {
        experimental: {
            async: true
        }
    }
};

export default config;
