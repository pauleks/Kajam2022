const fs = require('fs/promises');
const path = require('path');

const devSpritesAssetsPath = path.join(__dirname, '..', 'assets'),
    soundAssetsPath = path.join(__dirname, '..', '..', 'assets', 'sounds'),
    loadFile = path.join(__dirname, '..', '..', 'scripts', 'loadAssets.js'),
    loadFileContent = [`// THIS FILE IS GENERATED AUTOMATICALLY`];

(async () => {
    const spriteFolders = await fs.readdir(devSpritesAssetsPath);
    console.log(spriteFolders);
    // wait for forEach to finish before starting next iteration

    let writeSpriteAssetsContent = new Promise((resolve) => {
        spriteFolders.forEach(async (folder, index, array) => {
            let animationConfiguration = require(path.join(devSpritesAssetsPath, folder, 'anim.js')),
                framesCount = (await fs.readdir(path.join(devSpritesAssetsPath, folder))).filter((f) => f.endsWith('.png')).length;

            loadFileContent.push(`loadSprite("${folder}", "/assets/sprites/${folder}.png", { sliceX: ${framesCount}, anims: ${JSON.stringify(animationConfiguration)} });`);
            if (index === array.length - 1) resolve();
        })
    });

    let writeSoundsAssetsContent = new Promise(async (resolve) => {
        let music = await fs.readdir(path.join(soundAssetsPath, 'music')),
            sfx = await fs.readdir(path.join(soundAssetsPath, 'sfx')),
            talking = await fs.readdir(path.join(soundAssetsPath, 'talking'));

        music.forEach(async (music, index, array) => {
            loadFileContent.push(`loadSound("${music.split(".")[0]}", "/assets/sounds/music/${music}");`);
            if (index === array.length - 1) sfx.forEach(async (sfx, index, array) => {
                loadFileContent.push(`loadSound("${sfx.split(".")[0]}", "/assets/sounds/sfx/${sfx}");`);
                if (index === array.length - 1) talking.forEach(async (talking, index, array) => {
                    loadFileContent.push(`loadSound("${talking.split(".")[0]}", "/assets/sounds/talking/${talking}");`);
                    if (index === array.length - 1) resolve();
                })
            })
        })

    });

    writeSpriteAssetsContent.then(() => writeSoundsAssetsContent.then(() => {
        console.log(loadFileContent);
        fs.writeFile(loadFile, loadFileContent.join('\n'));
    }));
})();
