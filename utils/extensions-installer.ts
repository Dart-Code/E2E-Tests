import { spawn } from "child_process";

export class ExtensionInstaller {
	static async installExtensions(codeExecutable: string, codeCli: string, userDataDir: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const installProcess = spawn(codeExecutable, [
				codeCli,
				"--user-data-dir", userDataDir,
				"--disable-workspace-trust",
				"--install-extension", "dart-code.dart-code", "--pre-release", "--force",
				"--install-extension", "dart-code.flutter", "--pre-release", "--force"
			], { env: { ELECTRON_RUN_AS_NODE: "1" } });

			installProcess.on("close", (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`Extension installation failed with code ${code}`));
				}
			});

			installProcess.on("error", (error) => {
				reject(error);
			});
		});
	}
}
