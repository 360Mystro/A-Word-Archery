let players = [];   
let currentHint = '';

document.addEventListener('DOMContentLoaded', function() {
    // Select the image container element
    var imageContainerGame = document.getElementById('image-container-game');

    // Hide the image container
    imageContainerGame.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    var backgroundImageGame = new Image();
    backgroundImageGame.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        
        var dataURL = canvas.toDataURL();

        localStorage.setItem('backgroundImageGame', dataURL);

        document.body.style.backgroundImage = 'url(' + dataURL + ')';
    };

    backgroundImageGame.src = 'Sunday.gif';
});

document.addEventListener('DOMContentLoaded', function() {
    var scoreboardImage = new Image();
    scoreboardImage.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        
        var dataURL = canvas.toDataURL();

        localStorage.setItem('background-image', dataURL);

        document.getElementById('scoreboardContainer').style.backgroundImage = 'url(' + dataURL + ')';

    };

    scoreboardImage.src = 'scoreboardFramed.jpg';
});


document.addEventListener('DOMContentLoaded', function () {
    initializeGame();

    // Add event listeners
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('closeWordListButton').addEventListener('click', toggleWordList);
    document.getElementById('hintButton').addEventListener('click', buyHint); // Add event listener for "Buy a Hint" button
    document.querySelector('.genButton').addEventListener('click', function () {
        loadRandomWord();            
    });        
    document.querySelector('.genHintButton').addEventListener('click', function () {
        buyHint();            
    });
});
     // Load player data from local storage
players = JSON.parse(localStorage.getItem('players')) || []; 

   // Add this section to your JavaScript
 
   function viewScoreboard() {
    const scoreboardContainer = document.getElementById('scoreboardContainer');
    const scoreboardList = document.getElementById('scoreboardList');

    // Clear existing entries
    scoreboardList.innerHTML = '';

    // Sort players by score in descending order
    const sortedPlayers = players.slice().sort((a, b) => b.score - a.score);

    // Display only the top 10 players
    const topPlayers = sortedPlayers.slice(0, 10);

    // Logic to populate the scoreboard from your data (you may need to modify this)
    topPlayers.forEach(player => {
        const listItem = document.createElement('li');
        listItem.classList.add('scoreboardItem');

        const playerName = document.createElement('span');
        playerName.classList.add('name');
        playerName.textContent = player.name;

        const playerScore = document.createElement('span');
        playerScore.classList.add('score');
        playerScore.textContent = player.score;

        listItem.appendChild(playerName);
        listItem.appendChild(playerScore);

        scoreboardList.appendChild(listItem);
    });

    // Show the scoreboard
    scoreboardContainer.style.display = 'block';


var abCwidth = scoreboardContainer.offsetWidth;
    var abCheight = scoreboardContainer.offsetHeight;

}

function updatePlayerScore(pointsToAdd) {


const scoreLabel = document.getElementById('currentPlayerScoreLabel');

if (scoreLabel) {
    const currentPlayerName = document.getElementById('currentPlayerNameLabel').textContent.trim();
    const currentPlayer = players.find(player => player.name === currentPlayerName);

    if (currentPlayer) {
        const currentScore = currentPlayer.score;
        const newScore = currentScore + pointsToAdd;

        currentPlayer.score = newScore;

        scoreLabel.textContent = ` ${newScore}`;
       

        // Save the updated player list to local storage
        savePlayers(players);
    }
}
}


