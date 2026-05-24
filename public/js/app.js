document.addEventListener('DOMContentLoaded', () => {

  document
    .querySelectorAll('a[href="#"]')
    .forEach(link => {

      link.addEventListener('click', e => {
        e.preventDefault();
      });

    });

});
