// === VISUAL STUFF === //

/**
 * change visible sprite
 * @param {string} newSprite update sprite to a new one 
 */
const changeSprite = (newSprite) => {
    // has canvas transition - screen becomes black and then appears again
}

const playSoundEffect = (soundEffect) => {

}

const showDialogue = () => {

}

const revealDialogue = (rowCount) => {

}

const showChoices = () => {

}

// === AUDIO STUFF === //

const playedBackgroundMusic = new Map();

const playBackgroundMusic = (newMusic) => {

}

const stopBackgroundMusic = (musicToStop) => {

}

// === OTHER STUFF === //
/**
 * Waits a given amount of time and then continues
 * @param {Number} ms the amount of time to wait in milliseconds
 * @returns {Promise} a promise that resolves after the given amount of time
 */
const waitFunction = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const variablesMap = new Map();

/**
 * Sets a variable to a given value
 * @param {String} variable the name of the variable to set
 * @param {*} value the value to set the variable to
 */
const setVariable = (variable, value) => {
    variablesMap.set(variable, value);
};

/**
 * Gets the value of a variable
 * @param {String} variable the name of the variable to get
 * @returns {*} the value of the variable
 */
const getVariable = (variable) => {
    return variablesMap.get(variable);
}

const compareVariables = (variable, value) => {
    return variablesMap.get(variable) == value;
}

const skipToScene = (scene) => {
    
}

/**
 * Remove whitespace from the start and end of a string
 * @param {String} string the string to trim
 * @returns {String} the trimmed string
 */
const removeWhitespace = (string) => {
    return string.replace(/^\s+|\s+$/g, '');
}