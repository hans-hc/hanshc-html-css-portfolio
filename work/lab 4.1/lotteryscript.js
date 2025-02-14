function lottery_ball() {
    if (Math.random()>0.5) {
        this.color = 'red';
    } else {
        this.color = 'white';
    }

    this.points = Math.floor(Math.random()*100);
}


let lottery_box = [];

for (let i = 0; i  < 100; i++) {
    lottery_box[i] = new lottery_ball();
}

const dialog = document.querySelector("dialog");
dialog.showModal();

let score = 0;

let already_drew = [];

function submit_guess() {
    let guess = document.getElementById('input').value;

    if ((guess < 0) || (guess > 99) || (already_drew.includes(guess))) {
        alert(`That number is not valid, try again with a ball that is between 0 and 99 and not one that you have already picked (${already_drew})`)
    } else {

        alert(`This lottery ball is ${lottery_box[guess].color} and is worth ${lottery_box[guess].points} points.`);

        if (lottery_box[guess].color == 'red') {
            score -= lottery_box[guess].points;
            document.getElementById('score').innerHTML = score;

            endGame()
        } else {
            score += lottery_box[guess].points;
            document.getElementById('score').innerHTML = score;
            already_drew.push(guess);
        }
    }
}

function endGame() {
    const dialog = document.querySelector("dialog");

    document.getElementById("goodbye").style.visibility = 'visible';
    dialog.close();
    alert(`You finished with ${score} points!`)
}