// create arrays of data and inputs

const listboxes = [];
const recipeDirections = [];
const searchInputs = [];

listedItems.forEach(item => listboxes.push(item))

document.querySelectorAll(".recipe-directions").forEach(recipe => recipeDirections.push(recipe));

searchInputs.push(searchIngredients, searchAppareil, searchUstensiles);

// search functions

let filteredBySearchBar = listboxes;
let filteredByListboxInput = listboxes;

// search fonction for main search bar
searchBarInput.addEventListener("keyup", (input)=>{
    let searchEntry = input.target.value.toLowerCase();
    filteredBySearchBar = listboxes.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);

    if (searchEntry.length >= 3){
        listboxes.forEach((x)=>{
            if (!filteredBySearchBar.includes(x)){
                x.style.display = "none"
            } else {
                x.style.display = "block"
            }
        })
    } else {
        listboxes.forEach(x => x.style.display = "block")
    }

    let filteredRecipes = recipeDirections.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
    recipeDirections.forEach((x)=>{
        if (!filteredRecipes.includes(x)){
            x.parentNode.parentNode.parentNode.style.display = "none";
        } else {
            x.parentNode.parentNode.parentNode.style.display = "block";
        }
    })
})

// search fonctions for listboxes
function sortListboxes(input, newArray, arrayToFilter) {
    let searchEntry = input.target.value.toLowerCase();
    newArray = arrayToFilter.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);

    if (searchEntry.length >= 3){
        arrayToFilter.forEach((x)=>{
            if (!newArray.includes(x)){
                x.style.display = "none"
            } else {
                x.style.display = "block"
            }
        })
    } else {
        arrayToFilter.forEach(x => x.style.display = "block")
    }
}

searchInputs.forEach((element)=>{
    element.addEventListener("keyup", (input)=>{
        if (filteredBySearchBar.length === listboxes.length) {
            sortListboxes(input, filteredByListboxInput, listboxes);
        } else {
            sortListboxes(input, filteredByListboxInput, filteredBySearchBar);
        }
    })
});