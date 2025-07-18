import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0, // process.env.CI ? 2 : 0,
	workers: 1, // process.env.CI ? 1 : undefined,
	timeout: 180 * 1000, // 180 sec
	expect: {
		timeout: 30 * 1000, // 30 sec
	},
	globalTimeout: 30 * 60 * 1000, // 30 min
	// TODO(dantup): Test this.
	// reporter: process.env.CI ? 'github' : 'list',
	reporter: [
		['html', { open: 'never' }],
		['json', { outputFile: 'results.json' }]
	],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'on',
	},
});
