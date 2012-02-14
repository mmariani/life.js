/*jslint browser: true, white: false */
/*global document, LIFE */

(function () {

'use strict';


var wrap_shape = function wrap_shape(shape, border_h, border_v) {
    // surrounds the shape with a border of dead cells

    var sizey = shape.length,
        sizex = shape[0].length,
        empty_line = new Array(sizex+2+border_h).join('.'),
        side_border = new Array(border_h+1).join('.'),
        ret = [],
        i,
        y;

    for (i=0; i<border_v; i+=1) {
        ret.push(empty_line);
    }
    for (y=0; y<shape.length; y+=1) {
        ret.push(side_border+shape[y]+side_border);
    }
    for (i=0; i<border_v; i+=1) {
        ret.push(empty_line);
    }

    return ret;
};



var ominoes = [
    {
        'name': 'Glider',
        'type': 'Spaceship',
        'url': 'http://conwaylife.com/wiki/Glider',
        'trivia': 'The smallest spaceship',
        'shape': [
            '.O.',
            '..O',
            'OOO'
        ]
    }, {
        'name': 'Stairstep hexomino',
        'type': 'Miscellaneous',
        'url': 'http://conwaylife.com/wiki/Stairstep_hexomino',
        'shape': [
            'OO..',
            '.OO.',
            '..OO'
        ]
    }, {
        'name': 'R-pentomino',
        'type': 'Methuselah',
        'url': 'http://conwaylife.com/wiki/R-pentomino',
        'trivia': 'Some of the earliest computer programs for Life were written to determine the fate of this small pattern!',
        'shape': [
            '.OO',
            'OO.',
            '.O.'
        ]
    }, {
        'name': 'Die hard',
        'type': 'Methuselah',
        'url': 'http://conwaylife.com/wiki/Die_hard',
        'shape': [
            '......O.',
            'OO......',
            '.O...OOO'
        ]
    }, {
        'name': 'Acorn',
        'type': 'Methuselah',
        'url': 'http://conwaylife.com/wiki/Acorn',
        'shape': [
            '.O.....',
            '...O...',
            'OO..OOO'
        ]
    }, {
        'name': 'Dinner table',
        'type': 'Oscillator',
        'url': 'http://conwaylife.com/wiki/Dinner_table',
        'shape': [
            '.O...........',
            '.OOO.......OO',
            '....O......O.',
            '...OO....O.O.',
            '.........OO..',
            '.............',
            '.....OOO.....',
            '.....OOO.....',
            '..OO.........',
            '.O.O....OO...',
            '.O......O....',
            'OO.......OOO.',
            '...........O.'
        ]
    }, {
        'name': 'Edge-repair spaceship 1',
        'type': 'Spaceship',
        'url': 'http://conwaylife.com/wiki/25P3H1V0.1',
        'shape': [
            '........O.......',
            '.......OOOO.....',
            '..O...O...OO.OO.',
            '.OOOO.....O..OO.',
            'O...O.......O..O',
            '.O.O..O.........',
            '.....O..........'
        ]
    }, {
        'name': 'Triple caterer',
        'type': 'Oscillator',
        'url': 'http://conwaylife.com/wiki/Triple_caterer',
        'shape': [
            '.....OO.........',
            '....O..O..OO....',
            '....OO.O...O....',
            '......O.OOO....O',
            '..OOO.O.O....OOO',
            '.O..O..O....O...',
            'O.O..O...O..OO..',
            '.O..............',
            '..OO.OO.OO.OO...',
            '...O...O...O....',
            '...O...O...O....'
        ]
    }, {
        'name': 'Weekender',
        'type': 'Spaceship',
        'url': 'http://conwaylife.com/wiki/Weekender',
        'shape': [
            '.O............O.',
            '.O............O.',
            'O.O..........O.O',
            '.O............O.',
            '.O............O.',
            '..O...OOOO...O..',
            '......OOOO......',
            '..OOOO....OOOO..',
            '................',
            '....O......O....',
            '.....OO..OO.....'
        ]
    }
];



var render_omino = function render_omino(el_container, omino) {
    var thumb,
        el_image,
        el_description,
        el_name,
        el_type;

    el_image = document.createElement('a');
    el_image.setAttribute('class', 'creature-preview');
    thumb = LIFE.planets.preview(el_image);
    thumb.render(LIFE.population({'serialized': wrap_shape(omino.shape, 1, 1).join(';')}));
    el_image.setAttribute('href', '#' + wrap_shape(omino.shape, 1, 1).join(';'));
    el_image.addEventListener('click',
                              function on_click(ev) {
                                  var hash = ev.currentTarget.href.split('#')[1];
                                  LIFE.current_population.deserialize(hash);
                                  LIFE.current_population.resize(30, 70, true);
                                  LIFE.planets.current_planet.refresh(LIFE.current_population);
                                  ev.preventDefault();
                                  return false;
                              }, false);

    el_container.appendChild(el_image);
    el_description = document.createElement('div');
    el_description.setAttribute('class', 'creature-description');

    el_name = document.createElement('a');
    el_name.appendChild(document.createTextNode(omino.name));
    el_name.setAttribute('href', omino.url);
    el_name.setAttribute('target', '_blank');
    el_name.setAttribute('class', 'creature-name');
    if (omino.trivia) {
        el_name.setAttribute('title', omino.trivia);
    }
    el_type = document.createElement('span');
    el_type.appendChild(document.createTextNode(omino.type));
    el_type.setAttribute('class', 'creature-type');
    el_description.appendChild(el_name);
    el_description.appendChild(el_type);
    el_container.appendChild(el_description);
};


LIFE.popular = function popular(parent) {
    var i,
        thumb_container;

    parent = LIFE.dom.getBySel(parent);

    for (i=0; i<ominoes.length; i+=1) {
        thumb_container = document.createElement('li');
        thumb_container.setAttribute('class', 'creature-container');
        render_omino(thumb_container, ominoes[i]);

        parent.appendChild(thumb_container);
    }

    return this;
};

}());

