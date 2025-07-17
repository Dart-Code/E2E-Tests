import { spawn } from "child_process";
import path from "path";
import { TEST_CONFIG } from "../config";

/**
 * Utility class for installing VS Code extensions
 */
export class ExtensionInstaller {
	/**
	 * Installs the required extensions.
	 */
	static async installExtensions(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const stdoutChunks: Buffer[] = [];
			const stderrChunks: Buffer[] = [];

			function rejectWithOutput(message: string) {
				const stdout = Buffer.concat(stdoutChunks).toString();
				const stderr = Buffer.concat(stderrChunks).toString();
				const stdoutInfo = stdout ? `\nStdout: ${stdout}` : "";
				const stderrInfo = stderr ? `\nStderr: ${stderr}` : "";
				reject(new Error(`${message}${stdoutInfo}${stderrInfo}`));
			};

			const installProcess = spawn(TEST_CONFIG.VSCODE_ELECTRON_EXECUTABLE, [
				TEST_CONFIG.VSCODE_CLI_SCRIPT,
				"--user-data-dir",
				TEST_CONFIG.VSCODE_USER_DATA_DIR,
				"--extensions-dir",
				TEST_CONFIG.VSCODE_EXTENSIONS_DIR,
				"--disable-workspace-trust",
				"--disable-extensions",
				"--install-extension", "dart-code.dart-code", "--pre-release", "--force",
				"--install-extension", "dart-code.flutter", "--pre-release", "--force"
			], { env: { ELECTRON_RUN_AS_NODE: "1" } });

			installProcess.stdout?.on("data", (data) => stdoutChunks.push(data));
			installProcess.stderr?.on("data", (data) => stderrChunks.push(data));

			installProcess.on("close", (code) => {
				if (code === 0) {
					resolve();
				} else {
					rejectWithOutput(`Extension installation failed with code ${code}`);
				}
			});

			installProcess.on("error", (error) => {
				rejectWithOutput(error.message);
			});
		});
	}
}
