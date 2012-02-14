/*jslint browser: true, white: false */
/*global document, window, console, LIFE: true */

(function () {

'use strict';

LIFE.widgets = {};


LIFE.widgets.tabber = function tabber(container) {
    var i, j,
        tbr,
        header,
        el_toggle;

    if (typeof(container)==='string') {
        container = document.getElementById(container);
    }

    tbr = {
        'container': container,
        'headers': container.getElementsByClassName('header')[0].children,
        'tabs': container.getElementsByClassName('tabs')[0].children,
        'select_tab': function select_tab(idx) {
                            var i;
                            for (i=0; i<tbr.tabs.length; i+=1) {
                                if (i===idx) {
                                    tbr.headers[i].setAttribute('class', 'active');
                                    LIFE.dom.show(tbr.tabs[i]);
                                } else {
                                    tbr.headers[i].setAttribute('class', '');
                                    LIFE.dom.hide(tbr.tabs[i]);
                                }
                            }
                        }
    };

    var on_click = function on_click(ev) {
                       for (j=0; j<tbr.headers.length; j+=1) {
                           if (tbr.headers[j]===ev.target) {
                               tbr.select_tab(j);
                           }
                       }
                       ev.preventDefault();
                       return false;
                   };

    for (i=0; i<tbr.headers.length; i+=1) {
        el_toggle = tbr.headers[i];
        el_toggle.addEventListener('click', on_click, false);
        console.log('head: '+el_toggle);
    }

    return tbr;
};

}());


