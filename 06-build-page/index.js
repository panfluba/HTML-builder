const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'project-dist');
const output = fs.createWriteStream(path.join(dir, 'index.html'));

const findFiles = async () => {
    const array = [];
    const data = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    for (const file of data) {
        const namePath = path.join(__dirname, 'components', file.name);
        const name = path.basename(namePath, path.extname(namePath));
        array.push(name);
    }
    return array;
}

const buildHtml = async () => {
    const makeDir = await fs.promises.mkdir(dir, { recursive: true });
    let template = (await fs.promises.readFile(path.join(__dirname, "template.html"))).toString();
    const components = (await findFiles());
    for (component of components) {
        const componentContent = (await fs.promises.readFile(path.join(__dirname, 'components', `${component}.html`))).toString();
        template = template.replace(`{{${component}}}`, componentContent);
    }
    output.write(template);
}

const outputStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

const bundleStyles = async () => {
    const dirPath = path.join(__dirname, 'styles');
    const data = await fs.promises.readdir(dirPath);
    const stylesArray = [];
    for (file of data) {
        if (path.extname(file) == '.css') {
            const content = (await fs.promises.readFile(path.join(dirPath, file))).toString();
            stylesArray.push(content);
        }
    }
    outputStyles.write(stylesArray.join(''));
}

const assetsOrigin = path.join(__dirname, 'assets');
const assetsCopy = path.join(__dirname, 'project-dist', 'assets');
const copyFolder = async (origin, copy) => {
    let pathCopy = copy;
    let pathOrigin = origin;
    await fs.promises.rm(pathCopy, { recursive: true, force: true });
    const makeDir = await fs.promises.mkdir(pathCopy, { recursive: true });
    const data = await fs.promises.readdir(pathOrigin, { withFileTypes: true });
    for (file of data) {
        if (file.isFile()) {
            fs.promises.copyFile(path.join(pathOrigin, file.name), path.join(pathCopy, file.name));
        }
        else {
            const deepPathCopy = path.join(pathCopy, file.name);
            const deepPathOrigin = path.join(pathOrigin, file.name);
            const makeDir = await fs.promises.mkdir(deepPathCopy, { recursive: true });
            copyFolder(deepPathOrigin, deepPathCopy);
        }
    }
}
buildHtml()
bundleStyles()
copyFolder(assetsOrigin, assetsCopy)