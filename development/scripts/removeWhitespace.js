/*
This script removes unnecessary whitespace from the story file.
*/

const fs = require('fs');
const path = require('path');

/**
 * Remove whitespace from the start and end of a string
 * @param {String} string the string to trim
 * @returns {String} the trimmed string
 */
const removeWhitespace = (string) => {
    return string.replace(/^\s+|\s+$/g, '');
}

fs.readFile(path.join(__dirname, `../../assets/story.txt`), (err, file) => {
    if (err) return console.error(err);

    const story = file.toString().split('\n').map(removeWhitespace).join('\n');

    fs.writeFile(path.join(__dirname, `../../assets/story.txt`), story, (err) => {
        if (err) return console.error(err);
        console.log(`Removed whitespace from story.txt`);
    }
    );
})