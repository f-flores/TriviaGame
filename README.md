# TriviaGame
Trivia Game

### Description

This app displays a short Trivia Game, with questions about situation comedies. The
project leverages the use of intervals, both setTimeout and setInterval, to control
the game flow.

### Methodology

For the implementation of the game, I used an array of objects as the main data 
structure. Each object contains the trivia game's question, its choices, the correct 
answer index, as well as an image relevant to the sitcom being mentioned.

Similar to the slide show, the game's flow control is managed by setInterval and
setTimeout calls to the displayQuestion and displayAnswer functions. Since the
version of the game implemented includes a loading.gif (a special case for the
interval triggers), I separated the setIntervals for the displayAnswer function
into a separate routine called renewAnsInterval. This way, the intervals are checked
on each 'answer slide' and also upon a 'restart'.

The countdown timer is based on a stopwatch object, itself an interval timer. The
maximum time for a question is configured through a global variable, as is the
time interval for displaying the answers. If the countdown reaches zero, the
question goes unanswered and the answer is displayed. 

There is also a `gameStatus` object, which keeps track of the beginning of game,
a game over status, as well as the number of correct and incorrect answers, and
unanswered questions.

### About

The project utilizes the bootstrap and jquery libraries. The main code for the game 
is located in the `./assets/js directory`; the file is named `app.js`. The `style.css`
complements the `bootstrap 4` library by adding custom classes and id's. The images are
placed into the `./assets/images` folder. Also included is an `.eslintrc.json` 
configuration file. On the root level of this app is `index.html` which contains the
skeleton html. The trivia answer images are stored as the urls within the `triviaArray`
object.

### Comments

This game was added to my github profile's portfolio:
[f-flores portfolio](https://f-flores.github.io/portfolio.html).