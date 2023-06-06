// (C)2023 AGames Studio

window.onload = function() {
    console.log("main.js Loaded!");
    var banner = document.getElementById("banner");
    var a = 0;
    var imgs = ["img0", "img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9"];
    tipTextLoad();
    setInterval( () => {
        if (a >= 10) {
            a = 0;
            console.log(imgs[a]);
            a++;
        } else {
            console.log(imgs[a]);
            a++;
        }
    }, 500);
}
