document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const moveX = (mouseX / window.innerWidth) * 30;
    const moveY = (mouseY / window.innerHeight) * 30;
    
    document.querySelector('.background').style.transform = `translate(-${moveX}px, -${moveY}px)`;
});
