// === VISUAL STUFF === //

var backgroundSpriteObject,
    textObject,
    _textConfiguration = {
        font: "Playfair",
        size: Constants.font.size,
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
const changeSprite = (newSpriteSource) => new Promise((resolve) => {
    let o = 0, overlay = add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0),
        pos(0, 0),
        z(10),
    ]);

    let firstInterval = setInterval(() => {
        o += 0.25;
        overlay.opacity = o;

        if (o >= 1) {
            clearInterval(firstInterval);
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
            
            let secondInterval = setInterval(() => {
                o -= 0.25;
                overlay.opacity = o;

                if (o <= 0) {
                    clearInterval(secondInterval);
                    overlay.destroy();
                    resolve();
                }
            }, 150)
        }
    }, 150);
})

/**
 * Sets sprite to a given state
 * @param {*} state the state to set the sprite to
 */
const setSpriteState = (state) => {
    backgroundSpriteObject.play(state);
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
    document.body.classList.add("no-cursor")
    document.querySelector('#game').classList.add("no-cursor");
    await revealDialogue(textObject.height);
    document.body.classList.remove("no-cursor");
    document.querySelector('#game').classList.remove("no-cursor");
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
    let rowCount = Math.ceil(h / Constants.font.size);

    for (let i = 0; i < rowCount; i++) {
        let text = add([
            rect(width() * (i + 1), Constants.font.size),
            pos(width() - (width() * (i + 1)), height() - h + (i * Constants.font.size)),
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
    let selectedButtonBackground;

    const showButton = (t, id, p, c) => {
        let button = add([
            text(t, _textConfiguration),
            layer("buttons"),
            pos(p),
            area(),
            id,
            "selection",
            z(8),
        ])

        onClick(id, c);
        onHover(id, (el) => {
            if (selectedButtonBackground) selectedButtonBackground.destroy();
            if (el.isHovering()) selectedButtonBackground = add([
                rect(el.width + 16, el.height + 16),
                pos(el.pos.x - 8, el.pos.y - 8),
                color(BLUE),
                z(6),
                "buttonbackground"
            ])
        })

        return button;
    }

    let firstButton = showButton(firstChoice.text, "firstChoice", vec2(Constants.font.size, height() / 2 - Constants.font.size), () => resolve(firstChoice.goto));
    let secondButton = showButton(secondChoice.text, "secondChoice", vec2(Constants.font.size, height() / 2 + Constants.font.size), () => resolve(secondChoice.goto));
    let firstButtonBackground = add([
        rect(firstButton.width, firstButton.height),
        layer("buttonbackground"),
        color(0, 0, 0),
        opacity(7),
        z(7),
        area(),
        pos(firstButton.pos),
        "buttonbackground",
    ]);
    let secondButtonBackground = add([
        rect(secondButton.width, secondButton.height),
        layer("buttonbackground"),
        color(0, 0, 0),
        opacity(7),
        z(7),
        area(),
        pos(secondButton.pos),
        "buttonbackground",
    ]);

    onClick("selection", () => {
        let buttons = get("selection"), buttonBackgrounds = get("buttonbackground");
        buttons.forEach((el) => el.destroy());
        buttonBackgrounds.forEach((el) => el.destroy());
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