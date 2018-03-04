// Slideshow Activity
// Students: follow the instructions below:

// TODO: Put links to our images in this image array.
/* var images = ["./assets/images/bootstrap.png","./assets/images/github-logo.jpg","./assets/images/logo_JavaScript.png"]; */

// Variable showImage will hold the setInterval when we start the slideshow
/* var showImage; */

// Count will keep track of the index of the currently displaying picture.
// var count = 0;

// var hdr = $("head");

// console.log("Head: " + Object.entries(hdr));


// TODO: Use jQuery to run "startSlideshow" when we click the "start" button.
/* $("#start").on("click",startSlideshow); */

// TODO: Use jQuery to run "stopSlideshow" when we click the "stop" button.
/* $("#stop").on("click",stopSlideshow); */


// This function will replace display whatever image it's given
// in the 'src' attribute of the img tag.

// function displayImage() {
// $("#image-holder").html("<img src=" + images[count] + " width='400px'>");
// }

// function nextImage() {

  // TODO: Increment the count by 1.
 /*  count++; */

  // TODO: Show the loading gif in the "image-holder" div.
 /*  $("#image-holder").html("<img src='./assets/images/loading.gif' alt='Loading gif'>"); */

  // TODO: Use a setTimeout to run displayImage after 1 second.
 /*  setTimeout(displayImage, 1000); */

  // TODO: If the count is the same as the length of the image array, reset the count to 0.
//   if (count === images.length) {
//    count = 0;
//  }

// }
// function startSlideshow() {

  // TODO: Use showImage to hold the setInterval to run nextImage.
/*   showImage = setInterval(nextImage, 2253); */

// }
// function stopSlideshow() {

  // TODO: Put our clearInterval here:
/*   clearInterval(showImage); */
// }

// This will run the display image function as soon as the page loads.
/* displayImage(); */

// have outerbox with background image

// have inner box with question and answer interface

// inner box with question and answer

