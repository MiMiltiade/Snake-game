window.onload   = function()            // on créer une fonction qui va se lancer au moment où la page est lancé
{
    
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;     // on définit la taille de nos blocks 
    let ctx;
    let delay = 100; // 1000ms donc 1 seconde
    let serpentin;
    let applee;
    let widhtInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
    let score;
    let timeout;

    init(); // ici on execute notre fonction init

    function init()
    {
        var canvas = document.createElement("canvas");  // ici on créer le Canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);  // ici on reli le canvas au html
        ctx = canvas.getContext("2d");  // on dresse le contexte du canvas, ici en 2dimensions
        serpentin = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();                // ici on appelle notre fonction suivante 
    }

    function refreshCanvas()
    {
        // xCoord += 5; // xCoord = xCoord+5
        // yCoord += 5; // yCoord = yCoord+5
        serpentin.advance();
        if (serpentin.checkCollision())
        {
            gameOver();
        }
        else
        {
            if (serpentin.isEatingApple(applee))
            {
                score++;
                serpentin.ateApple = true;
                do
                {
                applee.setNewPosition();
                }
                while(applee.isOnSnake(serpentin))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Ici on demande à ce qu'il supprime l'ancien dessin
            // ctx.fillStyle = "#ff0000";            // Ici on définis la couleur de ce qu'on dessine 
            // ctx.fillRect(xCoord ,yCoord, 100, 50) // x = distance horizontale, y = distance verticale (à partir du point en haut a gauche) / Les autres chiffres sont pour la largeur puis la hauteur
            drawScore();
            serpentin.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);      // permet de dire execute telle fonction à chaque fois qu'un certain delay est passé
            
        }
      
    
    }

    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyez sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function restart()
    {
        serpentin = new Snake([[6,4],[5,4],[4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();                // ici on appelle notre fonction suivante 
    }

    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);

    }

    function Snake(body, direction) // fonction constructeur du serpent / C'est le prototype de notre serpent
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save(); // on sauvegarde le contenu du serpent
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            };
            ctx.restore();  // Permet de remettre comme c'était avant
                
        };
        this.advance = function()       // fonciton pour que mon serpent avance 
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left": 
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction");
                
            }   // augmente de 1 la position
            this.body.unshift(nextPosition); 
            if(!this.ateApple)
                this.body.pop();        // supprime le dernier élément de l'array 
            else
                this.ateApple = false;
            };
        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
            case "left": 
            case "right":
                allowedDirections =["up", "down"];
                break;
            case "down":
            case "up":
                allowedDirections = ["left", "right"];
                break;
            default:
                    throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1) // ici on va chercher les Arrays juste au dessus. la valeur 
                                                             // de ces derniers est soit 0 soit 1 donc si on appuye sur l'un des deux la direction est permise
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widhtInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var IsNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var IsNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(IsNotBetweenHorizontalWalls || IsNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }

            for(var i = 0; i< rest.length ; i++ )
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
            }

            return wallCollision || snakeCollision;

        
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
            {
                return true;
            }
            else
            {
                return false;
            }
        };
    }

    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function()
        {

            var newX = Math.round(Math.random() * (widhtInBlocks - 1));            // donne une nouvelle position aléatoire a la pomme
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;

            for(var i = 0 ; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1] )
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    
    }


    document.onkeydown = function handleKeyDown(e) // fonction attaché au document qui permet de reconnaitre ce que l'utilisateur fait sur son clavier 
    {
        var key = e.keyCode; // donne le code de la touche qui a été appuyé 
        var newDirection;  // 
        switch(key)
        {
            case 37:               // chaque touche du clavier a un code 
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                    return;

        }
        serpentin.setDirection(newDirection);
    }
    
}