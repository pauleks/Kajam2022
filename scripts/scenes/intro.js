scene("intro", () => {
    add([
        text("ghostwolf presents", { font: "Playfair" }),
        pos(width() / 2, height() / 2),
        origin("center"),
    ])
    play("intro")
    setTimeout(() => {
        go("game");
    }, 3000);
});

