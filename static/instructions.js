document.addEventListener('DOMContentLoaded', function() {
    const flipCard = document.getElementById('flipCard');
    const flipToBack = document.getElementById('flipToBack');
    const flipToFront = document.getElementById('flipToFront');
    
    // Переворот на заднюю сторону
    flipToBack.addEventListener('click', function(e) {
        e.stopPropagation();
        flipCard.classList.add('flipped');
    });
    
    // Возврат на переднюю сторону
    flipToFront.addEventListener('click', function(e) {
        e.stopPropagation();
        flipCard.classList.remove('flipped');
    });
});
