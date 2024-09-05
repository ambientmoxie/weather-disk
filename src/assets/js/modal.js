const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay-text");
const closeModal = document.getElementById("close-modal");
const submitBtn = document.getElementById("submit");

export default function handleModal() {
  const showModal = () => {
    modal.style.display = "flex";
  };

  const hideModal = () => {
    modal.style.display = "none";
  };

  overlay.addEventListener("click", showModal);
  closeModal.addEventListener("click", hideModal);
  submitBtn.addEventListener("click", hideModal);
}

