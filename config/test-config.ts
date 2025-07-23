import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __e2etests = path.dirname(__dirname);
const isWin = process.platform === "win32";

function findCodeCliExecutable(): string {
	const command = isWin ? "where code.cmd" : "which code";
	const result = execSync(command, { encoding: "utf8" });

	// On Windows, "where" might return multiple paths, take the first one.
	const codePath = result.trim().split("\n")[0].trim();

	if (codePath)
		return fs.realpathSync(codePath);

	throw new Error(`Failed to find 'code' on PATH`);
}

const vsCodeExecutableName = isWin ? "code.exe" : "code";
const vsCodeCliExecutable = findCodeCliExecutable();
const vsCodeCliScript = path.normalize(path.join(path.dirname(vsCodeCliExecutable), "..", "resources", "app", "out", "cli.js"));
const vsCodeElectronExecutable = path.normalize(path.join(path.dirname(vsCodeCliExecutable), "..", vsCodeExecutableName));

export const TEST_CONFIG = {
	VSCODE_CLI_SCRIPT: vsCodeCliScript,
	VSCODE_ELECTRON_EXECUTABLE: vsCodeElectronExecutable,
	DART_CODE_EXTENSION_DIR: path.resolve(__e2etests, "Dart-Code"),
	FLUTTER_CODE_EXTENSION_DIR: path.resolve(__e2etests, "Flutter-Code"),
	TEST_PROJECT_DIR: path.resolve(__e2etests, "test-apps/flutter_counter"),
	VSCODE_USER_DATA_DIR: path.resolve(__e2etests, "vscode-data/user-data-dir"),
	VSCODE_EXTENSIONS_DIR: path.resolve(__e2etests, "vscode-data/extensions-dir"),
};
