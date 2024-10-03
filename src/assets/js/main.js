import "../scss/style.scss";
import { createScene, initEventListeners } from "./init";
import handleModal from "./modal";

function init() {
  createScene();
  handleModal();
  initEventListeners();
}

init();