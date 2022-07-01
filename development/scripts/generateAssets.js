const { joinImages } = require('join-images');
const fs = require('fs/promises');
const path = require('path');

const devAssetsPath = path.join(__dirname, '..', 'assets'),
    assetsDestination = path.join(__dirname, '..', '..', 'assets', 'sprites');

(async () => {
    let folders = await fs.readdir(devAssetsPath);

    folders.forEach(async (folder) => {
        let files = (await fs.readdir(path.join(devAssetsPath, folder))).filter((f) => f.endsWith('.png')).map((f) => path.join(devAssetsPath, folder, f));
        console.log(files);
        let image = await joinImages(files, { direction: 'horizontal' });
        image.toFile(path.join(assetsDestination, `${folder}.png`));
    });
})();