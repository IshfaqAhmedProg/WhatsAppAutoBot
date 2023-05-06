const fs = require("fs");
const resourceHacker = require("node-resourcehacker");
const execSync = require("child_process").execSync;

const customIconPath = "whatsappautobot.ico";
const resourceHackerPath = "resource_hacker.zip"; //This file must exist, if not download it at http://www.angusj.com/resourcehacker/resource_hacker.zip
const originalPkgPrecompiledBinaries =
    "C:/Users/mansl/.pkg-cache/v3.4/fetched-v18.5.0-win-x64.original";
const customizedPkgPrecompiledBinaries =
    "C:/Users/mansl/.pkg-cache/v3.4/fetched-v18.5.0-win-x64";

process.env["SOURCE_RESOURCE_HACKER"] = resourceHackerPath;

console.log("Download pkg precompiled libraries");
downloadOriginalPkgPrecompiledBinaries();
console.log("Customize pkg precompiled libraries");
customizePkgPrecompiledBinaries();
console.log("Build customized executables");
buildCustomizedExecutables();
console.log("Done");

function downloadOriginalPkgPrecompiledBinaries() {
    if (!fs.existsSync(originalPkgPrecompiledBinaries)) {
        executePkg("temp.exe");
        //Add .original extension
        fs.renameSync(
            customizedPkgPrecompiledBinaries,
            originalPkgPrecompiledBinaries
        );
        //Remove temp.exe
        fs.unlinkSync("temp.exe");
    }
}

function customizePkgPrecompiledBinaries() {
    resourceHacker(
        {
            operation: "addoverwrite",
            input: "C:/Users/mansl/.pkg-cache/v3.4/fetched-v18.5.0-win-x64",
            output: "C:/Users/mansl/.pkg-cache/v3.4/fetched-v18.5.0-win-x64",
            resource: customIconPath,
            resourceType: "ICONGROUP",
            resourceName: "1"
        },
        err => {
            if (err) {
                return console.error(err);
            }
        }
    );
}

function buildCustomizedExecutables() {
    executePkg("whatsappcheck.exe");
}

function executePkg(exeName) {
    execSync(
        "npm run PKG_CACHE_PATH=./pkg-cache pkg index.js --target win --output " +
        exeName
    );
}