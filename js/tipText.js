// (C)20223 AGames Studio

function tipTextLoad() {
    var a = 0;
    var tips = ["Welcome to the Offical Battlelux Website!", "Did you know that you can buy lux directly on the website?", "@Ye was here", "Battlelux Alpha Testing coming soon!", "Yo sup Mr. Warrior", "AI rules!", "Battlelux coming soon!", "Winter 2023."] ;
    var tipText = document.getElementById("TipText");
    // There is a better solution for this but... yea this works for now.
    tipText.textContent=tips[a];
    a++;
    setInterval( function changeTipText() {
        if (a >= tips.length) {
            fadeOut(tipText);
            setTimeout(() => {
                a = 0;
                tipText.textContent=tips[a];
                fadeIn(tipText);
                a++;
            }, 800)
        }else {
            fadeOut(tipText);
            setTimeout(() => {
                tipText.textContent=tips[a];
                fadeIn(tipText);
                a++;
            }, 800)
        }
    }, 3500); 
}

function fadeOut(element) {
    var opacity = 1;
    var timer = setInterval(function () {
        if (opacity <= 0){
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        opacity -= 0.05
    }, 30);
}

function fadeIn(element) {
    var opacity = 0;
    var timer = setInterval(function () {
        if (opacity >= 1){
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        opacity += 0.05;
    }, 30);
}
