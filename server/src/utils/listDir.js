const fs = require('fs')
exports.listDir = async function (dir) {
    let names;
    try {
        names = await fs.promises.readdir(dir);
    } catch (e) {
        console.log("e", e);
    }
    if (names === undefined) {
        return `No file found in ${dir} folder`;
    } else {
        return names;
    }
}