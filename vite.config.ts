/// <reference types="vitest" />

import { copyFileSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const normalizeResolve = (...path: string[]) => resolve(__dirname, ...path).replace(/\\/g, '/');

const getPathsRecursively = (baseDir: string): string[] =>
	readdirSync(normalizeResolve(baseDir))
		.map((p) => normalizeResolve(baseDir, p))
		.map((p) => (statSync(p).isDirectory() ? getPathsRecursively(p) : p))
		.flat()
		.filter((p) => !/(\.spec|test)\.tsx?$/gi.test(p))
		.filter((p) => /\.tsx?$/gi.test(p));

const resolveEntryPath = (path: string, baseDir: string) =>
	path
		.replace(normalizeResolve(baseDir), '')
		.replace(/^\//, '')
		.replace(/\.tsx?$/g, '');

const getEntryPoints = (baseDir: string) =>
	Object.fromEntries(getPathsRecursively(baseDir).map((p) => [resolveEntryPath(p, baseDir), p]));

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: ['src'],
			exclude: ['src/types'],
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		lib: { name: 'BuildOutputRouter', entry: getEntryPoints('src') },
		sourcemap: true,
		minify: 'esbuild',
	},
	plugins: [
		tsconfigPaths(),
		dts({
			tsconfigPath: normalizeResolve('tsconfig.json'),
			include: ['src/**/*.{ts,tsx}', 'env.d.ts'],
			entryRoot: 'src',
			outDir: 'dist',
		}),
		{
			name: 'post-build-script',
			closeBundle: async () => {
				// Strip dist from package.json exports
				const packageJson = readFileSync(resolve('package.json'), 'utf-8');
				const withoutDist = packageJson.replace(/dist\//g, '');
				writeFileSync(resolve('dist', 'package.json'), withoutDist);

				// Copy README and LICENSE
				copyFileSync(resolve('README.md'), resolve('dist', 'README.md'));
				copyFileSync(resolve('LICENSE.md'), resolve('dist', 'LICENSE.md'));
			},
		},
	],
});
