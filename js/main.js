// (C)2023 AGames Studio

window.onload = () => {
    var banner = document.getElementById("banner");
    var a = 0;
    var baseImgs = ["../img/HighresScreenshot00009.png","../img/image.png","../img/image3.png"];
    var imgs = shuffle(baseImgs);
    banner.style.backgroundImage="url("+imgs[a]+")";
    a++;
    tipTextLoad();
    setInterval( () => {
        if (a >= imgs.length) {
            banner.style.backgroundColor="rgba(0,0,0,1)"
            setTimeout(() => {
                // More randomizing of images :>
                imgs = shuffle(baseImgs);
                a = 0;
                banner.style.backgroundImage="url("+imgs[a]+")";
                banner.style.backgroundColor="rgba(0,0,0,0.2)";
                a++;
            }, 1100);
            
        } else {
            banner.style.backgroundColor="rgba(0,0,0,1)"
            setTimeout(() => {
                banner.style.backgroundImage="url("+imgs[a]+")";
                banner.style.backgroundColor="rgba(0,0,0,0.2)";
                a++;
            }, 1100);
        }
    }, 5000);

    // Get that good old navbar to the html page instead of copying and pasting the same navbar to 20 other html pages :>
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("navBar").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "components/navBar.html", true);
    xhttp.send();
}

window.onscroll = () => {
    var navbar = document.querySelector('nav')
    if (window.scrollY >= 25) {
        navbar.style.backgroundColor="rgba(0,0,0,0.35)"
        navbar.style.backdropFilter="blur(5px)"
    }else {
        navbar.style.backgroundColor="rgba(0,0,0,0)"
        navbar.style.backdropFilter="blur(0px)"
    }
}

function shuffle (array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor (Math.random () * currentIndex);
      currentIndex--;
      [array [currentIndex], array [randomIndex]] = [
        array [randomIndex], array [currentIndex]];
    }
    return array;
}