function updatePlayerList(playerName, playerScore) {
const currentPlayer = players.find(player => player.name === playerName);

if (currentPlayer) {
    currentPlayer.score = playerScore;

    // Save the updated player list to local storage
    savePlayers(players);

}
}
function closeScoreboard() {
const scoreboardContainer = document.getElementById('scoreboardContainer');

// Hide the scoreboard
scoreboardContainer.style.display = 'none';
}

    function initializeGame() {
        document.getElementById('playerNameInput').focus();
        console.log('Start Game button clicked!');
    }
    function isValidPlayerName(name) {
        // Validate player name (for example, must not be empty)
        return name.trim() !== '';
    }
    
    function isValidNewWord(word) {
        // Validate new word (for example, must contain only letters)
        const lettersOnlyRegex = /^[A-Za-z]+$/;
        return lettersOnlyRegex.test(word);
    }

    let currentRandomWord = '';
    let buttons = [];
    let positionContainer = document.getElementById('positionContainer');
    let positionLabels = [];
    let winnerContainer = document.getElementById('winnerContainer');
    let LetterCount = 0;
    let misses = 0; // Add misses variable
    const maxMisses = 5; // Set maximum number of misses

    function startGame(event) {
        event.preventDefault();
        winnerContainer2.style.display = 'none';
        const playerNameInput = document.getElementById('playerNameInput');
        const playerName = playerNameInput.value.trim().toUpperCase();
    
        if (!playerName) {
            alert('Please enter a valid player name to start the game.');
            playerNameInput.focus(); // Set focus back to the input for a better user experience
            return;              
        }
        loadRandomWord();
        let existingPlayer = players.find(player => player.name === playerName);
    
        if (!existingPlayer) {
            existingPlayer = { name: playerName, score: 100 };
            players.push(existingPlayer);
            localStorage.setItem('players', JSON.stringify(players));
            console.log('New player added locally:', playerName);

            // Set the score label for the new player
            const scoreLabel = document.getElementById('currentPlayerScoreLabel');
            if (scoreLabel) {
                scoreLabel.textContent = ` ${existingPlayer.score}`;
                console.log(`Player score loaded: ${existingPlayer.score}`);
            }
        } else {
            console.log('Existing player found locally:', playerName);
            const scoreLabel = document.getElementById('currentPlayerScoreLabel');
            if (scoreLabel) {
                scoreLabel.textContent = ` ${existingPlayer.score}`;
                console.log(`Player score loaded: ${existingPlayer.score}`);
            }
        }
        
    
        removeStartElements(); // Remove start elements for both cases
    
        document.getElementById('currentPlayerNameLabel').textContent = ` ${playerName}`;
    
        initializeAlphabetButtons(); // Initialize alphabet buttons
    }      
  
    const maximumPlayers = 10;  // Set the maximum number of players

    // Function to add a new player to the players array
    function addPlayer(player) {
        players.push(player);
    
        // Remove the oldest players if the limit is reached
        if (players.length > maximumPlayers) {
            const excessPlayers = players.length - maximumPlayers;
            players.splice(0, excessPlayers);
        }
    
        // Save the updated players to local storage
        savePlayers();
    }
    
    // Function to save players to local storage
    function savePlayers() {
        const topPlayers = players.slice(0, 30); // Get only the top 10 players
        localStorage.setItem('players', JSON.stringify(topPlayers));
    }
    
    // Function to load players from local storage
    function loadPlayers() {
        players = JSON.parse(localStorage.getItem('players')) || [];
    }

    function loadWords() {
        const savedWords = localStorage.getItem('capitalizedWords');

        if (savedWords) {
            return JSON.parse(savedWords);
        } else {
            return [];
        }
    }        

    function saveWords(words) {
        localStorage.setItem('capitalizedWords', JSON.stringify(words));
    }

    const wordsToSave = ['CANDY (SWEET)', 'TREAT (YUMMY FOOD)', 'YELLOW (A COLOR)', 'KING (THE QUEEN\'S HUSBAND)'];

    // Load words from local storage
let savedWords = loadWords();

// Filter out words that are not capitalized
savedWords = savedWords.filter(word => isCapitalized(word));

// Save the updated array to local storage
saveWords(savedWords);

