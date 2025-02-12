document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const wordInput = document.getElementById("word-input");
    const resultDiv = document.getElementById("result");

    let debounceTimer; 

    async function fetchWordMeaning(word) {
        if (!word) {
            displayError("Please enter a word.");
            return;
        }

        resultDiv.innerHTML = "<p>Loading...</p>";  // Show loading message

        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Word not found");

            const data = await response.json();

            const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
            const example = data[0]?.meanings[0]?.definitions[0]?.example || "No example available.";
            const synonyms = data[0]?.meanings[0]?.synonyms?.join(", ") || "No synonyms available.";

            updateUI(word, meaning, example, synonyms);
        } catch (error) {
            displayError(error.message);
            console.error("Fetch Error:", error);
        }
    }

    function updateUI(word, meaning, example, synonyms) {
        resultDiv.innerHTML = `
            <h3>${word}</h3>
            <p><strong>Meaning:</strong> ${meaning}</p>
            <p><strong>Example:</strong> ${example}</p>
            <p><strong>Synonyms:</strong> ${synonyms}</p>
        `;
    }

    function displayError(message) {
        if (message.includes("Failed to fetch")) {
            resultDiv.innerHTML = "<p style='color:red;'>Network error. Please try again later.</p>";
        } else {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${message}</p>`;
        }
    }

    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    wordInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            fetchWordMeaning(wordInput.value.trim());
        }
    });

    wordInput.addEventListener("input", function () {
        const word = this.value.trim();
        debounce(() => fetchWordMeaning(word), 500);
    });

    searchBtn.addEventListener("click", function () {
        fetchWordMeaning(wordInput.value.trim());
    });
});
