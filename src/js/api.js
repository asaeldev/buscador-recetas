// Aquí podemos escribir todas las funciones que necesiten llamar a la API para traer información
import config from "./config";

const getMealsByName = async (mealName) => {
  try {
    const response = await fetch(`${config.API_URL}search.php?s=${mealName}`);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};

const getMealsByFirstLetter = async (firstLetter) => {
  try {
    const response = await fetch(
      `${config.API_URL}search.php?f=${firstLetter}`
    );
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};

const getRandomRecipe = async () => {
  try {
    const response = await fetch(`${config.API_URL}random.php`);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};

export { getMealsByName, getMealsByFirstLetter, getRandomRecipe };