// Function to check if a word is capitalized
function isCapitalized(word) {
return word.charAt(0) === word.charAt(0).toUpperCase();
}


    if (savedWords.length === 0) {
        savedWords = wordsToSave;
        saveWords(savedWords);
    }

    console.log('Loaded Words:', savedWords);

    function getCurrentWordHint() {

        // Retrieve the current word from the UI
        const currentWord = document.getElementById('randomWord').textContent;
        
        // Iterate through the savedWords array to find the current word
        for (let i = 0; i < savedWords.length; i++) {
            const [word, hint] = savedWords[i].split(' ');
            if (word === currentWord) {
                return hint; // Return the hint for the current word
            }
        }
        
        // If the current word is not found, return a placeholder hint
        return "No hint available for this word.";
    }
    
         
    function resetGame() {
        buttons.forEach(button => {

            button.classList.remove('found', 'not-found');
            button.disabled = false;

            misses = 0;
            winnerContainer2.style.display = 'none';
        });

        positionLabels = Array.from({ length: currentRandomWord.length }, () => {
            const label = document.createElement('span');
            label.textContent = '_';
            label.classList.add('underscore-label');
            return label;
        });

        positionContainer.innerHTML = '';
        positionLabels.forEach(label => positionContainer.appendChild(label));

        LetterCount = 0;
        misses = 0;
        document.getElementById('LetterCountLabel').textContent = 'Letter Count: 0';
        winnerContainer.style.display = 'none';

    }       
        
    document.addEventListener('DOMContentLoaded', function() {
        const modalContainer = document.getElementById('modalContainer');
        const sadFaceImg = document.getElementById('sadFace');
        const lostWordMessage = document.getElementById('lostWordMessage');
        const closeBtn = document.querySelector('.close-btn');
    
        // Check if the sad face GIF is stored in local storage
        const storedGif = localStorage.getItem('sadFaceGif');
    
        if (storedGif) {
            // If the GIF is found in local storage, set it as the source
            sadFaceImg.src = storedGif;
        } else {
            // If not found, load it from the server
            sadFaceImg.src = 'lost.gif';
            
            // Store the GIF in local storage for future use
            sadFaceImg.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = sadFaceImg.width;
                canvas.height = sadFaceImg.height;
                ctx.drawImage(sadFaceImg, 0, 0);
                const dataURL = canvas.toDataURL();
                localStorage.setItem('sadFaceGif', dataURL);
            };
        }
    
        // Close the modal when the close button is clicked
        closeBtn.addEventListener('click', function() {
            modalContainer.style.display = 'none';            

        // Show the scoreboard
        
        viewScoreboardButton.style.display = 'block';

        // Hide the missesLabel
        const missesLabel = document.getElementById('missCountLabel');
        missesLabel.style.display = 'block';

        });
    
    });
    // Function to show the modal when the player loses
    function showLose() {          
        const modalContainer = document.getElementById('modalContainer');
        const sadFaceImg = document.getElementById('sadFace');
        const lostWordMessage = document.getElementById('lostWordMessage');
        
     // Hide the missesLabel
     const missesLabel = document.getElementById('missCountLabel');
     missesLabel.style.display = 'none';
    
     // hide the scoreboard
     viewScoreboardButton.style.display = 'none';

        // Set the source of the sad face GIF
        sadFaceImg.src = 'lost.gif';
        
        // Set the message with the lost word
        lostWordMessage.textContent = `You lose! The word was: ${currentRandomWord}`;
       
        // Display the modal
        modalContainer.style.display = 'block';

        const closeButton = document.querySelector('.close-btn');
        closeButton.style.display = 'block';
    
        // Reset the game and load a new random word
        resetGame();
        loadRandomWord();
    }
  
    function checkForWin() {
        if (LetterCount === currentRandomWord.length) {
            showWinner();
            document.getElementById('face1').style.display = 'block';
            document.getElementById('face2').style.display = 'block';
            document.getElementById('congratulations').style.display = 'block';
            document.querySelector('.genButton').style.display = 'block';
            document.getElementById('hintLabel').style.display = 'none';
            document.getElementById('hintButton').style.display = 'none'; 

            // Update player list
            updatePlayerList(document.getElementById('currentPlayerNameLabel').textContent.trim(), parseInt(document.getElementById('currentPlayerScoreLabel').textContent.trim(), 10));
        } else {
            document.getElementById('congratulations').style.display = 'none';           
        }
    // Update player score and call the function to update the player list
updatePlayerScore(10);  // Replace 10 with the actual points to be added
updatePlayerList(document.getElementById('currentPlayerNameLabel').textContent.trim(), parseInt(document.getElementById('currentPlayerScoreLabel').textContent.trim(), 10));

    }

    function findIndexesOfLetter(word, letter) {
        const indexes = [];
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                indexes.push(i);
            }
        }
        return indexes;
    }

    function showWinner() {
        winnerContainer.style.display = 'block';
        winnerContainer.focus();
        winnerContainer2.style.display = 'block';
    }

    function removeStartElements() {
        // Remove unwanted elements from the DOM
        const playerNameInput = document.getElementById('playerNameInput');
        const playerNameLabel = document.querySelector('label[for="playerNameInput"]');
        const startGameButton = document.getElementById('startGameButton');
    
        if (playerNameInput) playerNameInput.remove();
        if (playerNameLabel) playerNameLabel.remove();
        if (startGameButton) startGameButton.remove();
    }
  // Increment misses and check for loss
  function incrementMisses() {
    const maxMisses = Math.min(5, Math.floor(currentRandomWord.length * 0.1)); // Maximum 5 misses or 10% of word length
    const missesLabel = document.getElementById('missCountLabel');

    misses++;

    if (misses >= maxMisses) {
        document.getElementById('searchResult').textContent = `Search Result: You lost!`;
        missesLabel.textContent = `Misses: ${maxMisses}`;
        resetGame();     
    } else {
        missesLabel.textContent = `Misses: ${misses}`;
    }
}

