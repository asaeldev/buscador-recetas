import { getMealsByName, getMealsByFirstLetter, getRandomRecipe } from "./api";
import { clearErrorMessage, showErrorMessage } from "./formHelpers";

const searchRecipe = async (event) => {
  const searchTerm = getSearchTerm();
  event.preventDefault();

  if (searchTerm.trim().length === 0) {
    showErrorMessage(
      "searchInput",
      "El término de búsqueda debe ser al menos de un carácter de longitud."
    );
    return;
  }

  try {
    const { meals: data } = await getMealsByName(searchTerm);
    if (data && data.length > 0) {
      clearErrorMessage("searchInput");
      saveMealsToLocal(data);
      refreshResults();
    } else {
      setSearchResults(
        renderMessage(
          "No se encontraron recetas para tu búsqueda, por favor intenta con una búsqueda diferente."
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchRandomRecipe = async (event) => {
  try {
    const randomRecipe = await getRandomRecipe();
    saveMealsToLocal(randomRecipe.meals.length > 0 ? randomRecipe.meals : []);
    refreshResults();
  } catch (error) {
    console.log(error);
  }
};

const readPaginationFromLocal = () => {
  const pagination = localStorage.getItem("pagination");
  return pagination
    ? JSON.parse(pagination)
    : { page: 1, totalPages: 1, itemsPerPage: 2 };
};

const resetPagination = () => {
  const pagination = readPaginationFromLocal();
  pagination.page = 1;
  pagination.totalPages = 1;
  savePaginationToLocal(pagination);
};

const savePaginationToLocal = (pagination) => {
  localStorage.setItem("pagination", JSON.stringify(pagination));
};

const saveMealsToLocal = (data) => {
  localStorage.setItem("meals", JSON.stringify(data));
};

const getMealsFromLocal = () => {
  const meals = JSON.parse(localStorage.getItem("meals"));
  return meals || [];
};

const getSearchTerm = () => {
  return document.getElementById("searchInput").value;
};

const setSearchResults = (results) => {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = results;
};

const setPagination = (paginationHtml) => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = paginationHtml;
};

const parseIngredients = (recipe) => {
  const ingredients = [];
  const validIngredients = Object.keys(recipe).filter(
    (property) => property.includes("strIngredient") && recipe[property]
  );
  validIngredients.forEach((ingredient) =>
    ingredients.push(recipe[ingredient])
  );

  return ingredients;
};

const renderMessage = (message, type = "warning") => {
  return `<div class="row">
  <div class="col">
    <div
      class="alert alert-${type} alert-dismissible fade show"
      role="alert"
    >
      <strong>Información: </strong> ${message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  </div>
</div>`;
};

const renderRecipes = () => {
  const data = getMealsFromLocal();
  let pagination = readPaginationFromLocal();
  const numberOfRecipes = data.length;
  const { itemsPerPage, page } = pagination;

  pagination.totalPages = Math.round(numberOfRecipes / itemsPerPage);
  const offset = page - 1;
  let recipesHtml = "";

  // console.log("Page:", page, "Offset:", offset);

  for (let i = offset; i < page; i++) {
    recipesHtml += `<div class="row">
        ${i * 2 < data.length ? renderRecipe(data[i * 2]) : ""}
    </div>
        ${
          i * 2 + 1 < data.length
            ? '<div class="row">' + renderRecipe(data[i * 2 + 1]) + "</div>"
            : ""
        }
    `;
  }

  savePaginationToLocal(pagination);
  return recipesHtml;
};

const renderPagination = () => {
  const { page, totalPages } = readPaginationFromLocal();

  return ` <div class="row">
    <div class="col">
      <nav>
        <ul class="pagination">
          <li class="page-item ${page == 1 ? "disabled" : ""}">
            <a onclick="window.previousPage(event)" class="page-link" href="#">Página anterior</a>
          </li>
          <li class="page-item ${totalPages == page ? "disabled" : ""}">
            <a onclick="window.nextPage(event)" class="page-link" href="#">Página siguiente</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>`;
};

const renderRecipe = (data) => {
  const ingredients = parseIngredients(data);
  const recipeTemplate = `<div class="col">
    <div class="card mt-1">
        <div class="card-header">
          ${data.strMeal}
        </div>
        <img  
          data-bs-toggle="collapse"
          data-bs-target="#recipeData${data.idMeal}"
          aria-expanded="false" 
          aria-controls="recipeData${data.idMeal}"
          src="${data.strMealThumb}"
          class="card-img-top recipe-image"
          alt="${data.strMeal}"
        />
        <div class="collapse" id="recipeData${data.idMeal}">
          <div class="card-body">
            <h5 class="card-title"><strong>${data.strMeal}</strong></h5>
            <div class="small">
                <p>
                <b>Instructions:</b>
                ${data.strInstructions}
                </p>
            </div>
          <div class="recipe-ingredients">
            <b><i class="bi-list-check"></i> Ingredients: </b>
            <ul class="small">
            ${ingredients
              .map((ingredient) => `<li>${ingredient}</li>`)
              .join("")}
            </ul>
           </div>
          </div>
        </div>
    </div>
  </div>`;

  return recipeTemplate;
};

const refreshResults = () => {
  setSearchResults(renderRecipes());
  setPagination(renderPagination());
};

const nextPage = (e) => {
  e.preventDefault();
  const pagination = readPaginationFromLocal();
  pagination.page += 1;
  savePaginationToLocal(pagination);
  refreshResults();
};

const previousPage = (e) => {
  e.preventDefault();
  const pagination = readPaginationFromLocal();
  pagination.page -= 1;
  savePaginationToLocal(pagination);
  refreshResults();
};

document.addEventListener("DOMContentLoaded", (event) => {
  const searchBtn = document.getElementById("searchBtn");
  const searchRandomRecipe = document.getElementById("searchRandomRecipe");

  searchBtn.addEventListener("click", searchRecipe);
  searchRandomRecipe.addEventListener("click", fetchRandomRecipe);
  resetPagination();
});

export { nextPage, previousPage };
