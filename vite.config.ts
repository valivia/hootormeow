import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({ compiler: "svelte", autoInstall: true }),
	],
	resolve: {
		alias: {
			".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
		}
	}
});
