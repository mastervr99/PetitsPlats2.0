import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

class Recipe {
    constructor(data) {
        this.data = data;
        this.ingredientsSet = new Set();
        this.ustensilesSet = new Set();
        this.appliancesSet = new Set();

        this.sortRecipes();
        this.populateSets();
    }

    sortRecipes() {
        this.data.sort((a, b) => {
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
    }

    populateSets() {
        this.data.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => this.ingredientsSet.add(ingredient.ingredient.toLowerCase()));
            recipe.ustensils.forEach(ustensil => this.ustensilesSet.add(ustensil.toLowerCase()));
            this.appliancesSet.add(recipe.appliance.toLowerCase());
        });
    }

    getFilteredSets(filteredRecipes) {
        let ingredientsSet = new Set();
        let appliancesSet = new Set();
        let ustensilesSet = new Set();

        filteredRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient.toLowerCase()));
            recipe.ustensils.forEach(ustensil => ustensilesSet.add(ustensil.toLowerCase()));
            appliancesSet.add(recipe.appliance.toLowerCase());
        });

        return { ingredientsSet, appliancesSet, ustensilesSet };
    }
}

class Filter {
    constructor(selector, set) {
        this.ul = document.querySelector(selector);
        this.set = set;

        this.fillOptions();
    }

    fillOptions() {
        let setArray = this.sortSetAlphabetically(this.set);
        setArray.forEach(option => {
            let existingOption = Array.from(this.ul.children).find(child => child.textContent.toLowerCase() === option.toLowerCase());
            if (!existingOption) {
                let li = createOptionElement(option);
                this.ul.appendChild(li);
            }
        });
    }

    updateOptions() {
        let existingOptions = this.ul.querySelectorAll('.filter-option');

        existingOptions.forEach(option => {
            let optionData = option.textContent.toLowerCase();
            let isMatch = Array.from(this.set).some(function(setOption) {
                return setOption.toLowerCase() === optionData;
            });

            if (!isMatch) {
                this.ul.removeChild(option);
            }
        });

        let setArray = this.sortSetAlphabetically(this.set);
        setArray.forEach(option => {
            let isMatch = Array.from(existingOptions).some(function(existingOption) {
                return existingOption.textContent.toLowerCase() === option.toLowerCase();
            });

            if (!isMatch) {
                let li = createOptionElement(option);
                this.ul.appendChild(li);
            }
        });
    }

    sortSetAlphabetically(set) {
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
}

class Search {
    constructor(recipes) {
        this.recipes = recipes;
    }

    searchRecipes(searchTerms, activeFilters) {
        let results;
        let notFoundFilter;
        let recipeContainer = document.querySelector('.recettes-list-body');
        
        if (searchTerms) {
            results = this._filterRecipes(searchTerms);
        } else {
            results = recipes;
        }
    
        if(activeFilters){
            for (let i = 0; i < activeFilters.length; i++) {
                let filterText = activeFilters[i].textContent.toLowerCase();
                let filterType = activeFilters[i].parentNode.getAttribute('aria-label');
        
                let filteredResults = [];
                if (filterType === 'Trier par Ingrédients') {
                    filteredResults = results.filter(recipe => {
                        let ingredientsText = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
                        return ingredientsText.includes(filterText);
                    });
                } else if (filterType === 'Trier par Appareil') {
                    filteredResults = results.filter(recipe => {
                        let applianceText = recipe.appliance.toLowerCase();
                        return applianceText.includes(filterText);
                    });
                } else if (filterType === 'Trier par Ustensile') {
                    filteredResults = results.filter(recipe => {
                        let utensilsText = recipe.ustensils.map(utensil => utensil.toLowerCase());
                        return utensilsText.includes(filterText);
                    });
                }
            
                if (filteredResults.length > 0) {
                    results = filteredResults;
                } else {
                    results = [];
                    notFoundFilter = filterText;
                    break;
                }    
            }
        }    
    
        recipeContainer.innerHTML = '';
        let existingMessage = document.querySelector('.not-found-message');
        let mainContainer = document.querySelector('.main_container');
    
        if (existingMessage) {
            mainContainer.removeChild(existingMessage);
        }
    
        if(results.length > 0){

            let filteredSets = recipe.getFilteredSets(results);
            let ingredientsFilter = new Filter('.ingredients-options-list', filteredSets.ingredientsSet);
            let appliancesFilter = new Filter('.appareils-options-list', filteredSets.appliancesSet);
            let ustensilesFilter = new Filter('.ustensiles-options-list', filteredSets.ustensilesSet);

            ingredientsFilter.updateOptions();
            ustensilesFilter.updateOptions();
            appliancesFilter.updateOptions();

            results.forEach(recipe => {
                let recipeCard = recipeTemplate(recipe);
                recipeContainer.appendChild(recipeCard);
            });
    
        } else {
            
            if(!existingMessage){
                let div = document.createElement('div');
                div.className = 'not-found-message';
                let p = document.createElement('p');
                if(notFoundFilter){
                    p.textContent = `Aucune recette ne contient "${notFoundFilter}", vous pouvez chercher tarte aux pommes, poisson, etc.`;
                }else {
                    p.textContent = `Aucune recette ne contient "${searchTerms}", vous pouvez chercher tarte aux pommes, poisson, etc.`;
                }
                div.appendChild(p);
                document.querySelector('.main_container').appendChild(div);
            }
        }
    
        displayRecipesCount();
    }

