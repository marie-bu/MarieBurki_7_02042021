// get DOM elements

const searchBarInput = document.querySelector(".search-input");
const searchTags = document.querySelector(".search-tags");

const recipesGrid = document.querySelector(".recipes-grid");

const expIngredient = document.querySelector(".expanded-ingredients");
const showIngredient = document.querySelector(".show-ingredients");
const listIngredient = document.querySelector(".listed-ingredients");
const expAppareil = document.querySelector(".expanded-appareil");
const showAppareil = document.querySelector(".show-appareil");
const listAppareil = document.querySelector(".listed-appareil");
const expUstensile = document.querySelector(".expanded-ustensiles");
const showUstensile = document.querySelector(".show-ustensiles");
const listUstensile = document.querySelector(".listed-ustensiles");

// preventDefault form
function prevent(event){
    event.preventDefault()
    searchBarInput.value = ""
};

// change units display
function unitDisplay(el){
    if (el.unit == "cuillères à soupe"){
        el.unit = " cuillères"
    }
    if (el.unit == "grammes"){
        el.unit = "g"
    }
    if (el.unit == undefined){
        el.unit = ""
    }
    if (el.quantity == undefined){
        el.quantity = ""
    }
}

// populate recipes cards
function appendDataRecipes() {
    for (i=0; i<recipes.length; i++) {
        recipesGrid.innerHTML += `
        <li class="recipe">
            <div class="recipe-img"></div>
            <div class="recipe-content">
                <div class="recipe-header">
                    <h2 class="recipe-title">`+recipes[i].name+`</h2>
                    <div class="recipe-time"><i class="far fa-clock"></i> `+recipes[i].time+` min</div>
                </div>
                <div class="recipe-details">
                    <p class="recipe-ingredients"></p>
                    <p class="recipe-directions">`+recipes[i].description+`</p>
                </div>
            </div>
        </li>`

        const recipeIngredients = document.querySelectorAll(".recipe-ingredients");

        Array.from(recipes[i].ingredients).forEach((ingredient)=>{
            unitDisplay(ingredient);
            recipeIngredients[i].innerHTML +=
                `<span class="item-ingredient">`+ingredient.ingredient+`:</span>
                <span class="item-quantity"> `+ingredient.quantity+ingredient.unit+`</span></br>`
        })
    }
};
appendDataRecipes();

// create set of data for listboxes
const ingSet = new Set;
const appSet = new Set;
const ustSet = new Set;

function populateSets() {
    for (recipe of recipes) {
        for (ingredient of recipe.ingredients){
            ingSet.add(ingredient.ingredient);
        }
        for (ust of recipe.ustensils){
            ustSet.add(ust)
        }
        appSet.add(recipe.appliance) 
    }
}
populateSets();

// populate listboxes
function appendDataLists(set, container) {
    set.forEach((element)=>{
        container.innerHTML += `<li class="listed-item">`+element+`</li>`;
    })
};
appendDataLists(ingSet, listIngredient);
appendDataLists(appSet, listAppareil);
appendDataLists(ustSet, listUstensile);

// open and close listboxes,
function openListbox(list, button) {
    list.style.display = "block";
    button.style.display = "none";
}

function closeListbox(list, button) {
    list.style.display = "none";
    button.style.display = "block";
}

// create tag
const listedItems = document.querySelectorAll(".listed-item"); 
const closeBtns = [];

function AddRemoveTag(e) {
    const clickedElement = e.target.innerHTML ;
    const clickedElementBg = window.getComputedStyle(e.target.parentNode).backgroundColor;
    // create div
    const tag = document.createElement("li");
    tag.classList.add("tag");
    tag.style.backgroundColor= clickedElementBg;
    tag.innerHTML= clickedElement+`<i class="far fa-times-circle"></i>`;
    searchTags.appendChild(tag);
    // add close tag onclick
    closeBtns.push(tag);
    closeBtns.forEach((closeBtn)=>{
        closeBtn.addEventListener("click", (el)=>{
        el.target.parentNode.style.display = "none";
        })
    })
}

listedItems.forEach((item)=>{
    item.addEventListener("click", (e)=>{
        AddRemoveTag(e)
    })
})