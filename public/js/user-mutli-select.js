
const multiSelectWithoutCtrl = (elemSelector) => {
  let options = [].slice.call(
    document.querySelectorAll(`${elemSelector} option`)
  );
  options.forEach(function (element) {
    element.addEventListener(
      "mousedown",
      function (e) {
        e.preventDefault();
        element.parentElement.focus();
        this.selected = !this.selected;
        return false;
      },
      false
    );
  });
};

//Functionality to multi select without using ctrl/command for user-convenient
multiSelectWithoutCtrl("#add-users");

