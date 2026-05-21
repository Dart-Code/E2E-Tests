import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0, // process.env.CI ? 2 : 0,
	workers: 1, // process.env.CI ? 1 : undefined,
	timeout: 360 * 1000, // 360 sec
	expect: {
		timeout: 180 * 1000, // 180 sec
	},
	globalTimeout: 30 * 60 * 1000, // 30 min
	// TODO(dantup): Test this.
	// reporter: process.env.CI ? 'github' : 'list',
	reporter: [
		['html', { open: 'never' }],
		['playwright-ctrf-json-reporter', { outputDir: 'test-results', outputFile: 'ctrf-report.json' }]
	],
	use: {
		actionTimeout: 180 * 1000, // 180 sec
		navigationTimeout: 180 * 1000, // 180 sec
		trace: 'retain-on-failure',
		screenshot: 'on',
	},
});
