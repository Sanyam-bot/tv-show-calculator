const searchinput = document.getElementById('searchinput');
const searchresults = document.getElementById('searchresults');

// Whenever users inputs, calling API
searchinput.addEventListener('input', async function() {
    const searchterm = searchinput.value.trim(); //to delete the whitespace
    if (searchterm.length == 0) {
        searchresults.innerHTML = ''; //if the user inputs nothing, clear the searchresults and return
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=22e6b43cfea401143c0e88ecdec5c66e&query=${searchterm}`);
        if (!response.ok) {
            throw new Error("Didn't get any response from the API");
        }
        const data = await response.json();
        displaysearchresults(data);
    } catch (error) {
        console.error(error);
    }
});

// Function to display the search results
function displaysearchresults(data) {
    searchresults.innerHTML = '';
    // Condition for the suggestions
    number = 2
    if (data.results.length < number) {
        number = data.results.length;
    }
    for (let i = 0; i < number; i++) {
        // adding the suggestion to the innerHTML, which is a link to overlay data
        searchresults.innerHTML += `<li><a class="links" id="${data.results[i].id}" href="/calculate">${data.results[i].original_name}</a></li>`
    }
};

// To get the Id of the link, which user clicked
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('links')) {
        event.preventDefault();
        const id = event.target.getAttribute('id');
        document.getElementById('hiddenIdInput').value = id;
        document.getElementById('hiddenForm').submit();
    }
})


// to capitalize the first letter of every word
function capitalize() {
    var searchinput = document.getElementById('searchinput');
    var searchvalue = searchinput.value;

    if (searchvalue.length > 0) {
        let word = searchvalue.split(" ");

        // Iterate over each word
        for (let i = 0; i < word.length; i++) {
            word[i] = word[i].charAt(0).toUpperCase() + word[i].slice(1);
        }

        searchinput.value = word.join(" ");
    }
}
