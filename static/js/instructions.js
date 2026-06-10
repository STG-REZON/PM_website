document.addEventListener('DOMContentLoaded', function() {
    const photoCards = document.querySelectorAll('.photo-card');
    
    photoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('flipped');
        });
        card.style.cursor = 'pointer';
    });
    
    console.log('Instructions ready — full text distributed across 6 stages');
});