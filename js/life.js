/*jslint browser: true, white: false */
/*global window, document, LIFE: true */

var LIFE = {
    'version': '0.4'
};


(function () {

'use strict';


LIFE.dom = {
    'getBySel': function getBysel(element_or_selector) {
                    if (typeof(element_or_selector) === 'string') {
                        return document.querySelector(element_or_selector);
                    }
                    return element_or_selector;
                },

    'clearElement': function clearElement(element_or_selector) {
                        var el = LIFE.dom.getBySel(element_or_selector);
                        // removes all children of an element.
                        // TODO: clear all attached events before removal, to avoid leaks in some browsers
                        while (el && el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                },

    'show': function show(element_or_selector) {
                        var el = LIFE.dom.getBySel(element_or_selector);
                        el.style.display = '';
                },

    'hide': function show(element_or_selector) {
                        var el = LIFE.dom.getBySel(element_or_selector);
                        el.style.display = 'none';
                },

    'is_visible': function is_visible(element_or_selector) {
                        var el = LIFE.dom.getBySel(element_or_selector);
                        return  (window.getComputedStyle(el, null).getPropertyValue('display')!=='none');
                }


};


LIFE.counter = function counter(container) {
    container = LIFE.dom.getBySel(container);

    this.update = function counter(pop) {
        var tot = 0;
        pop.each_cell(function(y, x, status) {tot+=status;});
        if (!tot) {
            container.style.color = 'red';
        } else if (tot < pop.num_cells()*0.02) {
            container.style.color = 'brown';
        } else {
            container.style.color = 'black';
        }
        container.innerHTML = tot;
    };

    return this;
};



LIFE.clock = function clock(el_play, el_pause) {
    var tick_ms = 100,
        interval = null;

    this.play = function play(callback) {
        interval = setInterval(function() {
                                  callback();
                               }, tick_ms);
        LIFE.dom.hide(el_play);
        LIFE.dom.show(el_pause);
    };

    this.pause = function pause() {
        if (interval) {
            window.clearInterval(interval);
            interval = null;
        }
        LIFE.dom.hide(el_pause);
        LIFE.dom.show(el_play);
    };

    return this;
};


document.addEventListener('DOMContentLoaded', function() {
    var el_world = document.getElementById('world'),
        counter = LIFE.counter('#counter'),
        sel_planet = document.getElementById('planet'),
        sel_planet_name = function sel_planet_name() {
            return sel_planet.children[sel_planet.selectedIndex].value;
        },
        planet = LIFE.planets[sel_planet_name()](el_world, counter),
        ruleset = LIFE.rulesets.b3_s23,
        el_play = document.getElementById('play'),
        el_pause = document.getElementById('pause'),
        el_new_pop = document.getElementById('new-population'),
        el_next = document.getElementById('next'),
        clock = LIFE.clock(el_play, el_pause),
        popular = LIFE.popular('#popular-container'),
        pop = LIFE.population(),
        favorites = LIFE.favorites(pop);

    LIFE.current_population = pop;

    if (window.location.hash) {
        pop.deserialize(window.location.hash.substr(1));
    } else {
        pop.resize(30, 70);
    }

    LIFE.catalog_tabber = LIFE.widgets.tabber('catalog');
    LIFE.catalog_tabber.select_tab(null);

    planet.render(pop);
    counter.update(pop);  // initial count

    var breed = function breed() {
        ruleset.evolve(pop);
        planet.refresh(pop);
    };

    el_new_pop.addEventListener('click',
                                function new_population(ev) {
                                    clock.pause();

                                    pop.random(0.08);
                                    // a starting denstity of .375 is very dynamic
                                    // (recommended with big planets)

                                    planet.refresh(pop);
                                    ev.preventDefault();
                                    return false;
                                }, false);

    el_next.addEventListener('click',
                             function next(ev) {
                                 clock.pause();
                                 breed();
                                 ev.preventDefault();
                                 return false;
                             }, false);

    el_play.addEventListener('click',
                             function play(ev) {
                                 clock.play(breed);
                                 ev.preventDefault();
                                 return false;
                             }, false);

    el_pause.addEventListener('click',
                              function pause(ev) {
                                  clock.pause();
                                  ev.preventDefault();
                                  return false;
                              }, false);

    sel_planet.addEventListener('change',
                                function change_planet(ev) {
                                    planet = LIFE.planets[sel_planet_name()](el_world, counter);
                                    planet.render(pop);
                                }, false);

}, false);


}());

