var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var score = 0;
  
var snake = {
  x: 160,
  y: 160,
  
  // vitesse du serpent. déplace une longueur de grille à chaque image dans la direction x ou 
  dx: grid,
  dy: 0,
  
  // garder une trace de toutes les grilles occupées par le corps du serpent
  cells: [],
  
  // longueur du serpent. grandit en mangeant une pomme
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// obtenir des nombres entiers aléatoires dans une plage spécifique
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// boucle de jeu
function loop() {
  requestAnimationFrame(loop);

  // boucle de jeu lente à 15 fps au lieu de 60 (60/15 = 4)
  if (++count < 5) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // déplacer le serpent par sa vitesse
  snake.x += snake.dx;
  snake.y += snake.dy;

  // envelopper la position du serpent horizontalement sur le bord de l'écran
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // envelopper la position du serpent verticalement sur le bord de l'écran
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // garder une trace de l'endroit où le serpent a été. l'avant du tableau est toujours la tête
  snake.cells.unshift({x: snake.x, y: snake.y});

  // supprimer les cellules à mesure que nous nous en éloignons
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // dessiner la pomme
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // dessiner snake une cellule à la fois
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    // dessiner 1 px plus petit que la grille crée un effet de grille dans le corps du serpent afin que vous puissiez voir sa longueur
    context.fillRect(cell.x, cell.y, grid-0, grid-0);  

    // le serpent a mangé une pomme
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      document.getElementById("mytext").innerHTML = score;

      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // vérifier la collision avec toutes les cellules après celle-ci (tri à bulles modifié)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // le serpent occupe le même espace qu'une partie du corps. réinitialiser le jeu
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        var audio = new Audio('explosions.mp3');
        audio.play();
        score=0;
        document.getElementById("mytext").innerHTML = score;
        document.getElementById("mort").innerHTML = "vous avez mange:"; 

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  // empêcher le serpent de revenir sur lui-même en vérifiant qu'il est
  // ne se déplaçant pas déjà sur le même axe (appuyer à gauche tout en se déplaçant
  // la gauche ne fera rien, et appuyer sur la droite tout en se déplaçant vers la gauche
  // ne devrait pas vous laisser entrer en collision avec votre propre corps)
  
  // flèche gauche
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // flèche vers le haut
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // flèche droite
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // flèche vers le bas
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// demarrer le jeu
requestAnimationFrame(loop);