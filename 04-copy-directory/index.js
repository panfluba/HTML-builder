const fs = require('fs');
const path = require("path");
const { mkdir, readdir, rm, copyFile } = require("fs/promises");
const initFolder = path.join(__dirname, "files");
const copiedFolder = path.join(__dirname, "files-copy");

async function copyFolder() {
  await rm(copiedFolder, { recursive: true, force: true });
  await mkdir(copiedFolder, { recursive: true });

  try {
    let files = await readdir(initFolder, { withFileTypes: true });
    for (let file of files) {
      await copyFile(
        path.join(initFolder, file.name),
        path.join(copiedFolder, file.name)
      );
    }
    console.log("Копия папки создана.");
  } catch (err) {
    console.error(err);
  }
}

copyFolder();
