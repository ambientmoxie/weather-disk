import "../scss/style.scss";
import { createScene, initEventListeners } from "./init";
import handleModal from "./modal";

function init() {
  createScene();
  handleModal();
  initEventListeners();
}

init();

const documentHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};

window.addEventListener("resize", () => {
  documentHeight();
});

documentHeight();
