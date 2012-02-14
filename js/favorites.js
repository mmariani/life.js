/*jslint browser: true, white: false */
/*global document, window, LIFE: true */

(function () {

'use strict';


LIFE.favorites = function favorites() {
    var el_bookmark = document.getElementById('bookmark'),
        el_saved_favorites = document.getElementById('favorites-container');

    var save_bookmark = function save_bookmark(ev) {
                           var el_container = document.createElement('li'),
                               el_reload = document.createElement('a'),
                               snapshot = LIFE.planets.preview(el_container),
                               current_url = '';

                           el_container.setAttribute('class', 'preview-container');
                           el_reload.appendChild(document.createTextNode('\u00a0'));
                           el_reload.setAttribute('class', 'reload');

                           el_reload.setAttribute('title', 'Restore population');
                           el_reload.setAttribute('href', ['#', LIFE.current_population.serialize()].join(''));

                           el_reload.addEventListener('click',
                                                      function restore_state(ev) {
                                                          var hash = ev.target.href.split('#')[1];
                                                          LIFE.current_population.deserialize(hash);
                                                          // so the user can save the URL
                                                          window.location.hash = hash; 
                                                          LIFE.planets.current_planet.refresh(LIFE.current_population);
                                                          ev.preventDefault();
                                                          return false;
                                                      }, false);

                           LIFE.catalog_tabber.select_tab(1);
                           el_saved_favorites.appendChild(el_container);
                           snapshot.render(LIFE.current_population);
                           el_container.appendChild(el_reload);
                           ev.preventDefault();
                           return false;
                        };

    el_bookmark.addEventListener('click', save_bookmark, false);

    return this;
};

}());