// object for each answer, have count increment automatically
//* ********************
//  var triviaArray = [
//    count = 0, // count index, have this count be global
//    {
//      q1: "Question 1",
//      c1: "choice 1",
//      c2: "choice 2",
//      c3: "choice 3",
//      c4: "choice 4",
//      a1: "choice2"
//    },
//    {
//      q2: "Question 2",
//      c1: "choice 1",
//      c2: "choice 2",
//      c3: "choice 3",
//      c4: "choice 4",
//      a2: "choice 3"
//    }
// ]
//
//  look over slide show activity to see how to code game
//    especially the time intervals
//  go over countDown activity
//    to view how to display timers....
//
//
// *****************************
// triviaGame
//  initializeTriviaGame():
//    reset anwerWrong, answerRight, timeOut...
//  triviaGameLoop:
//   forEach question and answerObject: // OuterLoop Array of objects, each question-answer object should have index
//      while (not TimeOutQuestion OR answerClicked)  // get answer
//        innerTimeLoop, displayTimeLeft:
//        displayQuestion
//        displayChoices
//        selectChoice
//      if (TimeOut) OR (answerClicked !== answer[i])
//        display answerWrong
//        incrementWrongCounter
//        display CorrectAnswer
//      else // answer is right
//        display answerRight
//        incrementRightCounter
//    // at end of game
//   display TriviaGameStats
//   have restartOption
// foo(() => this.a)
$(document).ready(() => {
  const MaxWait = 3,
        AnswerWait = 1,
        SecondsPerQuestion = MaxWait * 1000,
        AnswerInterval = AnswerWait * 1000;
  var triviaArray = [
    //    count = 0, // count index, have this count be global
    {
      "a": 1,
      "choices": ["Choice 1","Choice 2","Choice 3","Choice 4"],
      "q": "Question 1"
    },
    {
      "a": 0,
      "choices": ["choice 1","choice 2","choice 3","choice 4"],
      "q": "Question 2"
    } /*,
      {
      "a": 2,
      "choices": ["choice 1","choice 2","choice 3","choice 4"],
      "q": "Question 3"
    } */
   ];
  var gameState = {
    "isTimeUp": false,
    "isGameOver": false,
    "isGameBeginning": false,
    "currentChoice": "",
    "numCorrect": 0,
    "numWrong": 0,
    "numUnanswered": 0,
    "questionCount": 0
  };
  // ------------------------------------------------------------------------------------------
  // the countDown object is largely based on the stopWatch object reviewed in the
  //   RUTSOM201801FSF4-Class-Repository-FSF repository on 2/24/2018
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

      console.log(converted);

      // show the converted time in the "time-holder" div.
     // $("#timer-holder").text(converted);
      if (converted === "00" || !clockRunning) {
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
      intervalId = 0,
      showQuestion = "",
      clockRunning = false;

 // console.log("Begin trivia game");
  $.ajax({
    "method": "GET",
    "url": queryURL
  }).then((response) => {
    var result = "in response";

    console.log(JSON.stringify(response));
    console.log("Result: " + result);
  });
  console.log("end");
  console.log("Trivia Array: " + triviaArray);

  // -----------------------------------------------------------------------------
  // displayQuestion() listens for start button to be clicked
  //
  function displayQuestion() {
    var choiceBtn,
        qDiv = $("<div>"),
        questionText = "",
        choiceText = "",
        iq = 0;

    displayTime();
    // clear and remove image and prior answer if any
    $("#image-holder").empty();
    $(".trivia-answer").remove();
    // empty content from id question-holder
    $("#question-holder").empty();

    // Adding a data-attribute
    qDiv.attr("data-name", gameState.questionCount);
    questionText = "<h3 class=\"display-3\">" + triviaArray[gameState.questionCount].q + "</h3>";
    qDiv.html(questionText);
    $(qDiv).append(qDiv);

    // build buttons for each question
    for (iq = 0; iq < triviaArray[gameState.questionCount].choices.length; iq++) {
      choiceBtn = $("<button>");
      choiceBtn.attr("num-choice",iq);
      choiceBtn.addClass("custom-button");
      choiceText = "<h3 class=\"display-3\">" + triviaArray[gameState.questionCount].choices[iq] + "</h3>";
      choiceBtn.html(choiceText);
      $(qDiv).append(choiceBtn);
    }

    $("#question-holder").append(qDiv);
  }

  // -----------------------------------------------------------------------------
  // nextQuestion displays following question in trivia game
  //
  function nextQuestion() {
    var ansIndex = triviaArray[gameState.questionCount].a,
        correctChoice = triviaArray[gameState.questionCount].choices[ansIndex];

    // remove possible choices from section
    // $("#question.holder").remove();
    $("#question.holder").empty();
    gameState.questionCount++;
    // display answer
    console.log("Game State Question Count: ", gameState.questionCount);
    $("#question-holder").html("<h2 class=\"display-2 trivia-answer\">Answer is: " + correctChoice + "</h2>");

    // Use a setTimeout to run displayQuestion after answer interval
    setTimeout(displayQuestion, AnswerInterval);

    if (gameState.questionCount === triviaArray.length) {
      console.log("end of game... questionCount equals triviaArray.length");
      gameOverRoutine();
    }
  }


  // -----------------------------------------------------------------------------
  // gameOverRoutine() executes a series of functions when game is over
  //
  function gameOverRoutine() {
    console.log("in gameOverRoutine()");
    gameState.questionCount = 0;
    stopDisplayQuestions();
    showScoreBoard();
   // setTimeout(showScoreBoard, 9000);
    restartGame();
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

    console.log("in showScoreBoard()");
    htmlText = "<p>Score: </p>";
    htmlText = "<p>Correct Answers: " + gameState.numCorrect + "</p>" +
      "<p>Incorrect Answers: " + gameState.numWrong + "</p>" +
      "<p>Unanswered: " + gameState.numUnanswered + "</p>";
    scoreDiv.attr("id","score-board");
    scoreDiv.html(htmlText);
    console.log("htmlText: " + htmlText);
    $("#score-board").append(scoreDiv);
  }


  // -----------------------------------------------------------------------------
  // restartGame() resets values and creates restart button
  //
  function restartGame() {
    var restartBtn = $("<button>");

    console.log("in restartGame()");
    // $("#question-holder").empty();
    restartBtn.text("Restart");
    $("#score-board").append(restartBtn);
  }


  // -----------------------------------------------------------------------------
  // stopDisplayQuestions stops current question
  //
  function stopDisplayQuestions() {
    var htmlText = "";

    console.log("in stopQuestion");
    // stop countdown and clear interval
    countDown.stop();
    clearInterval(showQuestion);
    // setTimeout(showScoreBoard, 1000);
    $("#question-holder").empty();
    htmlText = "<p>Score: </p>";
    htmlText = "<p>Correct Answers: " + gameState.numCorrect + "</p>" +
      "<p>Incorrect Answers: " + gameState.numWrong + "</p>" +
      "<p>Unanswered: " + gameState.numUnanswered + "</p>";
    $("#score-board").text(htmlText);

  }


  // -----------------------------------------------------------------------------
  // beginTrivia() listens for start button to be clicked
  //
  function beginTrivia() {
    $("#start").on("click", initGameRoutine);
  }

  // -----------------------------------------------------------------------------
  // initGameRoutine() sets some initial variables for trivia game
  //
  function initGameRoutine() {
    gameState.isTimeUp = false;
    gameState.isGameOver = false;
    gameState.isGameBeginning = true;
    // $("#start").detach();
    $("#start").animate({"opacity": "0"});
    $("#question-holder").html("<h2>Loading game... Please wait</h2>");
    $("#image-holder").html("<img src='./assets/images/loading.gif' alt='Loading gif'>");
    //   displayTime();
    showQuestion = setInterval(nextQuestion, SecondsPerQuestion + AnswerInterval);
    setTimeout(displayQuestion, AnswerInterval);
  }

  // -----------------------------------------------------------------------------
  // displayTime() displays time remaining in time div
  //
  function displayTime() {
    if (gameState.isGameBeginning === true) {
      gameState.isGameBeginning = false;
    }
    countDown.reset();
    countDown.start();

    console.log("in displayTime()");
   // countDown.start();
//     if (countDown.time === 0) {
//      countDown.stop();
//      console.log("Time is up!");
//    }
  }


  function doTriviaGame() {
    beginTrivia();
    if (gameState.isTimeUp === false) {
      console.log("show question");
    } else {
      console.log("show next question");
    }
  }

  doTriviaGame();

});