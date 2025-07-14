document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const moveX = (mouseX / window.innerWidth) * 30;
    const moveY = (mouseY / window.innerHeight) * 30;

    document.querySelector('.background').style.transform = `translate(-${moveX}px, -${moveY}px)`;
});

(function () {
    const konamiSequence = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiPosition = 0;
    const secretSequence = ['s', 'e', 'c', 'r', 'e', 't'];
    let secretPosition = 0;

    window.addEventListener('keydown', function (e) {
        const key = e.key.toLowerCase();


        if (key === konamiSequence[konamiPosition].toLowerCase()) {
            konamiPosition++;
            if (konamiPosition === konamiSequence.length) {
                alert("Konami Code activated! Redirecting...");
                window.location.href = 'ඞ';
            }
        } else {
            konamiPosition = 0;
        }


        if (key === secretSequence[secretPosition]) {
            secretPosition++;
            if (secretPosition === secretSequence.length) {
                // Request fullscreen before redirect
                const elem = document.documentElement;

                function goFullscreenAndRedirect() {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen().then(() => {
                            window.location.href = 'las.html';
                        }).catch(() => {
                            // If fullscreen fails, redirect anyway
                            window.location.href = 'las.html';
                        });
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                        window.location.href = 'las.html';
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                        window.location.href = 'las.html';
                    } else {
                        // No fullscreen API, just redirect
                        window.location.href = 'las.html';
                    }
                }

                goFullscreenAndRedirect();
            }
        } else {
            secretPosition = 0;
}});
})();