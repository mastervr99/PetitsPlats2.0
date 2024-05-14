import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');
let ingredientsOptionsContainer = document.querySelector('.ingredients-options-list');
let ustensilesOptionsContainer = document.querySelector('.ustensiles-options-list');
let appliancesOptionsContainer = document.querySelector('.appareils-options-list');

let ingredientsSet = new Set();  
let ustensilesSet = new Set();
let appliancesSet = new Set();

recipes.sort((a, b) => {
    let firstRecipeName = a.name.toUpperCase();
    let SecondRecipeName = b.name.toUpperCase();
    if (firstRecipeName < SecondRecipeName) {
        return -1;
    }
    if (firstRecipeName > SecondRecipeName) {
        return 1;
    }
    return 0;
});

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

displayRecipesCount();

let ingredientsArray = sortSetAlphabetically(ingredientsSet);
let appliancesArray = sortSetAlphabetically(appliancesSet);
let utensilsArray = sortSetAlphabetically(ustensilesSet);

function sortSetAlphabetically(set) {
    let array = Array.from(set);
    return array.sort((a, b) => {
        let firstValue = a.toUpperCase();
        let secondValue = b.toUpperCase();
        if (firstValue < secondValue) {
            return -1;
        }
        if (firstValue > secondValue) {
            return 1;
        }
        return 0;
    });
}

ingredientsArray.forEach(function(ingredient) {
    let li = createOptionElement(ingredient);
    ingredientsOptionsContainer.appendChild(li);
});

appliancesArray.forEach(function(ustensil) {
    let li = createOptionElement(ustensil);
    ustensilesOptionsContainer.appendChild(li);
});

utensilsArray.forEach(function(appliance) {
    let li = createOptionElement(appliance);
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

let searchInput = document.querySelector('.search_input');

searchInput.addEventListener('input', function(event) {
    event.preventDefault();

    let searchTerms = searchInput.value;
    let results = searchRecipes(searchTerms);
    let mainContainer = document.querySelector('.main_container');
    let existingMessage = mainContainer.querySelector('.not-found-message');

    recipeContainer.innerHTML = '';

    if(results.length > 0){
        
        if (existingMessage) {
            mainContainer.removeChild(existingMessage);
        }

        results.forEach(recipe => {
            let recipeCard = recipeTemplate(recipe);
            recipeContainer.appendChild(recipeCard);
        });
        
    } else {

        
        if(!existingMessage){
            let div = document.createElement('div');
            div.className = 'not-found-message';
            let p = document.createElement('p');
            p.textContent = `Aucune recette ne contient "${searchTerms}", vous pouvez chercher tarte aux pommes, poisson, etc.`;
            div.appendChild(p);
            mainContainer.appendChild(div);
        }
    }

    displayRecipesCount();
});

let filterTitles = document.querySelectorAll('.option-title');
filterTitles.forEach(function(title) {
    title.addEventListener('click', toggleOptions);

    document.addEventListener('click', function(event) {
        let isClickInside = title.parentNode.contains(event.target);
        if (!isClickInside) {
            closeFilterList(event, title);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeFilterList(event, title);
        }
    });
});

function toggleOptions() {
    let options = this.nextElementSibling;
    this.classList.toggle('opened');
    rotateArrow(this);

    while (options) {
        options.classList.toggle('hidden');
        options = options.nextElementSibling;
    }
}

function rotateArrow(optionTitle){
    let arrow = optionTitle.querySelector('.arrow');
    if (arrow.style.transform === 'rotate(180deg)') {
        arrow.style.transform = 'rotate(0deg)';
    } else {
        arrow.style.transform = 'rotate(180deg)';
    }
}

function closeFilterList(event, title) {
    let options = title.nextElementSibling;

    title.classList.remove('opened');
    let arrow = title.querySelector('.arrow');
    arrow.style.transform = 'rotate(0deg)';

    while (options) {
        options.classList.add('hidden');
        options = options.nextElementSibling;
    }
}

function createOptionElement(optionName) {
    let li = document.createElement('li');
    li.tabIndex = 0;
    li.className = 'filter-option hidden';
    li.setAttribute('aria-label', 'Trier par ' + optionName);
    li.textContent = optionName;
    return li;
}


let ingredientsSearchInput = document.querySelector('.ingredients_search_form input');
let appliancesSearchInput = document.querySelector('.appareils_search_form input');
let utensilsSearchInput = document.querySelector('.ustensils_search_form input');

ingredientsSearchInput.addEventListener('input', function(event) {
    searchComponent(event, ingredientsArray, '.ingredients-options-list');
});

appliancesSearchInput.addEventListener('input', function(event) {
    searchComponent(event, appliancesArray, '.appareils-options-list');
});

utensilsSearchInput.addEventListener('input', function(event) {
    searchComponent(event, utensilsArray, '.ustensiles-options-list');
});

function searchComponent(event, dataArray, listSelector) {

    event.preventDefault();
    let ul = document.querySelector(listSelector);
    resetList(listSelector, dataArray);

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
    } else {
        existingOptions.forEach(function(option) {
                ul.removeChild(option);
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
        let li = createOptionElement(data);
        li.classList.remove('hidden');
        ul.appendChild(li);
    });
}

function addTag(tagText) {
    let tags_list = document.querySelector(".filters-tags-list");
  
    let ul = tags_list.querySelector('ul');
    if (!ul) {
      ul = document.createElement('ul');
      tags_list.appendChild(ul);
    }
  
    let li = document.createElement('li');
    li.className = 'filter-tag';
    li.textContent = tagText;
  
    ul.appendChild(li);
  }
function displayRecipesCount() {
    let recettes = document.querySelectorAll('.card_recette');
    let nombreDeRecettes = recettes.length;
    let recetteCounter= document.querySelector('.recettes-count p');

    if(nombreDeRecettes > 1){
        recetteCounter.textContent = nombreDeRecettes + ' recettes';
    } else {
        recetteCounter.textContent = nombreDeRecettes + ' recette';
    }
}