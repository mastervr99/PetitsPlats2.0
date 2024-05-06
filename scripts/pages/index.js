import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);
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

    results.forEach(recipe => {
        let recipeCard = recipeTemplate(recipe);
        recipeContainer.appendChild(recipeCard);
    });
});