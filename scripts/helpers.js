// === VISUAL STUFF === //

var backgroundSpriteObject,
    textObject,
    _textConfiguration = {
        font: "Playfair",
        styles: {
            "shake": () => ({
                pos: vec2(wave(-1, 1, time() * 135), wave(-1, 1, time() * 75))
            }),
            "red": {
                color: rgb(255, 0, 0),
            },
            "talking": {
                color: rgb(128, 128, 255),
            },
        },
    };

/**
 * change visible sprite
 * @param {string} newSpriteSource the source of the new sprite
 * @param {string} spriteObject the state of the new sprite 
 */
const changeSprite = (newSpriteSource) => {
    if (backgroundSpriteObject && backgroundSpriteObject.destroy) backgroundSpriteObject.destroy();
    backgroundSpriteObject = add([
        pos(0, 0),
        sprite(newSpriteSource, {
            anim: "idle",
            width: Constants.canvas.width,
            height: Constants.canvas.height,
        }),
        z(1)
    ])

    console.log(backgroundSpriteObject)
}

/**
 * Sets sprite to a given state
 * @param {*} state the state to set the sprite to
 */
const setSpriteState = (state) => {
    spriteObject.play(state);
}

/**
 * Display a dialogue box
 * @param {String} t the text to display
 * @param {String} speaker the speaker of the text if there is one
 * @returns {Promise} a promise that resolves when the dialogue is finished
 */
const showDialogue = (t, speaker) => new Promise(async (resolve) => {
    if (t == '') return document.body.onclick = resolve;
    textObject = add([
        text(t, { ..._textConfiguration, width: width() }),
        layer("text"),
        color(255, 255, 255),
        pos(0, height()),
        z(3)
    ])

    textObject.pos = vec2(0, height() - textObject.height);

    let textBackground = add([
        rect(width(), textObject.height),
        pos(0, height() - textObject.height),
        z(2),
        color(0, 0, 0)
    ]);

    document.body.onclick = null;
    await revealDialogue(textObject.height);
    document.body.onclick = () => {
        disableDialogue();
        textBackground.destroy();
        resolve();
    }
});

/**
 * Destroys the text object
 */
const disableDialogue = () => {
    if (textObject.destroy) textObject.destroy();
} 

/**
 * Reveals the dialogue
 * @warning This function should only be used in the showDialogue function
 * @param {*} h the height of the dialogue
 */
const revealDialogue = (h) => new Promise((resolve) => {
    let rowCount = Math.ceil(h / Constants.font.grid.height);
    
    for (let i = 0; i < rowCount; i++) {
        let text = add([
            rect(width() * (i + 1), Constants.font.grid.height),
            pos(width() - (width() * (i + 1)), height() - h + (i * Constants.font.grid.height)),
            color(0, 0, 0),
            "textreveal",
            layer("textreveal"),
            z(4),
            move(RIGHT, Constants.TEXT_REVEAL_SPEED)
        ])
    }

    onUpdate("textreveal", (text) => {
        if (text.pos.x > width()) {
            destroy(text)
            rowCount--;
            if (rowCount <= 0) {
                resolve()
            }
        }
    })
})

/**
 * Show choices to the player
 * @param {*} firstChoice the first choice to show
 * @param {*} secondChoice the second choice to show
 * @returns {Promise} a promise that resolves when the player makes a choice
 */
const showChoices = (firstChoice, secondChoice) => new Promise((resolve) => {
    const showButton = (t, id, p, c) => {
        add([
            text(t, _textConfiguration),
            layer("buttons"),
            pos(p),
            area(),
            outline(10, RED),
            id,
            "selection",
            z(8)
        ])

        onClick(id, c);
    }

    showButton(firstChoice.text, "firstChoice", vec2(Constants.font.size, height() / 2 - Constants.font.size), () => resolve(firstChoice.goto));
    showButton(secondChoice.text, "secondChoice", vec2(Constants.font.size, height() / 2 + Constants.font.size), () => resolve(secondChoice.goto));
    let buttonsBackground = add([
        rect(width(), height()),
        layer("buttonbackground"),
        color(0, 0, 0),
        opacity(0.3),
        z(7)
    ])

    onClick("selection", () => {
        let buttons = get("selection");
        buttons.forEach((el) => el.destroy());
        buttonsBackground.destroy();
    });
});

// === AUDIO STUFF === //

/**
 * Play the specified sound effect
 * @param {*} soundEffect the sound effect to play
 */
const playSoundEffect = (soundEffect) => {
    play(soundEffect);
}

const playedBackgroundMusic = new Map();

/**
 * Start playing the specified background music
 * @param {*} newMusic the background music to play
 */
const playBackgroundMusic = (newMusic) => {
    if (playedBackgroundMusic.has(newMusic)) return;
    play(newMusic);
    playedBackgroundMusic.set(newMusic, true);
}

/**
 * Stop playing the specified background music
 * @param {String} musicToStop the background music to stop
 */
const stopBackgroundMusic = (musicToStop) => {
    if (playedBackgroundMusic.has(musicToStop)) {
        stop(musicToStop);
        playedBackgroundMusic.delete(musicToStop);
    }
}

const variablesMap = new Map();

/**
 * Sets a variable to a given value
 * @param {String} variable the name of the variable to set
 * @param {*} value the value to set the variable to
 */
const setVariable = (variable, value) => {
    console.log(variable, value)
    variablesMap.set(variable, value);
};

/**
 * Check if the variable is set to a certain value
 * @param {String} variable the variable to check
 * @param {String} value the value to check the variable against
 * @returns {Boolean} true if the variable is set to the value, false otherwise
 */
const compareVariables = (variable, value) => {
    return variablesMap.get(variable) == value;
}

/**
 * Skips to the specified scene
 * @param {*} requiredScene the scene to skip to
 */
const skipToScene = (requiredScene) => {
    while (STORY.length > 0) {
        if (STORY[0] == requiredScene) {
            STORY.shift();
            break;
        }
        STORY.shift();
    }
}

/**
 * Remove whitespace from the start and end of a string
 * @param {String} string the string to trim
 * @returns {String} the trimmed string
 */
const removeWhitespace = (string) => {
    return string.replace(/^\s+|\s+$/g, '');
}