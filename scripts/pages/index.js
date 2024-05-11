import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');
let ingredientsOptionsContainer = document.querySelector('.ingredients-options-list');
let ustensilesOptionsContainer = document.querySelector('.ustensiles-options-list');
let appliancesOptionsContainer = document.querySelector('.appareils-options-list');

let ingredientsSet = new Set();  
let ustensilesSet = new Set();
let appliancesSet = new Set();

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);

    recipe.ingredients.forEach(function(ingredient) {
        ingredientsSet.add(ingredient.ingredient);
    });

    recipe.ustensils.forEach(function(ustensil) {
        ustensilesSet.add(ustensil);
    });

    appliancesSet.add(recipe.appliance);
});

ingredientsSet.forEach(function(ingredient) {
    var li = createOptionElement(ingredient);
    ingredientsOptionsContainer.appendChild(li);
});

ustensilesSet.forEach(function(ustensil) {
    var li = createOptionElement(ustensil);
    ustensilesOptionsContainer.appendChild(li);
});

appliancesSet.forEach(function(appliance) {
    var li = createOptionElement(appliance);
    appliancesOptionsContainer.appendChild(li);
});

function searchRecipes(searchTerms) {
    let results = [];
    let SearchTermsRegex = new RegExp(searchTerms.toLowerCase());

    for (let i = 0; i < recipes.length; i++) {
        let recipe = recipes[i];

        if (SearchTermsRegex.test(recipe.name.toLowerCase())) {
            results.push(recipe);
        } else if (SearchTermsRegex.test(recipe.description.toLowerCase())){
            results.push(recipe);
        } else {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (SearchTermsRegex.test(recipe.ingredients[j].ingredient.toLowerCase())) {
                    results.push(recipe);
                    break;
                }
            }
        }
    }

   

    return results;
}

let searchForm = document.querySelector('.search_form');
let searchInput = document.querySelector('.search_input');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let searchTerms = searchInput.value;
    let results = searchRecipes(searchTerms);

    recipeContainer.innerHTML = '';

    if(results.length > 0){
        results.forEach(recipe => {
            let recipeCard = recipeTemplate(recipe);
            recipeContainer.appendChild(recipeCard);
        });

        
    } else {
        let div = document.createElement('div');
        div.className = 'not-found-message';
        let p = document.createElement('p');
        p.textContent = `Aucune recette ne contient "${searchTerms}", vous pouvez chercher tarte aux pommes, poisson, etc.`;
        div.appendChild(p);
        let mainContainer = document.querySelector('.main_container');
        mainContainer.appendChild(div);
        
    }
});

var titles = document.querySelectorAll('.option-title');
titles.forEach(function(title) {
    title.addEventListener('click', toggleOptions);
});

function toggleOptions() {
    var options = this.nextElementSibling;
    this.classList.toggle('opened');
    
    while (options) {
        options.classList.toggle('hidden');
        options = options.nextElementSibling;
    }
}

function createOptionElement(optionName) {
    var li = document.createElement('li');
    li.tabIndex = 0;
    li.className = 'filter-option hidden';
    li.setAttribute('aria-label', 'Trier par ' + optionName);
    li.textContent = optionName;
    return li;
}

var ingredientsArray = Array.from(ingredientsSet);
var appliancesArray = Array.from(appliancesSet);
var utensilsArray = Array.from(ustensilesSet);

var ingredientsForm = document.querySelector('.ingredients_search_form');
var appliancesForm = document.querySelector('.appareils_search_form');
var utensilsForm = document.querySelector('.ustensils_search_form');

ingredientsForm.addEventListener('submit', function(event) {
    searchComponent(event, ingredientsArray, '.ingredients-options-list');
});
appliancesForm.addEventListener('submit', function(event) {
    searchComponent(event, appliancesArray, '.appareils-options-list');
});
utensilsForm.addEventListener('submit', function(event) {
    searchComponent(event, utensilsArray, '.ustensiles-options-list');
});

function searchComponent(event, dataArray, listSelector) {
    event.preventDefault();
    let ul = document.querySelector(listSelector);
    resetList(listSelector, ingredientsArray);

    let form = ul.querySelector('input[type="search"]');

    let searchValue = form.value;

    let matchingData = dataArray.filter(function(data) {
        let regex = new RegExp(searchValue.toLowerCase());
        return regex.test(data.toLowerCase());
    });

    let existingOptions = ul.querySelectorAll('.filter-option');

    if(matchingData.length > 0){
        existingOptions.forEach(function(option) {
            let optionData = option.textContent.toLowerCase();
        
            let isMatch = matchingData.some(function(data) {
                return data.toLowerCase() === optionData;
            });
        
            if (!isMatch) {
                ul.removeChild(option);
            }
        });
    }
}

function resetList(listSelector, dataArray) {
    let ul = document.querySelector(listSelector);
    let options = ul.querySelectorAll('.filter-option');
    options.forEach(function(option) {
        ul.removeChild(option);
    });

    dataArray.forEach(function(data) {
        var li = createOptionElement(data);
        li.classList.remove('hidden');
        ul.appendChild(li);
    });
}