function initializeAlphabetButtons() {
    // Generate buttons for the entire alphabet
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var buttonContainer = document.getElementById("button-container");

    [...alphabet].forEach(letter => {
        var button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("alphabet-button"); // Add class to button
        buttons.push(button);
        button.addEventListener("click", function () {
            handleButtonClick(letter, button);
        });
        buttonContainer.appendChild(button);
    });
}

// Function to handle button click
function handleButtonClick(letter, button) {
    if (currentRandomWord) {
        const foundIndexes = findIndexesOfLetter(currentRandomWord, letter);
        if (foundIndexes.length > 0) {
            document.getElementById('searchResult').textContent = 'Search Result: Letter found';
            button.classList.add('found');
            button.disabled = true;
           
            foundIndexes.forEach(index => {
                positionLabels[index].textContent = currentRandomWord[index];
            });

            LetterCount += foundIndexes.length;
            document.getElementById('LetterCountLabel').textContent = `Letter Count: ${LetterCount}`;

            // Add points to the player's score
            updatePlayerScore(10); // You can adjust the points as needed

            checkForWin();

            // Show and reset the GIF when a letter is found
            var imageContainerGame = document.getElementById('image-container-game');
            var gifImage = document.getElementById('gif-image');

            // Store the original source
            var originalSrc = gifImage.src;

            // Change the source to a placeholder to force reset
            gifImage.src = '';
     
setTimeout(function() {
    gifImage.src = originalSrc;
    imageContainerGame.style.display = 'block';

    // Hide the GIF after a longer duration (e.g., 3500 milliseconds)
    setTimeout(function() {
        imageContainerGame.style.display = 'none';    

        // Enable alphabet buttons again after the GIF is hidden
        enableAlphabetButtons();
    }, 3500); // Adjust this to the desired duration
}, 10); // A small delay to ensure the source change takes effect

// Disable alphabet buttons while GIF is playing
disableAlphabetButtons(true);


        } else {
            document.getElementById('searchResult').textContent = 'Search Result: Letter not found';
            button.classList.add('not-found');
            button.disabled = true;

            // Increase misses when a wrong letter is clicked
            misses++;
            document.getElementById('missCountLabel').textContent = `Misses: ${misses}`;

            // Check for losing condition
            if (misses >= maxMisses) {
                showLose();
            }
        }
    }
}

// Function to enable all alphabet buttons
function enableAlphabetButtons() {
    const alphabetButtons = document.querySelectorAll('.alphabet-button');
    alphabetButtons.forEach(button => {
        button.disabled = false;
    });
}

// Function to disable/enable all alphabet buttons
function disableAlphabetButtons(disable) {
    const alphabetButtons = document.querySelectorAll('.alphabet-button');
    alphabetButtons.forEach(button => {
        button.disabled = disable;
    });  
}


// Add event listener for the "Add Word" button
document.getElementById('addWordButton').addEventListener('click', function () {
addNewWord();
});
// Function to check if a word is valid (contains only letters)
function isValidWord(word) {
const lettersOnlyRegex = /^[A-Za-z]+$/;
return lettersOnlyRegex.test(word);
}

function isValidWord(hint) {
const lettersOnlyRegex = /^[A-Za-z]+$/;
return lettersOnlyRegex.test(hint);
}

document.getElementById('closeWordListButton').addEventListener('click', toggleWordList);

function toggleWordList() {
const manageWordsDiv = document.getElementById('manageWords');
const isWordListVisible = manageWordsDiv.style.display === 'block';

if (isWordListVisible) {
    manageWordsDiv.style.display = 'none';
} else {
    manageWordsDiv.style.display = 'block';

    // Call the function to display the list of words
    displayWordsList();
}
}


        // Event listener for the exit button
        document.getElementById('exitButton').addEventListener('click', closeScoreboard);



document.getElementById('viewScoreboardButton').addEventListener('click', toggleScoreboard);

   // JavaScript code to handle login button click event
   document.getElementById('viewScoreboardButton').addEventListener('click', function(event) {
    event.preventDefault();
    // Add your code here to collect user info and store it in local storage
     
});


function toggleScoreboard() {
const scoreboardContainer = document.getElementById('scoreboardContainer');
const isScoreboardVisible = scoreboardContainer.style.display === 'block';

if (isScoreboardVisible) {
    scoreboardContainer.style.display = 'none';
} else {
    scoreboardContainer.style.display = 'block';

    // Call the function to populate and display the scoreboard
    viewScoreboard();
}
}

function closeWordList() {
const manageWordsDiv = document.getElementById('manageWords');
manageWordsDiv.style.display = 'none';
}

