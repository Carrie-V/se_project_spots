import "./index.css";
import {
  disableButton,
  resetValidation,
  enableValidation,
  settings,
} from "../scripts/validation.js";

import spotsLogo from "../images/spots-logo.svg";
import Api from "../../utils/Api.js";
const spotsLogoImage = document.getElementById("spots-logo");
spotsLogoImage.src = spotsLogo;

import avatar from "../images/Avatar.png";
const avatarImage = document.getElementById("avatar");
avatarImage.src = avatar;

import editIcon from "../images/edit-icon.svg";
const editIconImage = document.getElementById("edit-icon");
editIconImage.src = editIcon;

import editIconWhite from "../images/edit-icon-white.svg";
const editIconImageWhite = document.getElementById("edit-avatar");
editIconImageWhite.src = editIconWhite;

import plusIcon from "../images/plus-icon.svg";
const plusIconImage = document.getElementById("plus-icon");
plusIconImage.src = plusIcon;

// const getInitialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4949043c-6ccb-4b70-b08e-836b48760fb4",
    "Content-Type": "application/json",
  },
});

//destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
      console.log([cards]);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarImage.src = userInfo.avatar;
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile-form"];
const profileEditModalCloseButton = document.querySelector(
  ".modal__close-button"
);
const editProfileSubmitButton = editFormElement.querySelector(
  ".modal__submit-button"
);
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardModalSubmitButton = cardModal.querySelector(".modal__submit-button");
const addPostButton = document.querySelector(".profile__add-post-button");
const addCardFormElement = document.forms["add-card-form"];
const cardModalNameInput = cardModal.querySelector("#image-caption-input");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");

const viewCardModal = document.querySelector("#view-card-modal");
const viewCardModalCloseButton = viewCardModal.querySelector(
  ".modal__close-button"
);
const viewCardModalImage = viewCardModal.querySelector(".modal__image");
const viewCardModalCaption = viewCardModal.querySelector(".modal__caption");

const popups = Array.from(document.querySelectorAll(".modal"));

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarModalSubmitButton = avatarModal.querySelector(
  ".modal__submit-button"
);
const editAvatarButton = document.querySelector(".profile__avatar-button");
const avatarFormElement = document.forms["edit-avatar-form"];
const avatarInput = avatarModal.querySelector("#avatar-link-input");

popups.forEach((popup) => {
  const modalContainer = popup.querySelector(".modal__container");
  popup.addEventListener("mousedown", (event) => {
    if (
      event.target.classList.contains("modal_opened") &&
      !modalContainer.contains(event.target)
    ) {
      closeModal(popup);
    }
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".cards__card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".cards__card-caption");
  const cardImageElement = cardElement.querySelector(".cards__card-image");
  const likeButton = cardElement.querySelector(".cards__like-button");
  const deleteButton = cardElement.querySelector(".cards__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardImageElement.addEventListener("click", () => {
    openModal(viewCardModal);
    viewCardModalImage.src = data.link;
    viewCardModalImage.alt = data.name;
    viewCardModalCaption.textContent = data.name;
  });

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("cards__like-button_liked");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function closeModalOnEsc(event) {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");

  document.addEventListener("keydown", closeModalOnEsc);
}

function closeModal(modal) {
  document.removeEventListener("keydown", closeModalOnEsc);
  modal.classList.remove("modal_opened");
}

function editProfileFormSubmit(event) {
  event.preventDefault();

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
      disableButton(editProfileSubmitButton, settings);
    })
    .catch(console.error);
}

function avatarFormSubmit(event) {
  event.preventDefault();

  api.editAvatarInfo(avatarInput.value)

  .then(res) => {}
  .catch(console.error);
}

function renderCard(inputValues) {
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(cardModal);
  disableButton(cardModalSubmitButton, settings);
}

function addCardFormSubmit(event) {
  event.preventDefault();
  const inputValues = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };
  event.target.reset();
  renderCard(inputValues);
}

profileEditButton.addEventListener("click", () => {
  openModal(editProfileModal);
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  disableButton(editProfileSubmitButton, settings);
});

profileEditModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

addPostButton.addEventListener("click", () => {
  openModal(cardModal);
});

editAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

editFormElement.addEventListener("submit", editProfileFormSubmit);

addCardFormElement.addEventListener("submit", addCardFormSubmit);

avatarFormElement.addEventListener("submit", avatarFormSubmit);

viewCardModalCloseButton.addEventListener("click", () => {
  closeModal(viewCardModal);
});

enableValidation(settings);
