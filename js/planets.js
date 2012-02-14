/*jslint browser: true, white: false */
/*global document, LIFE: true */

(function () {

'use strict';

LIFE.planets = {};


var _prototype = {
    'init': function init(parent, counter) {
        this.parent = LIFE.dom.getBySel(parent);
        this.counter = counter;
        LIFE.dom.clearElement(parent);
    },

    'refresh': function refresh(pop) {
        // TODO optimize
        LIFE.dom.clearElement(this.parent);
        this.render(pop);
        if (this.counter) {
            this.counter.update(pop);
        }
    }
};


LIFE.planets.ansi = function ansi(parent, counter) {
    /*
        A <pre> element with a space for dead cells,
        an asterisk for live ones.
    */
    var planet = Object.create(_prototype);
    planet.init(parent, counter);
    LIFE.planets.current_planet = planet;

    planet.render = function render(pop) {
        var y,
            sizey = pop.num_rows(),
            lines = [],
            container = document.createElement('pre'),
            to_char = function(state) {
                return ' *'.charAt(state);
            };

        for (y=0; y<sizey; y+=1) {
            lines.push(pop.get_row(y).map(to_char).join(''));
        }
        container.innerHTML = lines.join('\n');
        parent.appendChild(container);
    };

    return planet;
};


LIFE.planets.crosswords = function crosswords(parent, counter) {
    /*
        A <table> element with a <td> for each cell,
        styled by CSS.
    */
    var planet = Object.create(_prototype);
    planet.init(parent, counter);
    LIFE.planets.current_planet = planet;

    planet.render = function render(pop) {
        var x, y,
            tr, td,
            container = document.createElement('table'),
            sizey = pop.num_rows(),
            sizex = pop.num_columns();

        for (y=0; y<sizey; y+=1) {
            tr = document.createElement('tr');
            for (x=0; x<sizex; x+=1) {
                td = document.createElement('td');
                if (pop.get_cell(y, x)) {
                    td.setAttribute('class', 'live');
                }
                tr.appendChild(td);
            }
            container.appendChild(tr);
        }
        parent.appendChild(container);
    };
    
    return planet;
};


LIFE.planets.wakawaka = function wakawaka(parent, counter) {
    /*
        A <canvas> element with pacman cells.
    */
    var planet = Object.create(_prototype);
    planet.init(parent, counter);
    planet.waka_tick = 0;
    LIFE.planets.current_planet = planet;

    planet.render = function render(pop) {
        var x, y,
            container = document.createElement('canvas'),
            ctx,
            cell_size = 11,
            radius = 5,
            anim_step = 0.07,
            anim_frames = 6,
            mouth_start,
            mouth_end,
            frame;

        planet.waka_tick += 1;

        container.setAttribute('class', 'wakawaka');
        container.setAttribute('width', pop.num_columns()*cell_size);
        container.setAttribute('height', pop.num_rows()*cell_size);
        ctx = container.getContext('2d');
        ctx.fillStyle = '#ff0';

        pop.each_cell(function draw_cell(y, x, state) {
                        if (state) {
                            frame = (planet.waka_tick + x + y) % anim_frames;
                            if (frame > anim_frames / 2) {
                                frame = anim_frames - frame;
                            }

                            mouth_start = Math.PI * (anim_step * (frame+1));
                            mouth_end = Math.PI * (2-(anim_step * (frame+1)));

                            ctx.beginPath();
                            ctx.moveTo(x*cell_size+radius-1,
                                       y*cell_size+radius);
                            ctx.arc(x*cell_size+radius,
                                    y*cell_size+radius,
                                    radius,
                                    mouth_start,
                                    mouth_end);
                            ctx.closePath();
                            ctx.fill();
                        }
                      });

        parent.appendChild(container);
    };
    
    return planet;
};



LIFE.planets.rainbow = function rainbow(parent, counter) {
    /*
        A <canvas> element whose cell color depends on the number of live neighbors.
    */
    var planet = Object.create(_prototype);
    planet.init(parent, counter);
    LIFE.planets.current_planet = planet;
    var colors = [
        '#00ffff',
        '#8b80ff',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff7f00',
        '#ff0000',
        '#444444',
        '#000000'
    ];

    planet.render = function render(pop) {
        var x, y,
            container = document.createElement('canvas'),
            ctx,
            cell_size = 11;

        container.setAttribute('class', 'rainbow');
        container.setAttribute('width', pop.num_columns()*cell_size);
        container.setAttribute('height', pop.num_rows()*cell_size);
        ctx = container.getContext('2d');
        ctx.strokeStyle='#666';

        pop.each_cell(function draw_cell(y, x, state) {
                        if (state) {
                            ctx.fillStyle = colors[pop.live_siblings(y, x)];
                            ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
                            ctx.strokeRect(x*cell_size, y*cell_size, cell_size, cell_size);
                        }
                      });

        parent.appendChild(container);
    };
    
    return planet;
};





LIFE.planets.preview = function canvas(parent) {
    /*
        A <canvas> element with squares, intended for bookmark previews.
    */
    var planet = Object.create(_prototype);
    planet.init(parent);

    planet.render = function render(pop) {
        var x, y,
            container = document.createElement('canvas'),
            ctx,
            cell_size = 8;

        container.setAttribute('width', pop.num_columns()*cell_size);
        container.setAttribute('height', pop.num_rows()*cell_size);
        ctx = container.getContext('2d');

        pop.each_cell(function draw_cell(y, x, state) {
                        if (state) {
                            ctx.fillRect(x*cell_size, y*cell_size, cell_size, cell_size);
                        }
                      });

        parent.appendChild(container);
    };
    
    return planet;
};


}());

