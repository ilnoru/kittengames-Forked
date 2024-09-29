document.addEventListener('DOMContentLoaded', function() {
  const gamesContainer = document.getElementById('games-container');

  function loadGames() {
    gamesContainer.innerHTML = '';

    fetch('https://raw.githubusercontent.com/CodingKitten-YT/KittenGames-gamelibrary/main/games.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(game => {
          const gameCard = document.createElement('div');
          gameCard.classList.add('game-card');

          const link = document.createElement('a');
          link.href = game.newtab ? game.url : `play.html?game=${btoa(game.name)}`;
          if (game.newtab) {
            link.target = '_blank';
          }

          const img = document.createElement('img');
          img.src = game.image;
          link.appendChild(img);

          const gameInfo = document.createElement('div');
          gameInfo.classList.add('game-info');

          const name = document.createElement('h2');
          name.textContent = game.name;
          gameInfo.appendChild(name);

          link.appendChild(gameInfo);
          gameCard.appendChild(link);

          gamesContainer.appendChild(gameCard);
        });
      })
      .catch(error => console.error('Error fetching games:', error));
  }

  loadGames();
});
