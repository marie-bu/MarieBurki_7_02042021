// get DOM elements

const searchBarInput = document.querySelector(".search-input");
const searchTags = document.querySelector(".search-tags");
const searchIngredients = document.querySelector("#search-ingredients");
const searchAppareil = document.querySelector("#search-appareil");
const searchUstensiles = document.querySelector("#search-ustensiles");

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

const alertMessage = document.querySelector(".alert");

// preventDefault form
function prevent(event){
    event.preventDefault()
};

// change units display
function unitDisplay(el){
    if (el.unit == "cuillères à soupe"){
        el.unit = " cuillères"
    }
    if (el.unit == "cuillère à soupe"){
        el.unit = " cuillère"
    }
    if (el.unit == "cuillères à café"){
        el.unit = " cuillères"
    }
    if (el.unit == "cuillère à café"){
        el.unit = " cuillère"
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
function appendDataRecipes(array) {
    recipesGrid.innerHTML = "";
    for (i=0; i<array.length; i++) {
        recipesGrid.innerHTML += `
        <li class="recipe">
            <div class="recipe-img"></div>
            <div class="recipe-content">
                <div class="recipe-header">
                    <h2 class="recipe-title">`+array[i].name+`</h2>
                    <div class="recipe-time"><i class="far fa-clock"></i> `+array[i].time+` min</div>
                </div>
                <div class="recipe-details">
                    <p class="recipe-ingredients"></p>
                    <p class="recipe-directions">`+array[i].description+`</p>
                    <p class="recipe-hidden">`+array[i].appliance+`</p>
                    <p class="recipe-hidden">`+array[i].ustensils+`</p>
                </div>
            </div>
        </li>`

        const recipeIngredients = document.querySelectorAll(".recipe-ingredients");

        Array.from(array[i].ingredients).forEach((ingredient)=>{
            unitDisplay(ingredient);
            recipeIngredients[i].innerHTML +=
                `<span class="item-ingredient">`+ingredient.ingredient+`:</span>
                <span class="item-quantity"> `+ingredient.quantity+ingredient.unit+`</span>`
        })
    }
};

appendDataRecipes(recipes);

// create set of data for listboxes
let ingSet = new Set;
let appSet = new Set;
let ustSet = new Set;

// create array for tag creation on click (below)
let listedItems = [];

// populate listboxes
function appendDataLists(array, set, container) {
    container.innerHTML = "";

    array.forEach((recipe)=>{
        for (ingredient of recipe.ingredients){
            ingSet.add(ingredient.ingredient);
        }
        for (ust of recipe.ustensils){
            ustSet.add(ust)
        }
        appSet.add(recipe.appliance)
    });

    set.forEach((element)=>{ 
        const item = document.createElement("li");
        item.classList.add("listed-item");
        item.innerHTML= element;
        container.appendChild(item);
        item.addEventListener("click", (el)=> {
            createTag(el);
            filterByTag(el);
        });   
    });
};

appendDataLists(recipes, ingSet, listIngredient);
appendDataLists(recipes, appSet, listAppareil);
appendDataLists(recipes, ustSet, listUstensile);

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

function createTag(el) {
    const clickedElement = el.target.innerHTML ;
    const clickedElementBg = window.getComputedStyle(el.target.parentNode).backgroundColor;
    // create div
    const tag = document.createElement("li");
    tag.classList.add("tag", "active-tag");
    tag.style.backgroundColor= clickedElementBg;
    tag.innerHTML= clickedElement+`<i class="far fa-times-circle"></i>`;
    searchTags.appendChild(tag);
    // add close tag onclick
    let closeBtn = tag.querySelector("i");
    closeBtn.addEventListener("click", (el)=> {
        closeBtn.parentNode.classList.remove("active-tag");
        filterOnClosedTag(el);
    });
};