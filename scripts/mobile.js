function mobile() {
    var bars = document.getElementById("mnav");
    if(bars.className === "mnav") {
        bars.className += "responsive";
    }else {
        bars.className = "mnav";
    }
}