// 1) create arrays :

// relative to search inputs
const ListboxSearchInputs = [];
ListboxSearchInputs.push(searchIngredients, searchAppareil, searchUstensiles);

// relative to recipes
let recipesToKeep = [];
let recipesToFilterAgain = [];

// relative to listboxes
let itemsToFilter = [];
let itemsToDisplay = [];
let itemsToHide = [];

// 2) filter functions 

function filterInOut (arrayToFilter, arrayToKeep, arrayToFilterOut, predicate) {
    for (let i=0; i<arrayToFilter.length; i++) {
        if (predicate(arrayToFilter[i])) {
            arrayToKeep.push(arrayToFilter[i]);
        } else {
            arrayToFilterOut.push(arrayToFilter[i]);
        }
    }
}

function filterIn (arrayToFilter, arrayToKeep, predicate) {
    for (let i=0; i<arrayToFilter.length; i++) {
        if (predicate(arrayToFilter[i])) {
            arrayToKeep.push(arrayToFilter[i]);
        }
    }
}

// 2) filter functions for main search

function filterRecipes(searchEntry) {
    // empty arrays
    recipesToKeep = [];
    recipesToFilterAgain = [];

    // filter through recipe description, divide into recipes to keep, recipes to filter again
    filterInOut (recipes, recipesToKeep, recipesToFilterAgain, (recipe)=>recipe.description.toLowerCase().indexOf(searchEntry) != -1);
    // filter through title and ingredients, using ONLY the recipes to filter again
    filterIn (recipesToFilterAgain, recipesToKeep, (recipe)=>recipe.name.toLowerCase().indexOf(searchEntry) != -1);
    filterIn (recipesToFilterAgain, recipesToKeep, (recipe)=>recipe.ingredients.some(x => x.ingredient.toLowerCase().indexOf(searchEntry) != -1));

    // refresh the DOM
    appendDataRecipes(recipesToKeep);
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

searchBarInput.addEventListener("keyup", (input) => {

    let searchEntry = input.target.value.toLowerCase();

    if (searchEntry.length >= 3) {
        filterRecipes(searchEntry);
        filterListboxes();
    // reset DOM when a character was deleted & search entry is less than 3 characters
    } else if (searchEntry.length == 2 && input.keyCode == 8) {
        appendDataRecipes(recipes);
        appendDataLists(recipes, ingSet, listIngredient);
        appendDataLists(recipes, appSet, listAppareil);
        appendDataLists(recipes, ustSet, listUstensile);
    }
    if (recipesToKeep.length === 0) {
        alertMessage.style.display = "block";
    }
});

// 3) filter fonctions for listboxes

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