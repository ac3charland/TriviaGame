function Question(q, answers, correctIndex, src) {
    this.q = q;
    this.answers = answers;
    this.correctIndex = correctIndex;
    this.src = src;
}

// Question objects for the game to use
// Will go here
var q1 = "Who is your mom?";
var a1 = ["Charlotte", "Sue", "Sam", "Mandy"];
var question1 = new Question(q1, a1, 0, "#");

var q2 = "Who is your dad?";
var a2 = ["George", "Herbie", "Tom", "Charles"];
var question2 = new Question(q2, a2, 2, "#");

var q3 = "Who is your sister?"
var a3 = ["Shanice", "Nicole", "Ron Swanson", "Ginnie"];
var question3 = new Question(q3, a3, 1, "#");

var questions = [question1, question2, question3];
var currentQuestionIndex = 0;
var previousIndices = [];
var secondsRemaining = 30;

var correctAnswers = 0;
var incorrectAnswers = 0;
var unanswered = 0;

var countDown;

// Randomly picks an index of questions that hasn't been used yet
function pickIndex() {
    // Randomly pick an index that hasn't been picked before
    pickedIndex = Math.floor(Math.random() * questions.length);
    for (; previousIndices.indexOf(pickedIndex) != -1; ) {
        pickedIndex = Math.floor(Math.random() * questions.length); 
    }

    
    previousIndices.push(pickedIndex);
    currentQuestionIndex = pickedIndex;
}

function createBsRow() {
    var bootstrapRow = $('<div class="row">');
    return bootstrapRow;
}

function createBsColumn(width) {
    var bootstrapColumn = $('<div class="col-md-' + width + ' text-center">');
    return bootstrapColumn;
}

// Grabs the Question from questions at index index and updates 
// the DOM and/or generates HTML with the question's information
function createQuestionHTML(index) {
    $("#question-area").empty();
    
    var currentQuestion = questions[index];

    // Create question row
    var questionRow = createBsRow();
    var questionColumn = createBsColumn(12);
    questionColumn.append("<h3>" + currentQuestion.q + "</h3>");
    questionRow.append(questionColumn);
    $("#question-area").append(questionRow);

    // Create answer rows
    for (var aIndex in currentQuestion.answers) {
        var answer = currentQuestion.answers[aIndex];

        var answerRow = createBsRow();
        var answerColumn = createBsColumn(12);
        answerColumn.append("<div class='answer-button' index=" + aIndex + ">" + answer + "</div>");
        answerRow.append(answerColumn);
        $("#question-area").append(answerRow);
    }
    
}

function createAnswerHTML(outcomeString, messageString) {
    $("#question-area").empty();

    // Create outcome row
    var outcomeRow = createBsRow();
    var outcomeColumn = createBsColumn(12);
    outcomeColumn.append("<h2>" + outcomeString + "</h2>");
    outcomeRow.append(outcomeColumn);
    $("#question-area").append(outcomeRow);

    // Create message row
    var messageRow = createBsRow();
    var messageColumn = createBsColumn(12);
    messageColumn.append("<h4>" + messageString + "</h4>");
    messageRow.append(messageColumn);
    $("#question-area").append(messageRow);

    // Create image row
    var imageRow = createBsRow();
    var imageColumn = createBsColumn(12);
    var src = questions[currentQuestionIndex].src;
    imageColumn.append("<img src='" + src + "' alt='" + src + "'/>");
    imageRow.append(imageColumn);
    $("#question-area").append(imageRow);
}

// Increments the timer and checks to see if the user ran out of time
function decrement() {
    secondsRemaining--;

    $("#timer").text("Seconds Remaining: " + secondsRemaining);
    
    if (secondsRemaining === 0) {
        showAnswer(-1);
        unanswered += 1;
    }
}

// Picks a new question to display and starts a timer
function startRound() {
    // If the user has gone through all the questions, show the end screen
    if (previousIndices.length == questions.length) {
        showEndScreen();
        return;
    }

    pickIndex();
    
    // Display the question to the page
    createQuestionHTML(currentQuestionIndex);

    // Start the timer
    secondsRemaining = 30;
    $("#timer").text("Seconds Remaining: 30")
    countDown = setInterval(decrement, 1000);
}

// Show the answer to the question with a message depending on
// whether the user guessed correctly or not
function showAnswer(chosenIndex) {
    // Stop any running timers
    clearInterval(countDown);
    
    // Check and see if the user answered correctly
    var answeredCorrectly = false;
    var correctIndex = questions[currentQuestionIndex].correctIndex;
    if (chosenIndex === correctIndex) {
        answeredCorrectly = true;
    }

    // Create a message for the user depending on their answer
    var correctAnswer = questions[currentQuestionIndex].answers[correctIndex];
    var messageString = "The correct answer was: " + correctAnswer;
    
    var outcomeString = "";
    if (answeredCorrectly) {
        outcomeString = "You got it!";
        correctAnswers += 1;
    } else {
        outcomeString = "Nope!";
        if (chosenIndex != -1)
            incorrectAnswers += 1;
    }

    // Create and display the answer HTML
    createAnswerHTML(outcomeString, messageString);

    // Start a timer to count down until the next question is displayed
    var timeout = setTimeout(function() {
        // Start the next round
        startRound();
    }, 4000);
}

function showEndScreen() {
    clearInterval(countDown);
    $("#game-area").hide()
    $("#end-row").show();

    $("#corrects").text("Correct Answers: " + correctAnswers);
    $("#incorrects").text("Incorrect Answers: " + incorrectAnswers);
    $("#unanswereds").text("Unanswered: " + unanswered);
}

$(document).ready( function() {
    $("#game-area").hide();
    $("#end-row").hide();

    // Starts the game.
    $(document).on("click", "#start", function () {
        $("#game-area").show();
        $("#start-row").hide();
        startRound();
    });

    $(document).on("click", "#reset", function() {
        $("#game-area").show();
        $("#end-row").hide();
        previousIndices = [];
        startRound()
    });


    // When the user clicks a possible answer, get the index value
    // assigned to the button by createQuestionHTML and see if it
    // matches the correctIndex of the question at currentQuestionIndex.
    $(document).on("click", ".answer-button", function() {
        var chosenIndexString = $(this).attr("index");
        var chosenIndex = parseInt(chosenIndexString);
        showAnswer(chosenIndex);
    });
})