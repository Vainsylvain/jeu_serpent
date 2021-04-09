window.onload = function()
{
    var canvasWidth = 900;
    var canvasHeight = 300;
    var blockSize = 15;
    var contexte;
    var delay = 65;
    var serpent;
    var pomme;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var nombrePommeMange = 0;
    var timeOut;
    var difficulte;
    var delay_difficulte;
    var couleurPomme;

    init();

    function init()
    {
        var canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "15px solid green";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        contexte = canvas.getContext("2d");
        var difficulte = prompt("A quel niveau de difficulté souhaitez-vous jouer ? \nLa difficulté augmentera légèrement toutes les 10 pommes mangées... \n0 : facile\n1 : normal\n2 : difficile", "<Entrez 0, 1 ou 2 ici pour choisir la difficulté>");
        switch(difficulte){
            case "0":
                delay = 70;
                delay_difficulte = delay;
                break;
            case "1":
                delay = 40;
                delay_difficulte = delay;
                break;
            case "2":
                delay = 30;
                delay_difficulte = delay;
                break;    
            default:
                delay = 40;
                delay_difficulte = delay;
                alert("Vous n'avez pas choisi de niveau de difficulté → difficulté normale activée");
        }
        serpent = new Snake([[2,0], [1,0], [0,0]],"droite"); 
        pomme = new Pomme([10, 10]);   
        refreshCanvas();
    }

    function refreshCanvas()
    {
        serpent.avance();

        if(serpent.verifieCollision())
        {

            gameOver();

        }
        else
        {
                if(serpent.mangePomme(pomme))
            {
                serpent.aMangePomme = true;
                do
                {
                    pomme.donnerNouvellePosition();
                }
                while(pomme.estSurSerpent(serpent))
                
            }
// color:#f00606;
// color:#0687f0;
// color:#1606f0;
// color:#5c06ad;
// color:#b870fc;

                contexte.clearRect(0, 0, canvasWidth, canvasHeight);
                serpent.draw();
                if(nombrePommeMange >= 40){
                    couleurPomme = "#b870fc";
                } else if (nombrePommeMange >= 30){
                    couleurPomme = "#5c06ad";
                } else if (nombrePommeMange >= 20){
                    couleurPomme = "#1606f0";
                } else if (nombrePommeMange >= 10){
                    couleurPomme = "#0687f0";
                } else if (nombrePommeMange >= 0){
                couleurPomme = "#f00606";
                }
                pomme.draw();
                score();
                timeOut = setTimeout(refreshCanvas,  delay);
        }

    function gameOver()
    {
        contexte.save();
        contexte.font = "60px serif"; 
        contexte.fillText("Game Over", canvasWidth/2-canvasWidth/7, canvasHeight/2.5);
        contexte.font = "40px serif";
        if(nombrePommeMange >= 20)
        {
            contexte.fillText("Vous avez réussi à manger " + nombrePommeMange + " pommes avant de mourir !", 10, canvasHeight/1.5);
            contexte.font = "45px serif";
            contexte.fillText("  BRAVO !!!", canvasWidth/2-canvasWidth/8, canvasHeight/1.1);
        }
        else
        {
            contexte.fillText("Vous avez réussi à manger " + nombrePommeMange + " pommes avant de mourir !", 10, canvasHeight/1.5);
            contexte.font = "20px serif";
            contexte.fillText("Appuyer sur la barre d'espace pour recommencer", canvasWidth/3.5 , canvasHeight/1.1);
        }
        contexte.restore();
    }



    function score()
    {
        contexte.save();
        contexte.font = "20px serif";
        contexte.fillText("Score : " + nombrePommeMange.toString(), 5 , canvasHeight-5);
        contexte.restore();
    }
    
    }

    function drawBlock(contexte, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        contexte.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.aMangePomme = false;
        this.draw = function()  
        {
            contexte.save();
            contexte.fillStyle = "#17b302";
            for(var i = 0; i < this.body.length; i ++)
            {
                drawBlock(contexte, this.body[i]);
            }
            contexte.restore();
        };
        this.avance = function ()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "gauche":
                    nextPosition[0] -= 1;
                    break;
                case "droite":
                    nextPosition[0] += 1;
                    break;
                case "haut":
                    nextPosition[1] -=1;
                    break;
                case "bas":
                    nextPosition[1] +=1;
                    break;
                default:
                    throw("Direction invalide");
            }
            this.body.unshift(nextPosition);
            if(!this.aMangePomme)
            {
            this.body.pop();
            }
            else
                this.aMangePomme = false;
        };
        this.setDirection= function(newDirection)
        {
            var allowedDirections;

            switch(this.direction)
            {
                case "gauche":
                    allowedDirections = ["haut", "bas"];                   
                case "droite":
                    allowedDirections = ["haut", "bas"];
                    break;
                case "haut":
                    allowedDirections = ["gauche", "droite"];
                    break;
                case "bas":
                    allowedDirections = ["gauche", "droite"];
                    break;
                default:
                    throw("Direction invalide");
            }
            if (allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };
        this.verifieCollision = function()
        {
            var collisionMur = false;
            var collisionSeprent = false;
            var tete = this.body[0];
            var rest = this.body.slice(1);
            var serpentX = tete[0];
            var serpentY = tete[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks-1;
            var maxY = heightInBlocks-1;
            var isNotBetweenHorizontalWalls = serpentX < minX || serpentX > maxX;
            var isNotBetweenVerticalWalls = serpentY < minY || serpentY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                collisionMur = true;
            }

            for(var i = 0; i < rest.length; i++)
            {
                if(serpentX === rest[i][0] && serpentY === rest[i][1] )
                {
                    collisionSeprent = true;
                }
            }
            return collisionSeprent || collisionMur;
        };
        this.mangePomme = function(pommeAManger)
        {

            
            var head = this.body[0];
            if(head[0] === pommeAManger.position[0] && head[1] === pommeAManger.position[1])
                {
                    nombrePommeMange ++;
                    switch(nombrePommeMange){
                        case 10:
                            delay -= 5;
                            break;
                        case 20:
                            delay -=6;
                            break;
                        case 30:
                            delay -=7;
                            break;
                        case 40:
                            delay -=8;
                            break;
                    }
                    return true;
                }
            else
                return false;

        }
    }

    function Pomme(position)
    {
        this.position = position;
        this.draw = function()
        {
            contexte.save();
            contexte.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            contexte.arc(x, y, radius, 0, Math.PI*2, true);
            contexte.fillStyle = couleurPomme
            contexte.fill();
            contexte.restore();
        };

        this.donnerNouvellePosition = function ()
        {
            var nouveauX = Math.round(Math.random() * (widthInBlocks -1));
            var nouveauY = Math.round(Math.random() * (heightInBlocks -1));
            this.position = [nouveauX, nouveauY];
        };
        
        this.estSurSerpent = function(serpentAVerifier)
        {
            var estSurSerpent = false;
            for(var i = 0; i < serpentAVerifier.body.lenght; i++ )
            {
                if(this.position[0] === serpentAVerifier.body[i][0] && this.position[1] === serpentAVerifier.body[i][1])
                {
                    estSurSerpent = true;
                }
            }
            return estSurSerpent;

        };
    
}
        function newGame()
        {
            serpent = new Snake([[2,0], [1,0], [0,0]],"droite"); 
            pomme = new Pomme([10, 10]);
            nombrePommeMange = 0;
            clearTimeout(timeOut);
            delay = delay_difficulte
            refreshCanvas();
        }

        document.onkeydown = function handleKeydown(e)
        {
            var key = e.keyCode;
            var newDirection;
            switch(key)
            {
                case 37:
                    newDirection = "gauche";
                    break;
                case 38:
                    newDirection = "haut";
                    break;
                case 39:
                    newDirection = "droite";
                    break; 
                case 40:
                    newDirection = "bas";
                    break;
                case 32:
                    newGame();
                    return;
                default:
                    return;
            }
            serpent.setDirection(newDirection);
        }
    }