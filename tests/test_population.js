/*global context, setup, should, assert, Tests, LIFE, pop: true */

var pop;

context('population',
    setup(function() {
        //
    }),

    context('when empty',
        setup(function() {
            pop = LIFE.population();
        }),

        should('be an object', function() {
            assert.equal('object', typeof(pop));
          }),

        should('have 0 rows', function() {
            assert.equal(0, pop.num_rows());
        }),

        should('have 0 columns', function() {
            assert.equal(0, pop.num_columns());
        }),

        should('have 0 cells', function() {
            assert.equal(0, pop.num_cells());
        }),

        should('resize to grow', function() {
            pop.resize(2, 3);
            assert.equal(2, pop.num_rows());
            assert.equal(3, pop.num_columns());
            assert.equal(6, pop.num_cells());
            assert.equal('...;...', pop.serialize());
        })
    ),

    context('deserialized pop',
        setup(function() {
            pop = LIFE.population({serialized: '...;.O.;O.O;.O.'});
        }),

        should('create from string', function() {
            assert.equal(4, pop.num_rows());
            assert.equal(3, pop.num_columns());
        }),

        should('serialize to the initial string', function() {
            assert.equal('...;.O.;O.O;.O.', pop.serialize());
        })
    ),

    context('3x4 cells',
        setup(function() {
            pop = LIFE.population({sizey: 3, sizex: 4});
            pop.set_cell(1, 0, 1);
            pop.set_cell(2, 2, 1);
            pop.set_cell(2, 3, 1);
        }),

        should('be an object', function() {
            assert.equal('object', typeof(pop));
        }),

        should('have 3 rows', function() {
            assert.equal(3, pop.num_rows());
        }),

        should('have 4 columns', function() {
            assert.equal(4, pop.num_columns());
        }),

        should('have 12 cells', function() {
            assert.equal(12, pop.num_cells());
        }),

        should('serialize correctly', function() {
            assert.equal('....;O...;..OO', pop.serialize());
        }),

        should('resize to grow', function() {
            pop.resize(6, 8);
            assert.equal(6, pop.num_rows());
            assert.equal(8, pop.num_columns());
            assert.equal('........;O.......;..OO....;........;........;........', pop.serialize());
        }),

        should('resize to grow and center', function() {
            pop.resize(5, 6, true);
            assert.equal(5, pop.num_rows());
            assert.equal(6, pop.num_columns());
            assert.equal('......;......;.O....;...OO.;......', pop.serialize());
        }),

        should('resize to shrink', function() {
            pop.resize(1, 3);
            assert.equal(1, pop.num_rows());
            assert.equal(3, pop.num_columns());
            assert.equal('...', pop.serialize());
        }),

        should('count live siblings', function() {
            pop.resize(4, 7);
            assert.equal(1, pop.live_siblings(0, 0));
            assert.equal(2, pop.live_siblings(1, 1));
            assert.equal(1, pop.live_siblings(2, 2));
            assert.equal(1, pop.live_siblings(2, 3));
            assert.equal(0, pop.live_siblings(2, 5));
            assert.equal(0, pop.live_siblings(3, 6));
        })
    )

);

Tests.run();

