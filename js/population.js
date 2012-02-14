/*jslint browser: true, white: false */
/*global window, LIFE */

(function () {

'use strict';


LIFE.population = function population(oConf) {
    /*
        Creates a random population of sizey * sizex cells,
        with a given average density.
    */

    // private

    var cells = [];

    var set_cells = function set_cells(new_cells) {
        cells = new_cells;
    };

    var pop = {};

    // public

    pop.num_rows = function num_rows() {
        return cells.length;
    };

    pop.num_columns = function num_columns() {
        return cells.length ? cells[0].length : 0;
    };

    pop.num_cells = function num_cells() {
        return pop.num_rows() * pop.num_columns();
    };

    pop.set_cell = function set_cell(y, x, state) {
        cells[y][x] = state;
    };

    pop.get_cell = function get_cell(y, x) {
        return cells[y][x];
    };

    pop.get_row = function get_cell(y) {
        // Returns a whole row, optimization for some planets.
        return cells[y];
    };

    pop.each_cell = function each_cell(callback) {
        var y, x,
            sizey = cells.length,
            sizex = sizey ? cells[0].length : 0;

        for (y=0; y<sizey; y+=1) {
            for (x=0; x<sizex; x+=1) {
                callback(y, x, cells[y][x]);
            }
        }
    };

    pop.live_siblings = function live_siblings(y, x) {
        /*
           Returns the number of live adjacent cells.
           The world is a thorus.
        */
        var sizey = cells.length,
            sizex = cells[0].length;

        y += sizey;
        x += sizex;
        return (
            cells[(y-1)%sizey][(x-1)%sizex] +
            cells[(y-1)%sizey][ x   %sizex] +
            cells[(y-1)%sizey][(x+1)%sizex] +
            cells[ y   %sizey][(x-1)%sizex] +
            cells[ y   %sizey][(x+1)%sizex] +
            cells[(y+1)%sizey][(x-1)%sizex] +
            cells[(y+1)%sizey][ x   %sizex] +
            cells[(y+1)%sizey][(x+1)%sizex]
        );
    };

    pop.resize = function resize(new_sizey, new_sizex, center) {
        var sizey = pop.num_rows(),
            sizex = pop.num_columns(),
            y, x,
            new_row,
            new_cells = [],
            offset_y = 0,
            offset_x = 0;

        if (center) {
            offset_y = Math.round((new_sizey - sizey)/2);
            offset_x = Math.round((new_sizex - sizex)/2);
        }

        for (y=0; y<new_sizey; y+=1) {
            new_row = [];
            for (x=0; x<new_sizex; x+=1) {
                new_row.push(false);
            }
            new_cells.push(new_row);
        }

        if (sizex && sizey) {
            for (y=0; y<sizey; y+=1) {
                for (x=0; x<sizex; x+=1) {
                    if ((y+offset_y)<new_sizey && (x+offset_x)<new_sizex) {
                        new_cells[y+offset_y][x+offset_x] = pop.get_cell(y, x);
                    }
                }
            }
        }

        set_cells(new_cells);
    };

    pop.random = function reset(density) {
        var y,
            x,
            row,
            sizey = pop.num_rows(),
            sizex = pop.num_columns();

        cells = [];
        for (y=0; y<sizey; y+=1) {
            row = [];
            for (x=0; x<sizex; x+=1) {
                row.push(Math.random()<density ? 1 : 0);
            }
            cells.push(row);
        }
    };

    pop.serialize = function serialize() {
        var ret = [];

        pop.each_cell(function(y, x, state) {
            if (y && !x) {
                ret.push(';');
            }
            ret.push('.O'.charAt(state));
        });
        return ret.join('');
    };

    pop.deserialize = function deserialize(txt) {
        var lines = txt.split(';'),
            y, x, row,
            sizey = lines.length,
            sizex = lines[0].length;
        
        cells = [];
        for (y=0; y<sizey; y+=1) {
            row = [];
            for (x=0; x<sizex; x+=1) {
                row.push((lines[y].charAt(x)==='O') ? 1 : 0);
            }
            cells.push(row);
        }
    };

    if (oConf && oConf.serialized) {
        pop.deserialize(oConf.serialized);
    } else if (oConf && oConf.sizey && oConf.sizex) {
        pop.resize(oConf.sizey, oConf.sizex);
        if (oConf.density) {
            pop.random(oConf.density);
        }
    }
    return pop;
};


}());

