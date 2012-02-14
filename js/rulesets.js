/*jslint browser: true, white: false */
/*global LIFE */

(function () {

'use strict';

LIFE.rulesets = {
    'b3_s23': {
        'evolve': function evolve(pop) {
            var i,
                new_states = [];
            pop.each_cell(function(y, x, state) {
                            var nstate = state,
                                sib = pop.live_siblings(y, x);
                            if (state && sib<2) {
                                nstate = 0;
                            } else if (state && sib<=3) {
                                nstate = 1;
                            } else if (state) {
                                nstate = 0;
                            } else if (!state && sib===3) {
                                nstate = 1;
                            }
                            if (nstate!==state) {
                                new_states.push([y, x, nstate]);
                            }
                         });
            new_states.map(function apply_state(ns) {
                                pop.set_cell.apply(null, ns);
                           });
        }
    }

};


}());

