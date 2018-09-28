function Question(q, answers, correctIndex, src) {
    this.q = q;
    this.answers = answers;
    this.correctIndex = correctIndex;
    this.src = src;
}

// Question objects for the game to use
// Will go here
var q1 = "You've invited Anakin to sit on the Jedi council, but won't grant him the rank of master. He's not taking it well. How do you respond?";
var a1 = ["'That's enough, young Skywalker.'", "'Shall we continue?.'", "'Take a seat, young Skywalker.'", "'You know what they call a quarter-pounder with cheese in France?'"];
var question1 = new Question(q1, a1, 2, "assets/images/q1.png");

var q2 = "Is this question about young Boba Fett?";
var a2 = ["Yes.", "No.", "Absolutely.", "Yep."];
var question2 = new Question(q2, a2, 3, "assets/images/q2.png");

var q3 = "'Your thoughts dwell on your mother?' is asked by which charcter in 'The Phantom Menace'?";
var a3 = ["Ki-Adi-Mundi", "Yoda", "Qui-Gon Jinn", "Mace Windu"];
var question3 = new Question(q3, a3, 0, "assets/images/q3.jpg");

var q4 = "When Anakin slaughters a village of Sand People, who does he attack?";
var a4 = ["Just the men.", "Just the women.", "Just the children.", "Not just the men, but the women and children too."];
var question4 = new Question(q4, a4, 3, "assets/images/q4.jpg");

// var q5 = "Which of the following does Anakin NOT do to save Padme in 'Revenge of the Sith'?";
// var a5 = ["Kill Padme.", "Save the Separatist Council.", "Slaughter younglings.", "Turn to the dark side."];
// var question5 = new Question(q5, a5, 1, "assets/images/q5.png");

// var q6 = "When Palpatine is arrested by Mace Windu for being a sith lord, what is his response?";
// var a6 = ["'I'm sure this is a misunderstanding, Master Jedi.'", "'It's treason, then.'", "'No, no, no, NOOOOO!'", "'Whelp, you got me fellas.'"];
// var question6 = new Question(q6, a6, 1, "assets/images/q6.jpg")

var questions = [question1, question2, question3, question4];
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

    // Push the selected index to previousIndices
    previousIndices.push(pickedIndex);
    // Set currentQuestionIndex to be equal to the new pickedIndex;
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
    questionColumn.append("<h3 id='question'>" + currentQuestion.q + "</h3>");
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
    outcomeColumn.append("<h3>" + outcomeString + "</h3>");
    outcomeRow.append(outcomeColumn);
    $("#question-area").append(outcomeRow);

    // Create message row
    var messageRow = createBsRow();
    var messageColumn = createBsColumn(12);
    messageColumn.append("<h5>" + messageString + "</h5>");
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
    }, 5000);
}

function showEndScreen() {
    clearInterval(countDown);
    $("#game-area").hide()
    $("#end-row").show();

    $("#corrects").text("Correct Answers: " + correctAnswers);
    $("#incorrects").text("Incorrect Answers: " + incorrectAnswers);
    $("#unanswereds").text("Unanswered: " + unanswered);
}

function animateButton(id, startDelay, speed, period) {
    var delay = setTimeout(function() {
        var cycle = setInterval(function() {
            $(id).animate({
                opacity: "0.1"
            }, speed, function() {
                $(id).css("opacity", "1.0");
            });
        }, period);
    }, startDelay);
}

// Makes the buttons blink
function blinkButtons() {
    animateButton("#b1", 1000, 1000, 1500);
    animateButton("#b2", 0, 700, 2000);
}

$(document).ready( function() {
    $("#game-area").hide();
    $("#end-row").hide();
    blinkButtons();

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
        correctAnswers = 0;
        incorrectAnswers = 0;
        unanswered = 0;
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