layers([
    "game",
    "transition",
    "textbackground",
    "text",
    "textreveal",
    "buttonbackground",
    "buttons",
], "game");

var STORY;
class Choice {
    constructor(text, goto) {
        this.text = text;
        this.goto = goto;
    }
}

// Fetches the story from the server
const fetchGameStory = () => new Promise(async (resolve, reject) => {
    try {
        STORY = (await (await fetch("/assets/story.txt")).text()).split('\n');
        resolve();
    } catch (err) {
        console.error(err);
        reject(err);
    }
});

const gameLogic = async () => {
    let action = removeWhitespace(STORY.shift());
    console.log(action);

    if (action == "$end") return go("end");

    if (!action.startsWith("$")) {
        let textContent, speaker;
        if (action.startsWith("{")) {
            // get text between { and }
            speaker = action.substring(1, action.indexOf("}"));
            textContent = action.substring(action.indexOf("}") + 1);
            await showDialogue(removeWhitespace(textContent), removeWhitespace(speaker));
            return gameLogic();
        }
        await showDialogue(removeWhitespace(action));
        return gameLogic();
    }

    if (action.startsWith("$spriteState")) {
        // $spriteState ExampleState
        let spriteState = action.substring(12);
        setSpriteState(removeWhitespace(spriteState));
        return gameLogic();
    }

    if (action.startsWith("$sprite")) {
        // $sprite ExampleName
        let spriteName = action.substring(7);
        await changeSprite(removeWhitespace(spriteName));
        return gameLogic();
    }

    if (action.startsWith("$sfx")) {
        // $sfw exampleSound
        let soundName = action.substring(5);
        playSoundEffect(removeWhitespace(soundName));
        return gameLogic();
    }

    if (action.startsWith("$playMusic")) {
        // $playMusic exampleMusicName
        let musicName = action.substring(action.indexOf(" ") + 1);
        playBackgroundMusic(removeWhitespace(musicName));
        return gameLogic();
    }

    if (action.startsWith("$stopMusic")) {
        // $stopMusic exampleMusicName
        let musicName = action.substring(action.indexOf(" ") + 1);
        stopBackgroundMusic(removeWhitespace(musicName));
        return gameLogic();
    }

    if (action.startsWith("$wait")) {
        document.body.classList.add("no-cursor")
        document.querySelector('#game').classList.add("no-cursor");
        return setTimeout(() => {
            document.body.classList.remove("no-cursor")
            document.querySelector('#game').classList.remove("no-cursor");
            gameLogic();
        }, removeWhitespace(action.substring(5)));
    }

    if (action.startsWith("$set")) {
        // $set exampleVariable exampleValue
        let variables = action.substring(5).split(" ");
        setVariable(removeWhitespace(variables[0]), removeWhitespace(variables[1]));
        return gameLogic();
    }

    if (action.startsWith("$if")) {
        // $if <variable> <value ot compare> | <if condition true> | <if condition false>
        // for example
        // $if milk true | #hasMilk | #noMilk
        
        let condition = action.substring(action.indexOf(" ") + 1);
        let conditionSplit = condition.split(" ");
        let variable = conditionSplit[0];
        let value = conditionSplit[1];
        let conditionTrue = conditionSplit[3];
        let conditionFalse = conditionSplit[5];
        if (compareVariables(removeWhitespace(variable), removeWhitespace(value))) {
            skipToScene(removeWhitespace(conditionTrue));
            return gameLogic();
        }
        skipToScene(removeWhitespace(conditionFalse));
        return gameLogic();
    }

    if (action.startsWith("$choice")) {
        let parts =  action.split("|");
        let firstChoice = parts[1].split("#");
        let secondChoice = parts[2].split("#");
        let choices = [new Choice(removeWhitespace(firstChoice[0]), removeWhitespace(firstChoice[1])), new Choice(removeWhitespace(secondChoice[0]), removeWhitespace(secondChoice[1]))];
        let result = await showChoices(choices[0], choices[1]);
        skipToScene(`#${result}`);
        return gameLogic();
    }

    if (action.startsWith("$goto")) {
        // $goto #exampleScene
        let sceneName = action.substring(6);
        skipToScene(removeWhitespace(sceneName));
        return gameLogic();
    }

    debug.log("Something went wrong D:");
}

scene("game", async () => {
    await fetchGameStory();
    gameLogic();
});

go("intro");