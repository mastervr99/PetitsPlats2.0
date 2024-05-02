import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);
});

function searchRecipes(searchTerms) {
    let results = [];

    recipes.forEach(recipe => {
        if (recipe.name.toLowerCase().includes(searchTerms.toLowerCase())) {
            results.push(recipe);
        } else {
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase().includes(searchTerms.toLowerCase())) {
                    results.push(recipe);
                }
            });
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