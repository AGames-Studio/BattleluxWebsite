// (C)20223 AGames Studio

function tipTextLoad() {
    var a = 0;
    var tips = [];
    var tipText = document.getElementById("TipText");
    console.log("Yay it works!");
    setInterval( function changeTipText() {
        console.log("chec");
        tipText.textContent="Interval="+a;
        a++
    }, 1000); 
}
