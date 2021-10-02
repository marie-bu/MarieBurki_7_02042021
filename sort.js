// 1) create arrays :

// relative to search inputs
const ListboxSearchInputs = [];
ListboxSearchInputs.push(searchIngredients, searchAppareil, searchUstensiles);

// relative to recipes
let recipesToFilter = recipes;
let recipesToKeep = [];
let recipesFilteredBySearchbar = [];

// relative to listboxes
let itemsToFilter = [];
let itemsToDisplay = [];
let itemsToHide = [];

// create an object to keep search results, to allow return when deleting letter(s) without filter recipes again
const searchResults = {};

// 2) filter functions for main search

function filterRecipes(searchEntry) {
    // empty array to keep
    recipesToKeep = [];

    // filter through recipe description, title and ingredients
    for (let i=0; i<recipesToFilter.length; i++) {
        if (recipesToFilter[i].description.toLowerCase().indexOf(searchEntry) != -1
            || recipesToFilter[i].name.toLowerCase().indexOf(searchEntry) != -1
            || recipesToFilter[i].ingredients.some(x => x.ingredient.toLowerCase().indexOf(searchEntry) != -1)) {
            recipesToKeep.push(recipesToFilter[i]);
        }
    }

    // refresh the DOM
    appendDataRecipes(recipesToKeep);
    // let the recipes to be filtered on next keyup to be ONLY the already filtered recipes we keep
    recipesToFilter = recipesToKeep;
}

function filterListboxes() {
    // empty set for listbox
    ingSet = new Set();
    appSet = new Set();
    ustSet = new Set();

    listedItems = [];

    // refresh the listbox content with the filtered recipes content
    appendDataLists(recipesToKeep, ingSet, listIngredient);
    appendDataLists(recipesToKeep, appSet, listAppareil);
    appendDataLists(recipesToKeep, ustSet, listUstensile);
}

searchBarInput.addEventListener("keyup", (input) => {

    let searchEntry = input.target.value.toLowerCase();

    // lauching search if user adds a character and input is at least 3 characters long
    if (input.keyCode != 8 && searchEntry.length >= 3) {
        filterRecipes(searchEntry);
        appendDataRecipes(recipesToKeep);
        filterListboxes();
    }

    // launching search when user deletes a character
    if (input.keyCode == 8) {
        // 1) check if input was saved in searchResults, use the savec array to display data
        if (searchEntry in searchResults) {
            recipesToKeep = searchResults[searchEntry];
            appendDataRecipes(recipesToKeep);
            filterListboxes();
            recipesToFilter = recipesToKeep;
            delete searchResults[searchEntry];
        // 2) if it was not saved, filter all the recipes and display data
        } else {
            recipesToFilter = recipes;
            filterRecipes(searchEntry);
            filterListboxes();
        }
    }

    // Store recipes filtered by search bar, will be used on closing tag function
    recipesFilteredBySearchbar = recipesToKeep;
    // keep track of search result, for when a character is deleted
    searchResults[searchEntry] = recipesToKeep;

    // if there are no result, display alert message
    if (recipesToFilter.length === 0) {
        alertMessage.style.display = "block";
    }
});

// 3) filter fonctions for listboxes

function filterInOut (arrayToFilter, arrayToKeep, arrayToFilterOut, predicate) {
    for (let i=0; i<arrayToFilter.length; i++) {
        if (predicate(arrayToFilter[i])) {
            arrayToKeep.push(arrayToFilter[i]);
        } else {
            arrayToFilterOut.push(arrayToFilter[i]);
        }
    }
}

function displayListbox() {
    itemsToHide.forEach(item => item.style.display = "none");
    itemsToDisplay.forEach(item => item.style.display = "block");
};

ListboxSearchInputs.forEach((element) => {
    element.addEventListener("keyup", (input) => {
        // declare search bar and search entry
        let searchBar = input.target;
        let searchEntry = searchBar.value.toLowerCase();

        // empty arrays for filter functions
        itemsToFilter = [];
        itemsToDisplay = [];
        itemsToHide = [];

        // check which listbox is used, fill array to filter with the according elements, filter and refresh DOM
        switch(searchBar) {
            case searchIngredients:
                searchIngredients.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
            case searchAppareil:
                searchAppareil.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
            case searchUstensiles:
                searchUstensiles.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
        }
    })
});

// 4) Filter by tag (addEventListeners added on tag creation -> interface.js)

// When a tag is added

function filterByTag(el) {
    let itemContent = el.target.innerHTML.toLowerCase();
    filterRecipes(itemContent);
    filterListboxes();
};

// When a tag is removed

function filterOnClosedTag(el) {
    let activeTags = document.querySelectorAll(".active-tag");
    
    // if no entry was made in main search bar
    if (recipesFilteredBySearchbar.length === 0) {
        // and if there are some active tag, filter all recipes with remaining tag(s)
        if (activeTags.length > 0) {
            recipesToFilter = recipes;
            activeTags.forEach((tag)=> {
                filterRecipes(tag.innerText.toLocaleLowerCase());
                filterListboxes()
            });
        // but if no active tag, repopulate DOM with all recipes
        } else {
            appendDataRecipes(recipes);
            appendDataLists(recipes, ingSet, listIngredient);
            appendDataLists(recipes, appSet, listAppareil);
            appendDataLists(recipes, ustSet, listUstensile);
        }

    // if there has been an entry search on main search bar
    } else if (recipesFilteredBySearchbar.length > 0) {
        // and if there are some active tag, filter the recipes filtered by search bar with remaining tag(s)
        if (activeTags.length > 0) {
            recipesToFilter = recipesFilteredBySearchbar;
            activeTags.forEach((tag)=> {
                filterRecipes(tag.innerText.toLowerCase());
                filterListboxes()
            });
        // but if no active tag, repopulate DOM with recipes filtered by search bar
        } else {
            appendDataRecipes(recipesFilteredBySearchbar);
            appendDataLists(recipesFilteredBySearchbar, ingSet, listIngredient);
            appendDataLists(recipesFilteredBySearchbar, appSet, listAppareil);
            appendDataLists(recipesFilteredBySearchbar, ustSet, listUstensile);
        }
    }
};