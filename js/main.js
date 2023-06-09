// (C)2023 AGames Studio

window.onload = () => {
    var banner = document.getElementById("banner");
    var a = 0;
    var imgs = ["img0", "img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9"];
    tipTextLoad();
    setInterval( () => {
        if (a >= imgs.length) {
            a = 0;
            // Set background image
            a++;
        } else {
            // Set background image
            a++;
        }
    }, 1000);

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