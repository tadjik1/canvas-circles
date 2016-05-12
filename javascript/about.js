const modalPopup = document.querySelector('.modal');

export const showAboutWindow = () => {
  modalPopup.style.visibility = 'visible';
};

export const closeAboutWindow = () => {
  modalPopup.style.visibility = 'hidden';
};
