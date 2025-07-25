import "../pages/index.css";
import {
  disableButton,
  resetValidation,
  enableValidation,
  settings,
} from "../scripts/validation.js";
import { setButtonText } from "../../utils/helpers.js";

//images
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

//Variables

//Edit Profile
const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile-form"];
const profileEditModalCloseButton = document.querySelector(
  ".modal__close-button"
);
const editProfileSubmitButton = editFormElement.querySelector(
  ".modal__submit-button"
);

//Edit Profile Inputs
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

//Cards
const addPostButton = document.querySelector(".profile__add-post-button");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardModalSubmitButton = cardModal.querySelector(".modal__submit-button");

//Add Card Form
const addCardFormElement = document.forms["add-card-form"];
const cardModalNameInput = cardModal.querySelector("#image-caption-input");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//View Card Modal
const viewCardModal = document.querySelector("#view-card-modal");
const viewCardModalCloseButton = viewCardModal.querySelector(
  ".modal__close-button"
);
const viewCardModalImage = viewCardModal.querySelector(".modal__image");
const viewCardModalCaption = viewCardModal.querySelector(".modal__caption");

//All Popups
const popups = Array.from(document.querySelectorAll(".modal"));

//Avatar Modal
const editAvatarButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarModalSubmitButton = avatarModal.querySelector(
  ".modal__submit-button"
);

//Avatar Form
const avatarFormElement = document.forms["edit-avatar-form"];
const avatarInput = avatarModal.querySelector("#avatar-link-input");

//Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);
const deleteModalSubmitButton = deleteModal.querySelector(
  ".modal__submit-button"
);
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelButton = deleteModal.querySelector(".modal__cancel-button");

let selectedCard, selectedCardId;

//establish api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "4949043c-6ccb-4b70-b08e-836b48760fb4",
    "Content-Type": "application/json",
  },
});

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

function handleLike(event, id) {
  const isLiked = event.target.classList.contains("cards__like-button_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      event.target.classList.toggle("cards__like-button_liked");
    })
    .catch(console.error);
}

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

  function isCardLiked(isLiked) {
    if (isLiked) {
      likeButton.classList.add("cards__like-button_liked");
    }
  }

  isCardLiked(data.isLiked);

  cardImageElement.addEventListener("click", () => {
    openModal(viewCardModal);
    viewCardModalImage.src = data.link;
    viewCardModalImage.alt = data.name;
    viewCardModalCaption.textContent = data.name;
  });

  likeButton.addEventListener("click", (event) => {
    handleLike(event, data._id);
  });

  deleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
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

  const submitButton = event.submitter;

  setButtonText(submitButton, true);

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
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function avatarFormSubmit(event) {
  event.preventDefault();

  const submitButton = event.submitter;
  const avatarImage = document.querySelector(".profile__avatar");

  setButtonText(submitButton, true);

  api
    .editAvatarInfo(avatarInput.value)

    .then((link) => {
      avatarImage.src = avatarInput.value;
      closeModal(avatarModal);
      disableButton(submitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(event) {
  event.preventDefault();

  const submitButton = event.submitter;

  setButtonText(submitButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
  console.log(cardId);
}

function addCardFormSubmit(event) {
  event.preventDefault();

  const submitButton = event.submitter;

  setButtonText(submitButton, true);

  const inputValues = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };

  api
    .addCard(inputValues)
    .then((newCard) => {
      event.target.reset();
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      disableButton(cardModalSubmitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
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

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

editFormElement.addEventListener("submit", editProfileFormSubmit);

addCardFormElement.addEventListener("submit", addCardFormSubmit);

avatarFormElement.addEventListener("submit", avatarFormSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

viewCardModalCloseButton.addEventListener("click", () => {
  closeModal(viewCardModal);
});

enableValidation(settings);