    _filterRecipes(searchTerms){
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
}



let recipe = new Recipe(recipes);

let search = new Search(recipes);
search.searchRecipes();

displayRecipesCount();

let searchInput = document.querySelector('.search_input');

searchInput.addEventListener('input', function(event) {
    event.preventDefault();

    let searchTerms = searchInput.value;
    let activeFilters = Array.from(document.querySelectorAll('.filter-option.active'));

    search.searchRecipes(searchTerms, activeFilters);
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

let ingredientsSearchInput = document.querySelector('.ingredients_search_form input');
let appliancesSearchInput = document.querySelector('.appareils_search_form input');
let utensilsSearchInput = document.querySelector('.ustensils_search_form input');

ingredientsSearchInput.addEventListener('input', function(event) {
    searchComponent(event, recipe.ingredientsSet, '.ingredients-options-list');
});

appliancesSearchInput.addEventListener('input', function(event) {
    searchComponent(event, recipe.appliancesSet, '.appareils-options-list');
});

utensilsSearchInput.addEventListener('input', function(event) {
    searchComponent(event, recipe.ustensilesSet, '.ustensiles-options-list');
});

let filterLists = document.querySelectorAll('.dropdown-list-filter');
filterLists.forEach(list => {
    list.addEventListener('click', function(event) {
        let option = event.target;
        if (option.classList.contains('filter-option')) {
            option.classList.toggle('active');

            let searchTerms = searchInput.value;
            let activeFilters = Array.from(document.querySelectorAll('.filter-option.active'));

            if (option.classList.contains('active')) {
                addTag(option.textContent);
            } else {
                removeTag(option.textContent);
            }

            search.searchRecipes(searchTerms, activeFilters);
        }
    });
});




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

function addTag(tagText) {
    let tags_list = document.querySelector(".filters-tags-list");
  
    let ul = tags_list.querySelector('ul');
    if (!ul) {
      ul = document.createElement('ul');
      tags_list.appendChild(ul);
    }

    let existingTag = Array.from(ul.children).find(child => child.textContent === tagText);
    if (!existingTag) {
        let li = document.createElement('li');
        li.className = 'filter-tag';
        li.textContent = tagText;
        ul.appendChild(li);
    }
}

function removeTag(tagText) {
    let tags_list = document.querySelector(".filters-tags-list");
    let ul = tags_list.querySelector('ul');
    if (ul) {
        let tagToRemove = Array.from(ul.children).find(child => child.textContent === tagText);
        if (tagToRemove) {
            ul.removeChild(tagToRemove);
        }
    }
}

function resetList(listSelector, dataSet) {
    let ul = document.querySelector(listSelector);
    let options = ul.querySelectorAll('.filter-option');
    options.forEach(function(option) {
        ul.removeChild(option);
    });

    let dataArray = Array.from(dataSet).sort((a, b) => {
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

    dataArray.forEach(function(data) {
        let li = createOptionElement(data);
        li.classList.remove('hidden');
        ul.appendChild(li);
    });
}

function searchComponent(event, dataSet, listSelector) {
    event.preventDefault();
    let ul = document.querySelector(listSelector);
    resetList(listSelector, dataSet);

    let form = ul.querySelector('input[type="search"]');

    let searchValue = form.value;

    let matchingData = Array.from(dataSet).filter(function(data) {
        let regex = new RegExp(searchValue.toLowerCase());
        return regex.test(data.toLowerCase());
    });

    let existingOptions = ul.querySelectorAll('.filter-option');

    if(matchingData.length > 0){
        existingOptions = Array.from(existingOptions).sort((a, b) => {
            let firstValue = a.textContent.toUpperCase();
            let secondValue = b.textContent.toUpperCase();
            if (firstValue < secondValue) {
                return -1;
            }
            if (firstValue > secondValue) {
                return 1;
            }
            return 0;
        });
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