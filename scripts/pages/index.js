import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);
});

function searchRecipes(searchTerms) {
    let results = [];
    let searchTermsRegex = new RegExp(searchTerms.toLowerCase());

    recipes.forEach(recipe => {
        if (searchTermsRegex.test(recipe.name.toLowerCase())) {
            results.push(recipe);
        } else if (searchTermsRegex.test(recipe.description.toLowerCase())){
            results.push(recipe);
        } else {
            for (let ingredient of recipe.ingredients) {
                if (searchTermsRegex.test(ingredient.ingredient.toLowerCase())) {
                    results.push(recipe);
                    break;
                }
            }
        }
    });

    return results;
}

let searchForm = document.querySelector('.search_form');
let searchInput = document.querySelector('.search_input');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    let searchTerms = searchInput.value;
    let results = searchRecipes(searchTerms);

    recipeContainer.innerHTML = '';

    results.forEach(recipe => {
        let recipeCard = recipeTemplate(recipe);
        recipeContainer.appendChild(recipeCard);
    });
});