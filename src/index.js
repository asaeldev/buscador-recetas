import "./scss/main.scss";
import * as bootstrap from "bootstrap";

import { getMealsByFirstLetter, getMealsByName } from "./js/api";

(async () => {
  let response = await getMealsByName("Arrabiata");
  console.log(response);

  response = await getMealsByFirstLetter("A");
  console.log(response);
})();
