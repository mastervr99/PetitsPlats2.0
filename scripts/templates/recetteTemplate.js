/**
 * Création du template de présentation de la recette
 * @param {*} data 
 * @returns 
 */
export function recipeTemplate(data) {
    const { id, name, image, time, description, ingredients } = data;
    const imgSrc = `./assets/images/les_petits_plats/${image}`;

    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'shadow-sm card_recette';

    const img = document.createElement('img');
    img.src = imgSrc;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = `${time}min`;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const h3 = document.createElement('h3');
    h3.textContent = name;

    const h4Recipe = document.createElement('h4');
    h4Recipe.textContent = 'RECETTE';

    const p = document.createElement('p');
    p.className = 'card-text';
    let maxLength = 5000;
    if (description.length > maxLength){
        p.textContent = description.substring(0, maxLength) + '...';
    } else {
        p.textContent = description;
    }

    const h4Ingredients = document.createElement('h4');
    h4Ingredients.textContent = 'INGREDIENTS';

    const ingredientsList = document.createElement('div');
    ingredientsList.className = 'ingredients-list';

    ingredients.forEach(ingredient => {
        let div = document.createElement('div');

        let pIngredient = document.createElement('p');
        pIngredient.textContent = ingredient.ingredient;

        let small = document.createElement('small');
        small.className = 'text-body-secondary';
        small.textContent = `${ingredient.quantity ? ingredient.quantity : ''}${ingredient.unit ? ingredient.unit : ''}`;

        div.appendChild(pIngredient);
        div.appendChild(small);

        ingredientsList.appendChild(div);
    });

    cardBody.appendChild(h3);
    cardBody.appendChild(h4Recipe);
    cardBody.appendChild(p);
    cardBody.appendChild(h4Ingredients);
    cardBody.appendChild(ingredientsList);

    card.appendChild(img);
    card.appendChild(timeSpan);
    card.appendChild(cardBody);

    col.appendChild(card);

    return col;
    
}