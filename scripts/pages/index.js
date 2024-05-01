import { recipes } from "../../data/recipes.js";
import { recipeTemplate } from "../templates/recetteTemplate.js";

let recipeContainer = document.querySelector('.recettes-list-body');

recipes.forEach(recipe => {
    let recipeCard = recipeTemplate(recipe);
    recipeContainer.appendChild(recipeCard);
});
