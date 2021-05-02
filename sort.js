// 1) create arrays :

// relative to search inputs
const ListboxSearchInputs = [];
ListboxSearchInputs.push(searchIngredients, searchAppareil, searchUstensiles);

// relative to recipes
let recipesToFilter = recipes;
let recipesToKeep = [];

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
    // keep track of search result, for when a character is deleted
    searchResults[searchEntry] = recipesToKeep;
}

function filterListboxes() {
    // empty set for listbox
    ingSet = new Set();
    appSet = new Set();
    ustSet = new Set();

    // refresh the listbox content with the filtered recipes content
    appendDataLists(recipesToKeep, ingSet, listIngredient);
    appendDataLists(recipesToKeep, appSet, listAppareil);
    appendDataLists(recipesToKeep, ustSet, listUstensile);
}

// to allow appendDataRecipes() to work when deleting a letter (otherwise, error, array undefined)
let recipesToDisplay = [];

searchBarInput.addEventListener("keyup", (input) => {

    let searchEntry = input.target.value.toLowerCase();

    switch(true) {
        // if a character is entered & entry is at least 3 characters long
        case searchEntry.length >= 3 && input.keyCode != 8 :
            filterRecipes(searchEntry);
            filterListboxes();
            break;
        // if a character is deleted & entry is at least 3 characters long
        // problème, enregistrement des search entry pas toujours correct, crée erreur et n'affiche rien en DOM
        case searchEntry.length >= 3 && input.keyCode == 8:
            // display recipes according to search entry, with result kept from former search
            recipesToKeep = searchResults[searchEntry];
            appendDataRecipes(recipesToKeep);
            filterListboxes();
            // update necessary arrays for next keyup
            recipesToFilter = recipesToKeep;
            delete searchResults[searchEntry];
            break;
        // if a character is deleted & entry is shorter than 3 characters
        case searchEntry.length < 3 && input.keyCode == 8:
            appendDataRecipes(recipes);
            filterListboxes();
            // update necessary arrays for next keyup
            recipesToFilter = recipes;
            delete searchResults[searchEntry];
            break;
        case recipesToKeep.length === 0 :
            alertMessage.style.display = "block";
            break;
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
        switch(true) {
            case searchBar == searchIngredients:
                searchIngredients.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
            case searchBar == searchAppareil:
                searchAppareil.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
            case searchBar == searchUstensiles:
                searchUstensiles.nextElementSibling.childNodes.forEach(item => itemsToFilter.push(item));
                filterInOut (itemsToFilter, itemsToDisplay, itemsToHide, (item) => item.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
                displayListbox();
                break;
        }
    })
});

// 3) search function for tags NOT FINISHED, DOES NOT WORK
let filteredOutByTag = [];

const conditionToMatch = {
    "BgColorIngredient": "rgb(50, 130, 247)",
    "BgColorAppareil": "rgb(104, 217, 164)",
    "BgColorUstensile": "rgb(237, 100, 84)"
}

const filteredByTag = {
    
}

window.addEventListener("click", (element)=>{
    // display tag and filter function, display recipes and listboxes accordingly
    if (element.target.className == "listed-item"){
        if (recipesToFilter.length != recipes.length) {
            AddRemoveTag(element)
        }

        let activeTag = element.target.innerHTML.toLowerCase();
        let activeTagNoSpace = activeTag.replace(/ /g, "");
        recipesToKeep = [];

        switch(true) {
            case element.target.parentNode.className == "listed listed-ingredients" :
                filterByTag(recipesToFilter, recipesToKeep, filteredOutByTag, (recipe) => recipe.ingredients.some(x => x.ingredient.toLowerCase().indexOf(activeTag) != -1));
                break;
            case element.target.parentNode.className == "listed listed-appareil" :
                filterByTag(recipesToFilter, recipesToKeep, filteredOutByTag, (recipe) => recipe.appliance.toLowerCase().includes(activeTag))
                break;
            case element.target.parentNode.className == "listed listed-ustensiles" :
                filterByTag(recipesToFilter, recipesToKeep, filteredOutByTag, (recipe) => recipe.ustensils.toLowerCase().includes(activeTag))
                break;
        }
        recipesToFilter = recipesToKeep;
        appendDataRecipes(recipesToKeep);
        filterListboxes()
        console.log(filteredByTag)
    }
    // add data which was filtered out by tag
    // fonctionne pas, créer array à chaque filtre par tag avec nom de l'activeTag
    if (element.target.className == "far fa-times-circle"){
        const closedTag = element.target.parentNode.toLowerCase();
        const closedTagNoSpace = closedTag.replace(/ /g, "");
        console.log(recipesToKeep)
        console.log(closedTagNoSpace)
        console.log(filteredByTag[closedTagNoSpace])
    }
});