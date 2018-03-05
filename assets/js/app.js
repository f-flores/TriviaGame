/** *******************************************************************************************
 *  File name: app.js
 *  Author: Fabian Flores
 *  Date: March, 2018
 *  Description: Implements logic of a trivia game. The app uses an array of objects to represent
 *    the questions, and choices. Timers are implemented between each question. 
 */

 $(document).ready(() => {
  const MaxWait = 30,
        AnswerWait = 6,
        SecondsPerQuestion = MaxWait * 1000,
        AnswerInterval = AnswerWait * 1000;
  var triviaArray = [
    {
      "a": 1,
      "choices": ["The Facts of Life","Family Ties","Different Strokes","Silver Spoon"],
      "q": "In what sitcom did Michael J. Fox act during the 1980s?"
    },
    {
      "a": 0,
      "choices": ["Boston","Seattle","Chicago","Detroit"],
      "q": "In what city did the series Cheers take place?"
    },
    {
      "a": 2,
      "choices": ["Penny","Leonard","Sheldon","Amy"],
      "q": "Which Big Bang Theory character is from Texas?"
    },
    {
      "a": 2,
      "choices": ["Shanenah","Pam","Gina","Keyolo"],
      "q": "In 90's sitcom Martin, who is Martin's girlfriend?"
    },
    {
      "a": 0,
      "choices": ["Montreal, Canada","Los Angeles, California","Little Falls, New York","New York city"],
      "q": "In the King of Queens, where was Doug Heffernan born?"
    },
    {
      "a": 3,
      "choices": ["TV","Radio","Hanging garden pots","A garbage disposal"],
      "q": "In Seinfeld, what does Kramer have installed in his shower?"
    }    
   ];
  var gameState = {
    "isTimeUp": false,
    "isGameOver": false,
    "isGameBeginning": false,
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
  var giphyKey = "zOxVha9Ha82FHhEMPSbIBvoOOApcLrBK",
      giphyURL = "http://api.giphy.com/v1/gifs/search?",
      queryURL = giphyURL + "q=ryan+gosling&api_key=" + giphyKey + "&limit=2",
      showQuestion = "";

 // console.log("Begin trivia game");
  $.ajax({
    "method": "GET",
    "url": queryURL
  }).then((response) => {
    var result = "in response";

    console.log(JSON.stringify(response));
    console.log("Result: " + result);
  });
  // console.log("end");
  console.log("Trivia Array: " + triviaArray);

  // -----------------------------------------------------------------------------
  // getTriviaChoice() choice select () listens for start button to be clicked
  //
  function getTriviaChoice(event) {
    var choice;

    event.preventDefault();
    // console.log("in getTriviaChoice");
    // console.log("Trivia choice button clicked... ");


    if (gameState.isGameOver) {
      clearInterval(showQuestion);
    } else {
      choice = $(this).attr("num-choice");
      // console.log("clicked choice: " + choice);
      gameState.currentChoice = parseInt(choice, 10);
      clearInterval(showQuestion);
      nextQuestion();
      showQuestion = setInterval(nextQuestion, SecondsPerQuestion + AnswerInterval);
    }
  }

  // -----------------------------------------------------------------------------
  // displayQuestion() listens for start button to be clicked
  //
  function displayQuestion() {
    var choiceBtn,
        qDiv = $("<div>"),
        questionText = "",
        choiceText = "",
        iq = 0;

    console.log("In displayQuestion()");
    displayTime();
    // clear and remove image and prior answer if any
    $("#image-holder").empty();
    $(".trivia-answer").empty();
    // empty content from id question-holder
    $("#question-holder").empty();
    // useful to check if question goes unanswered
    gameState.currentChoice = "";

  //  if (!gameState.isGameOver) {
      qDiv.attr("id","question-div");
      // Adding a data-attribute
      qDiv.attr("data-name", gameState.questionCount);
      questionText = "<h3 class=\"display-4\">" + triviaArray[gameState.questionCount].q + "</h3><br />";
      qDiv.html(questionText);
      $("#question-holder").append(qDiv);

      // build buttons for each question
      for (iq = 0; iq < triviaArray[gameState.questionCount].choices.length; iq++) {
        choiceBtn = $("<button>");
        choiceBtn.attr("num-choice",iq);
        choiceBtn.addClass("trivia-choice-button");
        choiceText = "<h3 class=\"display-5\">" + triviaArray[gameState.questionCount].choices[iq] + "</h3>";
        choiceBtn.html(choiceText);
        $(qDiv).append(choiceBtn);
      }

      $("#question-holder").append(qDiv);
   // }
  }

  // -----------------------------------------------------------------------------
  // nextQuestion displays following question in trivia game
  //
  function nextQuestion() {
    var ansIndex = triviaArray[gameState.questionCount].a,
        correctChoice = triviaArray[gameState.questionCount].choices[ansIndex],
        htmlText = "";

    // console.log("in nextQuestion()");
    // console.log("current choice: " + gameState.currentChoice);
    // console.log("type of current choice: " + typeof gameState.currentChoice);
    // console.log("correct choice: " + ansIndex);
    // console.log("type of correct choice: " + typeof ansIndex);
    if (gameState.currentChoice === "") {
      // console.log("UNANSWERED question");
      gameState.correctAnswer = false;
      gameState.numUnanswered++;
      htmlText = "<h2 class=\"display-4 trivia-answer\">Sorry... you did not answer in time</h2>";
    } else if (gameState.currentChoice === ansIndex) {
      // console.log("CORRECT answer!");
      gameState.correctAnswer = true;
      gameState.numCorrect++;
      htmlText = "<h2 class=\"display-4 trivia-answer\">You are correct!</h2>";
    } else {
      // console.log("INCORRECT answer!");
      gameState.correctAnswer = false;
      gameState.numWrong++;
      htmlText = "<h2 class=\"display-4 trivia-answer\">Sorry, that is wrong...</h2>";
    }
    // remove possible choices from section
    $("#question.holder").empty();

    gameState.questionCount++;
    // display answer
    // console.log("Game State Question Count: ", gameState.questionCount);
    htmlText += "<h2 class=\"display-4 trivia-answer\">Answer is: </h2>" +
    "<h2 class=\"display-4 trivia-answer\">" + correctChoice + "</h2>";
    $("#question-holder").html(htmlText);

    if (gameState.questionCount === triviaArray.length) {
      // console.log("end of game... questionCount equals triviaArray.length");
      setTimeout(gameOverRoutine, AnswerInterval);
    } else {
      // Use a setTimeout to run displayQuestion after answer interval
      answerTimeout = setTimeout(displayQuestion, AnswerInterval);
    }
  }


  // -----------------------------------------------------------------------------
  // gameOverRoutine() executes a series of functions when game is over
  //
  function gameOverRoutine() {
    // console.log("in gameOverRoutine()");
    gameState.isGameOver = true;
    stopDisplayQuestions();
    showScoreBoard();
    restartGame();
  }


  // -----------------------------------------------------------------------------
  // showScoreBoard() displays game score
  //
  function showScoreBoard() {
    var htmlText = "",
        scoreDiv = $("<div>");

    // console.log("in showScoreBoard()");
    countDown.stop();

    // empty prior content
    $("#question-holder").empty();

    htmlText = "<p>Score: </p>";
    htmlText = "<p>Correct Answers: " + gameState.numCorrect + "</p>" +
      "<p>Incorrect Answers: " + gameState.numWrong + "</p>" +
      "<p>Unanswered: " + gameState.numUnanswered + "</p>";
    scoreDiv.attr("id","score-stats");
    scoreDiv.html(htmlText);
    console.log("htmlText: " + htmlText);
    $("#score-board").prepend(scoreDiv);
  }


  // -----------------------------------------------------------------------------
  // restartGame() resets values and creates restart button
  //
  function restartGame() {
    var restartBtn = $("<button>");

    // console.log("in restartGame()");

    // creates restart button
    restartBtn.text("Restart");
    restartBtn.attr("id","restart-btn");
    $("#restart-section").append(restartBtn);
    restartBtn.on("click", resetGame);
  }

  // -----------------------------------------------------------------------------
  // resetGame() resets game and begins new trivia game
  //
  function resetGame() {
    $("#restart-section, #score-board").empty();
    $(".trivia-choice-button").remove();

    initGameRoutine();
  }

  // -----------------------------------------------------------------------------
  // stopDisplayQuestions stops current question
  //
  function stopDisplayQuestions() {
    var startBtn = $("#start");

    // console.log("in stopDisplayQuestions()");
    $(startBtn).blur();
    clearTimeout(answerTimeout);
    clearInterval(showQuestion);
    $("#question-holder").empty();
  }


  // -----------------------------------------------------------------------------
  // beginTrivia() listens for start button to be clicked
  //
  function beginTrivia() {
    console.log("in beginTrivia()");
    $("#start").on("click", initGameRoutine);
  }

  // -----------------------------------------------------------------------------
  // resetGameStats() reinitializes the gameState object
  //
  function resetGameStats() {
    gameState.isTimeUp = false;
    gameState.isGameOver = false;
    gameState.isGameBeginning = true;
    gameState.currentChoice = "";
    gameState.numCorrect = 0;
    gameState.numWrong = 0;
    gameState.numUnanswered = 0;
    gameState.questionCount = 0;
  }

  // -----------------------------------------------------------------------------
  // initGameRoutine() sets some initial variables for trivia game
  //
  function initGameRoutine() {
    // console.log("in initGameRoutine()");
    resetGameStats();

    $("#start").animate({"opacity": "0"});
    $("#question-holder").html("<h2>Loading game... Please wait</h2>");
    $("#image-holder").html("<img src='./assets/images/loading.gif' alt='Loading gif'>");

    if (!gameState.isGameOver) {
      showQuestion = setInterval(nextQuestion, SecondsPerQuestion + AnswerInterval);
      displayQuestion();
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


  function doTriviaGame() {
    // console.log("in doTriviaGame()");
    beginTrivia();
  }

  if (!gameState.isGameOver) {
    doTriviaGame();
    // capture trivia question's buttons  
    $(document).on("click", ".trivia-choice-button", getTriviaChoice);
  }
});