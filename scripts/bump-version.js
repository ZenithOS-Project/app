import { execSync } from "child_process";
import fs from "fs";

const commitMsg = fs.readFileSync(".git/COMMIT_EDITMSG", "utf-8");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const [major, minor, patch] = packageJson.version.split(".").map(Number);

let newVersion;
if (commitMsg.includes("BREAKING CHANGE")) {
  newVersion = `${major + 1}.0.0`;
} else if (commitMsg.startsWith("feat")) {
  newVersion = `${major}.${minor + 1}.0`;
} else if (commitMsg.startsWith("fix")) {
  newVersion = `${major}.${minor}.${patch + 1}`;
} else {
  newVersion = `${major}.${minor}.${patch}`;
}

packageJson.version = newVersion;
fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");

try {
  execSync("git add package.json", { stdio: "inherit" });
} catch (error) {
  console.error("Version bump failed:", error.message);
  process.exit(1);
}
