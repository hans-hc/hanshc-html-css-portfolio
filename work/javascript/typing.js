document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    const gameScreen = document.getElementById("game-screen");
    const startButton = document.getElementById("start-game");
    const usernameInput = document.getElementById("username");
    const colorPicker = document.getElementById("fav-color");
    const userDisplay = document.getElementById("user-display");
    const userInput = document.getElementById("user-input");
    const textToTypeElement = document.getElementById("text-to-type");
    const timeElement = document.getElementById("time");
    const wpmElement = document.getElementById("wpm");
    const resultMessage = document.getElementById("result-message");
    const roundIndicator = document.getElementById("round-indicator");
    const restartButton = document.getElementById("restart");
    const helpButton = document.getElementById("help");
    const helpText = document.getElementById("help-text");
    const nextRoundButton = document.getElementById("next-round");

    let selectedText = ""; //Store current text user is typing
    let startTime = null; //Store start time for test
    let interval = null;
    let typedText = "";
    let currentRound = 1; //first round starts at 1
    let wpmScores = [];

    //TOTAL ROUNDS
    const totalRounds = 3;

    //WORD POOL
    const wordList = 'ketchup mustard in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');

    //Generates a random string of words:
    //Creates an array with specific wordCount, calls function.
    //Generates random floating point number between 0 and length of wordList -1
    //Rounds down to an integer
    //Converts the array of words to a single string
    function generateRandomText(wordCount) {
        return Array.from({ length: wordCount }, () => wordList[Math.floor(Math.random() * wordList.length)]).join(" ");
    }

    //Update round indicator text
    function updateRoundIndicator() {
        roundIndicator.textContent = `Round ${currentRound} of ${totalRounds}`;
    }

    //START GAME FUNCTION
    //Initializes a new round:
    //Generate new text to type
    //Reset timer
    //Clear input
    function startGame() {
        //Based on round, increase word count from 25->35->45
        const wordCounts = [25, 35, 45];
        let wordCount = wordCounts[currentRound - 1]; // Uses 0-based index
        selectedText = generateRandomText(wordCount);
        textToTypeElement.textContent = selectedText;

        //Reset input box and UI stuff
        userInput.value = "";
        timeElement.textContent = "0";
        wpmElement.textContent = "0";
        resultMessage.textContent = "";
        startTime = null;
        clearInterval(interval);

        //Update UI for new round
        updateRoundIndicator();
        nextRoundButton.classList.add("hidden"); //Hide "Next Round" button
        userInput.disabled = false; //Allow typing
    }

    //CHECKS USER INPUT
    userInput.addEventListener("input", () => {
        //Start timer as soon as user starts typing
        if (!startTime) {
            startTime = Date.now();
            interval = setInterval(updateTime, 1000);
        }
        //Checks if user text matches given text
        typedText = userInput.value;
        if (typedText.trim() === selectedText) {
            clearInterval(interval);
            let finalWPM = parseInt(wpmElement.textContent);
            wpmScores.push(finalWPM);

            userInput.disabled = true; //Prevent further typing

            //If more rounds remain, show "next round" button
            if (currentRound < totalRounds) {
                resultMessage.textContent = `Round ${currentRound} completed! Your WPM: ${finalWPM}. Click "Next Round" to continue.`;
                nextRoundButton.classList.remove("hidden");
                //Else show final results
                //FINAL WPM is the average across 3 rounds.
            } else {
                let avgWPM = Math.round(wpmScores.reduce((a, b) => a + b, 0) / totalRounds);
                resultMessage.textContent = `Game Over! Your average WPM: ${avgWPM}`;
                restartButton.textContent = "Play Again";
            }
        }
    });

    //Real time updates: timer, wpm
    function updateTime() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = elapsedTime;
        wpmElement.textContent = Math.floor((typedText.split(" ").length / elapsedTime) * 60) || 0;
    }

    //Disable start button initially
    startButton.disabled = true;
    //Enable the start button when the user enters a name
    usernameInput.addEventListener("input", () => {
        startButton.disabled = (usernameInput.value.trim() === "");
    });

    //Starts game when start button is clicked
    //hides welcome screen and brings user to main game
    startButton.addEventListener("click", () => {
        userDisplay.textContent = `Welcome to TyperTyper, ${usernameInput.value}!`;
        userInput.style.color = colorPicker.value;
        welcomeScreen.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        startGame();
    });

    //Advance to next round when next round button is clicked
    nextRoundButton.addEventListener("click", () => {
        currentRound++;
        startGame();
    });

    //Resets game to round 1 when clicked.
    restartButton.addEventListener("click", () => {
        currentRound = 1;
        wpmScores = [];
        restartButton.textContent = "Restart";
        startGame();
    });

    //Toggles help instructions
    helpButton.addEventListener("click", () => {
        helpText.classList.toggle("hidden");
    });
});
