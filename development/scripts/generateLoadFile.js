const fs = require('fs/promises');
const path = require('path');

const devAssetsPath = path.join(__dirname, '..', 'assets'),
    loadFile = path.join(__dirname, '..', '..', 'scripts', 'loadAssets.js'),
    loadFileContent = [`// THIS FILE IS GENERATED AUTOMATICALLY`];

(async () => {
    const folders = await fs.readdir(devAssetsPath);
    console.log(folders);
    // wait for forEach to finish before starting next iteration

    var bar = new Promise((resolve, reject) => {
        folders.forEach(async (folder, index, array) => {
            let animationConfiguration = require(path.join(devAssetsPath, folder, 'anim.js')),
                framesCount = (await fs.readdir(path.join(devAssetsPath, folder))).filter((f) => f.endsWith('.png')).length;

            loadFileContent.push(`loadSprite("${folder}", "/assets/sprites/${folder}.png", { sliceX: ${framesCount}, anims: ${JSON.stringify(animationConfiguration)} });`);
            if (index === array.length - 1) resolve();
        })
    });

    bar.then(() => {
        console.log(loadFileContent);
        fs.writeFile(loadFile, loadFileContent.join('\n'));
    });
})();
