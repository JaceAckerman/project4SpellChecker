let dictionary = []; // Global variable to hold the dictionary
const delta = 2;

// Asynchronously load the dictionary using fetch
async function loadDictionary() {
    const filePath = 'dictionary.txt'; // Ensure this path is correct
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text(); // Read the file content
        dictionary = data.split(/\s+/); // Split the file content into words
        console.log(dictionary); // This will log the dictionary array
    } catch (err) {
        console.error("Error reading file:", err);
        dictionary = [];
    }
}

// Call the loadDictionary function to load the dictionary when the page loads
window.onload = loadDictionary();

function isVowel(char){
    char = char.toLowerCase();

    return "aioue".includes(char);
}

function isConstantant(char){
    char = char.toLowerCase();

    //checks if the char matches the pattern of the regular expression and makes sure the character is not a vowel
    return /^[a-z]$/.test(char) && !isVowel(char);
}

// Function to calculate Levenshtein Distance (edit distance) between two words
function levenshteinDistance(word1, word2) {
    const n = word1.length;
    const m = word2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= n; i++) {
        matrix[i] = [i * delta];
    }
    for (let j = 0; j <= m; j++) {
        matrix[0][j] = j * delta;
     }

    // Compute edit distances
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            cost = 0;
            //if the characters match do nothing because cost is already 0
            if(word1[i-1]===word2[j-1]){
                cost = 0;
            }
            //if the characters are both constantants
            else if(isConstantant(word1[i-1]) && isConstantant(word2[j-1])){
                cost = 1;
            }
            //if the characters are both vowels
            else if(!isConstantant(word1[i-1]) && !isConstantant(word2[j-1])){
                cost = 1;
            }
            //if one character is a constants and one is a vowel
            else{
                cost = 3;
            }
            
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + delta,        // insert a gap on word1
                matrix[i][j - 1] + delta,        // insert a gap on word2
                matrix[i - 1][j - 1] + cost      // match the characters
            );
        }
    }

    return matrix[n][m];
}

// Function to suggest closest word from the dictionary
function suggestTopTenClosestWords(word) {
    let tenClosestWords = [];
    let tempDictionary = dictionary;

    for(i = 0; i < 10; i++){
        let closestWord = null;
        let minDistance = Infinity;
        tempDictionary.forEach(dictWord => {
            const distance = levenshteinDistance(word.toLowerCase(), dictWord.toLowerCase());
            if (distance < minDistance) {
                minDistance = distance;
                closestWord = dictWord;
            }
        });
        tenClosestWords.push(closestWord)
        tempDictionary = tempDictionary.filter(item => item !== closestWord)
    }

    return tenClosestWords;
}

// Function to display words on the webpage
function displayWords(words) {
    // Get the output element
    const outputDiv = document.getElementById("output");
    
    // Clear any existing content
    outputDiv.innerHTML = '';

    // Convert the array into a formatted string
    outputDiv.innerHTML = words.join('<br><br>');

    // Display the words in the output div
   // outputDiv.textContent = wordList;
}

// Function to check spelling of words in the text area
function checkSpelling() {
    const inputText = document.getElementById("textInput").value;
    const word = inputText;

   
    const tenClosestWords = suggestTopTenClosestWords(word);
    displayWords(tenClosestWords); 
        

}