// Function to add a new word to the list and local storage
function addNewWord() {
const newWordInput = document.getElementById('newWordInput');
const newWord = newWordInput.value.trim().toUpperCase();
const newHintInput = document.getElementById('newHintInput');
const newHint = newHintInput.value.trim().toUpperCase(); // Get the hint as a single string

if (isValidWord(newWord)) {
    // Check if the word already exists
    if (!savedWords.includes(newWord)) {
        // Concatenate word and hint with a space
        const wordWithHint = `${newWord} ${newHint}`;

        // Add the new word to the array and save to local storage
        savedWords.push(wordWithHint);
        saveWords(savedWords);

        // Log success and update the word list
        console.log(`Word "${newWord}" with hint "${newHint}" added successfully.`);
        console.log('Updated Words:', savedWords);

        // Clear the input fields
        newWordInput.value = '';
        newHintInput.value = '';

        // Update the displayed word list
        displayWordsList();
    } else {
        // Log error if the word already exists
        console.error(`Word "${newWord}" already exists.`);
    }
} else {
    // Log error if the word is not valid
    console.error(`Invalid word: "${newWord}". Please enter a valid word containing only letters.`);
}
}

function displayWordsList() {
    const manageWordsDiv = document.getElementById('manageWords');
    manageWordsDiv.style.display = 'block';

    // Retrieve and display the list of words
    const wordsList = document.getElementById('wordsList');
    wordsList.innerHTML = ''; // Clear existing list items

    savedWords.forEach(wordWithHint => {
        // Split the word and hint
        const [word, ...hintArray] = wordWithHint.split(' ');
        const hint = hintArray.join(' '); // Reconstruct hint including spaces between words

        // Create list item for word with hint
        const wordListItem = document.createElement('li');
        wordListItem.textContent = `${word} (${hint})`; // Display word and hint
        wordListItem.classList.add('word-item');

        // Add a click event listener to each word for deletion
        wordListItem.addEventListener('click', function () {
            deleteWord(wordWithHint);
            // Refresh the displayed list after deletion
            displayWordsList();
        });

        wordsList.appendChild(wordListItem);
    });
}


// Function to delete a word from the list and local storage
function deleteWord(word) {
const index = savedWords.indexOf(word);

if (index !== -1) {
    // Remove the word from the array
    savedWords.splice(index, 1);

  // Save the updated array to local storage
saveWords(savedWords);

// Update the display
displayWordsList();
}
}

function loadRandomWord() {
try {
    const randomIndex = Math.floor(Math.random() * savedWords.length);
    const randomWordWithHint = savedWords[randomIndex];
    const [randomWord, ...hintArray] = randomWordWithHint.split(' '); // Split the word and hint
    const hint = hintArray.join(' '); // Reconstruct hint including spaces between words
    hintPurchased = false;

    document.getElementById('randomWord').textContent = randomWord;
    currentRandomWord = randomWord;
    document.querySelector('.genButton').style.display = 'none';
    // Store the current hint
    currentHint = hint;

    // Display the full hint
    document.getElementById('hintLabel').textContent = hint;
    document.getElementById('hintLabel').style.display = 'none'; // Show the hint label
    document.getElementById('hintButton').style.display = 'block'; // Hide the "Buy a Hint" button
 
    const wordLength = randomWord.length;
    document.getElementById('wordLengthLabel').textContent = wordLength;

    resetGame();
} catch (error) {
    console.error('Error loading random word:', error);
}
}


let hintPurchased = false; // Initialize a flag to track hint purchases

function buyHint() {
try {
    // Check if a hint has already been purchased
    if (!hintPurchased) {
        // Deduct points from player for using hint
        updatePlayerScore(-10); // Deduct 10 points

        // Set the flag to indicate that a hint has been purchased
        hintPurchased = true;

        // Display the current hint in the label
        document.getElementById('hintLabel').textContent = currentHint;
        document.getElementById('hintLabel').style.display = 'block'; // Show the hint label
        document.getElementById('hintButton').style.display = 'none'; // Hide the "Buy a Hint" button
        document.querySelector('.genButton').style.display = 'none';

        console.log('Hint purchased successfully.');
    } else {
        console.log('Hint already purchased.');
    }
} catch (error) {
    console.error('Error buying hint:', error);
}
}

// Event listener for the button to show updatehint for the current word
document.getElementById('hintButton').addEventListener('click', function () {

const hintElement = document.getElementById('hintLabel');


// Hide the "Buy a Hint" button
document.getElementById('hintButton').style.display = 'none';
});

console.log('Script executed!');