// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const groceryInput = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = groceryInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    displayAlert("your item has been added", "alert-success");

    addToLocalStorage(id, value);

    createListItem(id, value);

    container.classList.add("show-container");

    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    editLocalStorage(editId, value);
    displayAlert("value changed", "alert-success");
    setBackToDefault();
  } else {
    displayAlert("please enter value", "alert-danger");
  }
}
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(action);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`${action}`);
  }, 1500);
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "alert-danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function setBackToDefault() {
  groceryInput.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) item.value = value;
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");

  element.setAttribute("data-id", id);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");

  editBtn.addEventListener("click", () => {
    editElement = element.querySelector(".title");
    groceryInput.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";

    editLocalStorage(editId, value);
  });

  deleteBtn.addEventListener("click", () => {
    list.removeChild(element);
    const id = element.dataset.id;
    if (list.children.length === 0)
      container.classList.remove("show-container");
    displayAlert("item removed", "alert-danger");

    removeFromLocalStorage(id);
  });
  list.appendChild(element);
}
