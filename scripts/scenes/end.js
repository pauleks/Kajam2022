scene("end", () => {
    add([
        text("satan's pepper", { font: "Playfair" }),
        pos(width() / 2, height() / 2),
        origin("center"),
    ])

    play("outro")

    setTimeout(() => {
        //redirect to /thankyou.html
        window.location.href = "/thankyou.html";
    }, 10000);
});