document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const moveX = (mouseX / window.innerWidth) * 30;
    const moveY = (mouseY / window.innerHeight) * 30;
    
    document.querySelector('.background').style.transform = `translate(-${moveX}px, -${moveY}px)`;
});

  (function() {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiPosition = 0;

    window.addEventListener('keydown', function(e) {
      const key = e.key.toLowerCase();

      if (key === konamiSequence[konamiPosition].toLowerCase()) {
        konamiPosition++;
        if (konamiPosition === konamiSequence.length) {
          
          window.location.href = 'ඞ'; 
        }
      } else {
        konamiPosition = 0; 
      }
    });
  })();