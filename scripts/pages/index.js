import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);
});

function searchRecipes(searchTerms) {
    let results = [];

    for (let i = 0; i < recipes.length; i++) {
        let recipe = recipes[i];

        if (recipe.name.toLowerCase().includes(searchTerms.toLowerCase())) {
            results.push(recipe);
        } else {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchTerms.toLowerCase())) {
                    results.push(recipe);
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

    results.forEach(recipe => {
        let recipeCard = recipeTemplate(recipe);
        recipeContainer.appendChild(recipeCard);
    });
});