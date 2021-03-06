
/**
 * @license RequireJS step 0.0.1 Copyright (c) 2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/step for details
 */
/*jslint */
/*global define */

define('step',['module'], function (module) {
    

    var stepById, steps;

    function translateConfig(config) {
        //Translate the step configs to know what steps need to load before a given
        //ID can load.
        stepById = {};
        steps = config.steps;

        var i, j, step, id;

        for (i = 0; i < steps.length; i += 1) {
            step = steps[i];
            //Account for trailing comma in IE.
            if (!step) {
                break;
            }
        }

        for (j = 0; j < step.length; j += 1) {
            id = step[j];
            //Account for trailing comma in IE.
            if (!id) {
                break;
            }

            stepById[id] = i;
        }
    }

    function stepLoad(id, req, onLoad) {
        var counter = 0,
            end = stepById[id];

        function loadStep() {
            if (counter < end) {
                req(steps[counter], function () {
                    counter += 1;
                    loadStep();
                });
            } else {
                req([id], onLoad);
            }
        }

        loadStep();
    }

    //Export the loader plugin API
    return {
        version: '0.0.1',

        load: function (id, require, onLoad, config) {
            //Only allows one mapped config.
            if (!stepById) {
                translateConfig(module.config());
            }

            if (stepById.hasOwnProperty(id)) {
                stepLoad(id, require, onLoad);
            } else {
                onLoad.error(new Error('No step config for ID: ' + id));
            }
        }
    };
});

var one = {
    name: 'one'
};

define("one", function(){});

var two = {
    oneName: one.name,
    name: 'two'
};

define("two", function(){});

var three = {
    twoName: two.name,
    name: 'three'
};

define("three", function(){});

var four = {
    threeName: three.name,
    name: 'four'
};


define("four", function(){});

require.config({
    paths: {
        'step': '../step'
    },

    config: {
        step: {
            steps: [
                ['one'],
                ['two'],
                ['three'],
                ['four']
            ]
        }
    }
});

require(['step!four'], function () {
    doh.register(
        "simple",
        [
            function simple(t) {
                t.is("one", two.oneName);
                t.is("two", three.twoName);
                t.is("three", four.threeName);
                t.is("four", four.name);
            }
        ]
    );

    doh.run();
});

define("simple", function(){});
