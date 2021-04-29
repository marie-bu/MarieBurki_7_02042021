// create arrays :

// relative to search inputs
const ListboxSearchInputs = [];
ListboxSearchInputs.push(searchIngredients, searchAppareil, searchUstensiles);

// relative to recipes
let recipesToFilter = recipes;
let recipesToKeep = [];
let recipesToFilterAgain = [];

// filter function for main search

// create basic filter functions for callbacks
function filter (arrayToFilter, arrayToKeep, arrayToFilterOut, predicate) {
    for (let i=0; i<arrayToFilter.length; i++) {
        if (predicate(arrayToFilter[i])) {
            arrayToKeep.push(arrayToFilter[i])
        } else {
            arrayToFilterOut.push(arrayToFilter[i])
        }
    }
}

function filterAgain (arrayToFilter, arrayToKeep, predicate) {
    for (let i=0; i<arrayToFilter.length; i++) {
        if (predicate(arrayToFilter[i])) {
            arrayToKeep.push(arrayToFilter[i])
        }
    }
}

// create functions for the main search bar
function filterRecipes(searchEntry) {
    // empty arrays to filter
    recipesToKeep = [];
    recipesToFilterAgain = [];

    // filter recipes through their description, then filter again through title, then through ingredients
    filter (recipesToFilter, recipesToKeep, recipesToFilterAgain, (recipe) => recipe.description.toLowerCase().indexOf(searchEntry) != -1);
    filterAgain (recipesToFilterAgain, recipesToKeep, (recipe) => recipe.name.toLowerCase().indexOf(searchEntry) != -1);
    filterAgain (recipesToFilterAgain, recipesToKeep, (recipe) => recipe.ingredients.some(x => x.ingredient.toLowerCase().indexOf(searchEntry) != -1));

    // refresh the DOM and let the recipes to be filtered on next keyup to be ONLY the already filtered out recipes
    appendDataRecipes(recipesToKeep);
    recipesToFilter = recipesToKeep;
};

function filterListboxes() {
    // empty set for listbox
    ingSet = new Set;
    appSet = new Set;
    ustSet = new Set;

    // refresh the listbox content with the filtered recipes content
    appendDataLists(recipesToKeep, ingSet, listIngredient);
    appendDataLists(recipesToKeep, appSet, listAppareil);
    appendDataLists(recipesToKeep, ustSet, listUstensile);
}

searchBarInput.addEventListener("keyup", (input) => {
    let searchEntry = input.target.value.toLowerCase();
    // pas de retour en arrière possible, si faute de frappe, il faut recharger la page
    if (searchEntry.length >= 3) {
        filterRecipesFirstTime(searchEntry)
        filterListboxes()
    }
});

// search fonction for listboxes
// !!! à affiner, séparer pour chaque listbox

// arrays relative to listboxes
let filteredBySearchBar = [];
let filteredByListboxSearchBar = listedItems;

function narrowListboxes(newArray, arrayToFilter) {
    arrayToFilter.forEach((x) => {
        if (!newArray.includes(x)) {
            x.style.display = "none"
        } else {
            x.style.display = "block"
        }
    })
};

ListboxSearchInputs.forEach((element) => {
    element.addEventListener("keyup", (input) => {
        let searchEntry = input.target.value.toLowerCase();
        if (recipesToKeep.length === 0) {
            filteredByListboxSearchBar = listedItems.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
            narrowListboxes(filteredByListboxSearchBar, listedItems);
        } else {
            document.querySelectorAll(".listed-item").forEach(item => filteredBySearchBar.push(item))
            filteredByListboxSearchBar = filteredBySearchBar.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
            narrowListboxes(filteredByListboxSearchBar, filteredBySearchBar);
        }
    })
});

// search function for tags
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