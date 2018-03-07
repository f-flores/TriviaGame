// ******************************************************************************************
// File name: app.js
// Author: Fabian Flores
// Date: March, 2018
// Description: Implements logic of a trivia game. The app uses an array of objects to represent
// the questions, and choices. Timers are implemented between each question.

 $(document).ready(() => {
  const MaxWait = 4,
        AnswerWait = 3,
        BeginWait = 1.5,
        SecondsPerQuestion = MaxWait * 1000,
        AnswerInterval = AnswerWait * 1000,
        BeginInterval = BeginWait * 1000;

  var triviaArray = [
    {
      "a": 1,
      "choices": ["The Facts of Life","Family Ties","Different Strokes","Silver Spoon"],
      "q": "In what sitcom did Michael J. Fox act during the 1980s?",
      "sitcom": "Family Ties",
      "triviaImg": "https://media0.giphy.com/media/cQEzI8JXi8pVe/giphy.gif"
    },
    {
      "a": 0,
      "choices": ["Boston","Seattle","Chicago","Detroit"],
      "q": "In what city did the series Cheers take place?",
      "sitcom": "Cheers",
      "triviaImg": "https://media.giphy.com/media/UuSJuhsJGURa/giphy.gif"
    },
    {
      "a": 2,
      "choices": ["Penny","Leonard","Sheldon","Amy"],
      "q": "Which Big Bang Theory character is from Texas?",
      "sitcom": "Big Bang Theory",
      "triviaImg": "https://media3.giphy.com/media/D0uo4CQGNmYVy/giphy.gif"
    }
/*     {
      "a": 2,
      "choices": ["Shanenah","Pam","Gina","Keyolo"],
      "q": "In 90's sitcom Martin, who is Martin's girlfriend?",
      "sitcom": "Martin",
      "triviaImg": "https://media3.giphy.com/media/HTytvka5AJIaI/giphy.gif"
    },
    {
      "a": 0,
      "choices": ["Montreal, Canada","Los Angeles, California","Little Falls, New York","New York city"],
      "q": "In the King of Queens, where was Doug Heffernan born?",
      "sitcom": "The King of Queens",
      "triviaImg": "https://media2.giphy.com/media/8a2Yq2g25wYZW/giphy.gif"
    },
    {
      "a": 3,
      "choices": ["TV","Radio","Hanging garden pots","A garbage disposal"],
      "q": "In Seinfeld, what does Kramer have installed in his shower?",
      "sitcom": "Seinfeld",
      "triviaImg": "https://media3.giphy.com/media/12UlfHpF05ielO/giphy.gif"
    },
    {
      "a": 2,
      "choices": ["Monk's Diner","Central Perk","Riff's","Tom's Restaurant"],
      "q": "In Mad About You, what restaurant do Paul and Jamie go to all the time?",
      "sitcom": "Mad About You",
      "triviaImg": "https://media0.giphy.com/media/l44QA0nFgOZIwnS0w/giphy.gif"
    },
    {
      "a": 1,
      "choices": ["8","10","13","12"],
      "q": "How many seasons did Friends last?",
      "sitcom": "Friends",
      "triviaImg": "https://media0.giphy.com/media/31lPv5L3aIvTi/giphy.gif"
    },
    {
      "a": 2,
      "choices": ["basketball","soccer","baseball","tennis"],
      "q": "In George Lopez, what sport does George want Max to play?",
      "sitcom": "George Lopez",
      "triviaImg": "https://media0.giphy.com/media/14kd0HVtTkw3wk/giphy.gif"
    },

    */
   ];
  var gameState = {
    "isTimeUp": false,
    "isGameOver": false,
    "isGameBeginning": false,
    "isFirstGame": true,
    "correctAnswer": false,
    "currentChoice": "",
    "numCorrect": 0,
    "numWrong": 0,
    "numUnanswered": 0,
    "questionCount": 0
  };
  // ------------------------------------------------------------------------------------------
  // the countDown object is largely based on the stopWatch object reviewed in the
  //   RUTSOM201801FSF4-Class-Repository-FSF repository on 2/24/2018
  var clockRunning = false,
      answerTimeout,
      showAnswer,
      intervalId;

  var countDown = {
    "time": MaxWait,
    "reset": () => {

      countDown.time = MaxWait;

      // Update the time-holder div
      $("#timer-holder").html("<h4>Time Remaining: " + countDown.time.toString() + "</h4>");

    },
    "start": () => {
      // display time remaining
      $("#timer-holder").html("<h4>Time Remaining: " + countDown.time.toString() + "</h4>");
      // start countDown and set the clock to running.
      if (!clockRunning) {
          intervalId = setInterval(countDown.count, 1000);
          clockRunning = true;
      }
    },
    "stop": () => {
      // clearInterval stops countDown here and sets clockRunning to false.
      clearInterval(intervalId);
      clockRunning = false;
    },
    "count": () => {
      var converted;

      // Decrease countdown time by 1
      countDown.time--;

      // Get current time, pass that into the countDown.timeConverter function,
      converted = countDown.timeConverter(countDown.time);

      // show the converted time in the "time-holder" div.
      if (converted === "00" || clockRunning === false) {
        countDown.stop();
        $("#timer-holder").html("<h4>Time is up!</h4>");
        gameState.isTimeUp = true;
      } else {
        $("#timer-holder").html("<h4>Time Remaining: " + converted.toString() + "</h4>");
      }
    },
    "timeConverter": (tm) => {

      var minutes = Math.floor(tm / 60);
      var seconds = tm - minutes * 60;

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if (minutes === 0) {
        minutes = "00";
      } else if (minutes < 10) {
        minutes = "0" + minutes;
      }

      // only return seconds for trivia game instead of minutes + seconds;
      return seconds;
    }
  };

  // -----------------------------------------------------------------------------
  // getTriviaChoice(event)
  //
  function getTriviaChoice(event) {
    var choice;

    event.preventDefault();
    // stop countdown
    countDown.stop();

    if (gameState.isGameOver) {
      clearInterval(showAnswer);
    } else {
      choice = $(this).attr("num-choice");
      gameState.currentChoice = parseInt(choice, 10);
      clearInterval(showAnswer);
      displayAnswer();
    }
  }

  // -----------------------------------------------------------------------------
  // displayQuestion() listens for start button to be clicked
  //
  function displayQuestion() {
    var choiceBtn,
        qDiv,
        triviaQuestion,
        triviaChoice,
        iq = 0;

    console.log("In displayQuestion()");

    displayTime();
    // clear and remove image and prior answer if any
    $("#question-holder, #image-holder, #loading-img, .trivia-answer").empty();

    // empty content from id question-holder
    // $("#question-holder").empty();

    // useful to set and later check "unanswered" condition
    gameState.currentChoice = "";
    qDiv = $("<div>");
    triviaQuestion = $("<h3>");

    qDiv.attr("id","question-div");
    // Adding a data-attribute
    qDiv.attr("data-name", gameState.questionCount);
    triviaQuestion.addClass("display-5 font-weight-bold");
    triviaQuestion.html(triviaArray[gameState.questionCount].q + "<br>");
    qDiv.append(triviaQuestion);

    // build buttons for each trivia choice
    for (iq = 0; iq < triviaArray[gameState.questionCount].choices.length; iq++) {
      triviaChoice = $("<h3>");
      triviaChoice.addClass("display-5");
      triviaChoice.text(triviaArray[gameState.questionCount].choices[iq]);
      choiceBtn = $("<button>");
      choiceBtn.attr("num-choice",iq);
      choiceBtn.addClass("trivia-choice-button mt-3 mb-2");
      choiceBtn.append(triviaChoice);
      $(qDiv).append(choiceBtn);
    }

    $("#question-holder").append(qDiv);
  }

  // -----------------------------------------------------------------------------
  // displayAnswer() displays the corresponding trivia question's answer in trivia
  // game, by retreiving the answer in the triviaArray.
  //
  function displayAnswer() {
    var ansIndex = triviaArray[gameState.questionCount].a,
        correctChoice = triviaArray[gameState.questionCount].choices[ansIndex],
        htmlText = "",
        tvImg = $("<img>");

    if (gameState.currentChoice === "") {
      gameState.correctAnswer = false;
      gameState.numUnanswered++;
      htmlText = "<h3 class=\"display-5 trivia-answer\">Sorry, you ran out of time...</h3>";
      htmlText += "<h3 class=\"display-5 trivia-answer\">Answer is: " + correctChoice + "</h3>";
    } else if (gameState.currentChoice === ansIndex) {
      gameState.correctAnswer = true;
      gameState.numCorrect++;
      htmlText = "<h3 class=\"display-5 trivia-answer\">You are correct!</h3>";
      htmlText += "<h3 class=\"display-5 trivia-answer\">" + correctChoice + "</h3>";
    } else {
      gameState.correctAnswer = false;
      gameState.numWrong++;
      htmlText = "<h3 class=\"display-5 trivia-answer\">Sorry, that is incorrect...</h3>";
      htmlText += "<h3 class=\"display-5 trivia-answer\">The correct answer is: " + correctChoice + "</h3>";
    }

    // remove possible previous choices from section
    $("#question.holder").empty();

    // display answer
    $("#question-holder").html(htmlText);

    // display sitcom image
    tvImg.addClass("img-fluid");
    tvImg.attr("src", triviaArray[gameState.questionCount].triviaImg);
    tvImg.attr("alt", triviaArray[gameState.questionCount].sitcom + " Image.");
    $("#image-holder").prepend(tvImg);

    // increment question counter
    gameState.questionCount++;

    if (gameState.questionCount === triviaArray.length) {
      setTimeout(gameOverRoutine, AnswerInterval);
    } else {
      // Use setTimeout to run displayQuestion after AnswerInterval seconds and save it
      // to answerTimeout.
      answerTimeout = setTimeout(displayQuestion, AnswerInterval);
      runTimers();
    }
  }


  // -----------------------------------------------------------------------------
  // gameOverRoutine() executes a series of functions when game is over
  //
  function gameOverRoutine() {
    gameState.isGameOver = true;
    gameState.isFirstGame = false;
    stopDisplayQuestions();
    showScoreBoard();
    prepareRestart();
  }


  // -----------------------------------------------------------------------------
  // showScoreBoard() displays game score
  //
  function showScoreBoard() {
    var htmlText = "",
        scoreDiv = $("<div>");

    countDown.stop();

    // empty prior content
    $("#question-holder").empty();

    htmlText = "<p>Score: </p>";
    htmlText = "<p>Correct Answers: " + gameState.numCorrect + "</p>" +
      "<p>Incorrect Answers: " + gameState.numWrong + "</p>" +
      "<p>Unanswered: " + gameState.numUnanswered + "</p>";
    scoreDiv.addClass("rainbow-text");
    scoreDiv.attr("id","score-stats");
    scoreDiv.html(htmlText);
    console.log("htmlText: " + htmlText);
    $("#score-board").prepend(scoreDiv);
  }


  // -----------------------------------------------------------------------------
  // prepareRestart() resets values and prepares restart button
  //
  function prepareRestart() {
    var restartBtn = $("<button>");

    // creates restart button
    restartBtn.attr("id","restart-btn");
    restartBtn.addClass("trivia-button col-xs-12 offset-sm-2 col-sm-4 offset-md-4 col-md-4");
    restartBtn.html("<h2>Restart</h2>");
    $("#restart-section").append(restartBtn);

    restartBtn.on("click", restartGame);
  }


  // -----------------------------------------------------------------------------
  // restartGame() empties out score-board div contents and restarts trivia game
  //
  function restartGame() {
    $("#restart-section, #score-board").empty();
    $(".trivia-choice-button").remove();

    initGameRoutine();
  }

  // -----------------------------------------------------------------------------
  // stopDisplayQuestions stops current question
  //
  function stopDisplayQuestions() {
    var startBtn = $("#start");

    $(startBtn).blur();
    clearTimeout(answerTimeout);
    clearInterval(showAnswer);
    $("#image-holder").empty();
    $("#question-holder").empty();
  }


  // -----------------------------------------------------------------------------
  // beginTrivia() listens for start button to be clicked
  //
  function beginTrivia() {
    gameState.isGameBeginning = true;
    $("#start").on("click", initGameRoutine);
  }

  // -----------------------------------------------------------------------------
  // resetGameStats() reinitializes the gameState object
  //
  function resetGameStats() {
    gameState.isTimeUp = false;
    gameState.isGameOver = false;
    gameState.currentChoice = "";
    gameState.numCorrect = 0;
    gameState.numWrong = 0;
    gameState.numUnanswered = 0;
    gameState.questionCount = 0;
  }

  // -----------------------------------------------------------------------------
  // emptyStartBtn empties out start-control div (which can potentially effect
  // hovers on trivia button)
  function emptyStartBtn() {
    $("#start-control").empty();
  }

  // -----------------------------------------------------------------------------
  // initGameRoutine() sets some initial variables for trivia game
  //
  function initGameRoutine() {
    resetGameStats();

    $("#start").animate({"opacity": "0"});
    $("#question-holder").html("<h2 class=\"display-5\">Loading game... Please wait</h2>");
    $("#loading-img").html("<img src='./assets/images/loading.gif' class='img-fluid' alt='Loading gif'>");

    runTimers();
  }

  // -----------------------------------------------------------------------------
  // runTimers() triggers timers and sets Intervals
  //
  function runTimers() {

    if (gameState.isGameBeginning) {
        clearInterval(showAnswer);
        showAnswer = setInterval(displayAnswer, SecondsPerQuestion + BeginInterval);
        setTimeout(emptyStartBtn, BeginInterval);
        setTimeout(displayQuestion, BeginInterval);
        if (gameState.isGameBeginning) {
          gameState.isGameBeginning = false;
        }
    } else if (!gameState.isGameBeginning && gameState.questionCount >= 1) {
      clearInterval(showAnswer);
      showAnswer = setInterval(displayAnswer, SecondsPerQuestion + AnswerInterval);
    } else {
      displayQuestion();
      clearInterval(showAnswer);
      showAnswer = setInterval(displayAnswer, SecondsPerQuestion);
    }

  }


  // -----------------------------------------------------------------------------
  // displayTime() displays time remaining in time div
  //
  function displayTime() {
    // console.log("in displayTime()");
    if (gameState.isGameOver) {
      countDown.stop();
    } else {
      countDown.reset();
      countDown.start();
    }
  }


  function triviaGame() {
    beginTrivia();
  }

  if (!gameState.isGameOver) {
    triviaGame();
    // capture trivia question's buttons
    $(document).on("click", ".trivia-choice-button", getTriviaChoice);
  }
});