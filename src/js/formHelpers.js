const showErrorMessage = (inputId, message) => {
  const input = document.getElementById(inputId);
  const inputErrorMsg = document.getElementById(`${inputId}Feedback`);
  input.classList.add("is-invalid");
  inputErrorMsg.innerText = message;
};

const clearErrorMessage = (inputId) => {
  const input = document.getElementById(inputId);
  const inputErrorMsg = document.getElementById(`${inputId}Feedback`);

  if (input.classList.contains("is-invalid"))
    input.classList.remove("is-invalid");

  inputErrorMsg.innerText = "";
};

export { showErrorMessage, clearErrorMessage };
