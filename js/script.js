document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    // Comportement de la barre de recherche
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query) {
                console.log(`Recherche de : ${query}`);
                // Ici, vous pourriez ajouter une redirection
                // window.location.href = `https://www.google.com/search?q=${query}`;
            }
        }
    });

    // Comportement des liens de navigation (simule le changement de page)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Empêche la page de se recharger
            e.preventDefault();

            // Enlève la classe 'active' de tous les liens
            navLinks.forEach(item => item.classList.remove('active'));

            // Ajoute la classe 'active' au lien cliqué
            link.classList.add('active');

            // Affiche dans la console la navigation
            console.log(`Navigué vers : ${link.textContent}`);
        });
    });
});
