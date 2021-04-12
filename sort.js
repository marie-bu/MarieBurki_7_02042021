// create arrays of datas to compare

const listboxes = [];
const recipeDirections = [];

listedItems.forEach(item => listboxes.push(item))

document.querySelectorAll(".recipe-directions").forEach(recipe => recipeDirections.push(recipe));

// search functions

searchBarInput.addEventListener("keyup", (input)=>{

    const searchEntry = input.target.value.toLowerCase();

    if (searchEntry.length >= 3){
        let filteredListboxes = listboxes.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
        let filteredRecipes = recipeDirections.filter(x => x.innerHTML.toLowerCase().indexOf(searchEntry) != -1);
        listboxes.forEach((x)=>{
            if (!filteredListboxes.includes(x)){
                x.style.display = "none";
            } else {
                x.style.display = "block";
            }
        })
        recipeDirections.forEach((x)=>{
            if (!filteredRecipes.includes(x)){
                x.parentNode.parentNode.parentNode.style.display = "none";
            } else {
                x.parentNode.parentNode.parentNode.style.display = "block";
            }
        })
    }
});