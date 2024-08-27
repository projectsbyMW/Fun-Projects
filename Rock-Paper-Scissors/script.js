let score = JSON.parse(localStorage.getItem('score')) 
|| {wins:0,loss:0,ties:0};

function updateScore(){
    document.querySelector('.game-stats').innerHTML = `Wins: ${score.wins} Losses: ${score.loss} Ties: ${score.ties}`;
}

updateScore();

function rps(yourmove){
    switch (yourmove){
        case 1: 
            yourmove = "Rock";
            break;
        case 2: 
            yourmove = "Paper";
            break;
        case 3: 
            yourmove = "Scissor";
            break;
    }
    const rand = Math.random()*3;
    let compMove = '';
    if (rand >0 && rand <1){compMove = 'Rock';} 
    else if (rand>1 && rand <2) {compMove = 'Paper';} 
    else {compMove = 'Scissor';}

    console.log(rand);

    console.log(compMove);

    let result = '';

    if (compMove === yourmove) 
    {
        result = 'Oops... A Tie... Try Again';
        score.ties = score.ties + 1;
    }
    else if (yourmove === 'Rock' && compMove === "Scissor") 
    {
        result = 'You win!!!.. Good Job...';
        score.wins = score.wins + 1;
    }
    else if (yourmove === 'Paper' && compMove === "Rock") 
    {
        result = 'You win!!!.. Good Job...';
        score.wins = score.wins + 1;
    } 
    else if (yourmove === 'Scissor' && compMove === "Paper") {
        result = 'You win!!!.. Good Job...';
        score.wins = score.wins + 1;
    }  
    else {
        result = 'You lost... Computer Wins.';
        score.loss = score.loss + 1;
    }

    localStorage.setItem('score',JSON.stringify(score));
    console.log(score);

    updateScore();
    document.querySelector('.game-result').innerHTML = `${result}`;
    document.querySelector('.game-moves').innerHTML = `You picked <img src= "images/${yourmove}-emoji.png" class = "icons"> \
    Computer Picked <img src= "images/${compMove}-emoji.png" class = "icons">`;
}