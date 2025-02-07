document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const searchBtn = document.getElementById("search-btn");
    const wordInput = document.getElementById("word-input");
    const resultDiv = document.getElementById("result");

    // Function to fetch dictionary data
    async function fetchWordMeaning() {
        const word = wordInput.value.trim();
        if (word === "") {
            resultDiv.innerHTML = "<p>Please enter a word.</p>";
            return;
        }

        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Word not found");

            const data = await response.json();

            const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
            const example = data[0]?.meanings[0]?.definitions[0]?.example || "No example available.";
            const synonyms = data[0]?.meanings[0]?.synonyms?.join(", ") || "No synonyms available.";

            resultDiv.innerHTML = `
                <h3>${word}</h3>
                <p><strong>Meaning:</strong> ${meaning}</p>
                <p><strong>Example:</strong> ${example}</p>
                <p><strong>Synonyms:</strong> ${synonyms}</p>
            `;
        } catch (error) {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
            console.error("Fetch Error:", error);
        }
    }

    // Add event listener to the button
    searchBtn.addEventListener("click", fetchWordMeaning);
});