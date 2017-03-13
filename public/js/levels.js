// this array contains the level names in the order they will appear in
// its last element has to be "ende" though (or some other state that will appear
// after the laste level)
let level_names = [
    "deutschland",
    //"frankreich",
    "usa",
    "tuerkei",
    "niederlande",
    "russland",
    //"grossbritannien",
    "ende"
];

// the level we want the game to start with
let current_level = 4;

// each level has different object to appear on the dam
let level_dam_probabilities = {
    deutschland: {
        "tree0" : 0.0200,
        "tree1" : 0.0200,
        "tree2" : 0.0002, // owls :)
        "bush"  : 0.0200,
        "sign"  : 0.0020,
        "frauke": 0.0020
    },
    usa: {
        "cactus0" : 0.0200,
        "cactus1" : 0.0200,
        "tumbleweed" : 0.01,
        "bush"  : 0.0200,
        "sign"  : 0.0020,
        "donald": 0.0020
    },
    tuerkei: {
        "tree0"     : 0.0200,
        "olivetree" : 0.0200,
        "tree2"  : 0.0020, 
        "bush"   : 0.0200,
        "sign"   : 0.0020,
        "goat"   : 0.0020,
        "erdogan": 0.0020
    },
    niederlande: {
        "tree0"  : 0.0002,
        "tree1"  : 0.0002,
        "tree2"  : 0.0002, 
        "bush"   : 0.0200,
        "sign"   : 0.0020,
        "tulips" : 0.0800,
        "geert"  : 0.0020
    },
    russland: {
        "tree0"  : 0.01,
        "olivetree"  : 0.08,
        "tree3"  : 0.08, 
        "bush"   : 0.02,
        "sign"   : 0.002,
        "tulips" : 0.0002,
        "putin"  : 0.002,
        "tumbleweed" : 0.02
    }
    /*
    frankreich: {
        "tree0" : 0.0200,
        "tree1" : 0.0200,
        "tree2" : 0.0002, // owls :)
        "bush"  : 0.0200,
        "sign"  : 0.0020,
        "frauke": 0.0020,
    }*/
}

// each level has different object assets
let level_backgrounds = {
    deutschland: {
        sky: "sky_de",
        green: "grass_de",
        dirt: "dirt_de"
    },
    usa: {
        sky: "sky_us",
        green: "grass_us",
        dirt: "dirt_us"
    },
    tuerkei: {
        sky: "sky_tr",
        green: "grass_tr",
        dirt: "dirt_tr"
    },
    niederlande: {
        sky: "sky_nl",
        green: "grass_nl",
        dirt: "dirt_tr"
    },
    russland: {
        sky: "sky_ru",
        green: "grass_ru",
        dirt: "dirt_ru"
    }
}

// push all the states in to this array
let level_states = Array();

for(let i=0; i<level_names.length-1; i++)
{

    level_states.push({

        // before a level is created
        init: function () {

            //update dam objects
            dam_probabilities = level_dam_probabilities[level_names[current_level]];
            norm_probabilities(dam_probabilities);

            //update rail objects
            //rail_probabilities = level_rail_probabilities[i];
            //update_probabilities(rail_probabilities);

            //update level default velocity
            update_velocity("level_change");

            // delete old dam objects
            for (let i = dam_objects.length; i--; ) {
                dam_objects[i].sprite.destroy();
            }
            dam_objects.length = 0;

            // delete old rail objects
            for (let i = rail_objects.length; i--; ) {
                rail_objects[i].sprite.destroy();
            }
            rail_objects.length = 0;

            // allow star to spawn
            eu_star_can_spawn = true;
        },

        // those are standard functions from schulzzug_core.js
        create: core_create,

        // those are standard functions from schulzzug_core.js
        update: core_update
        
    });
}

function norm_probabilities(probabilities) {
    //norm the sum of those probabilities to one
    let probability_norm = 0;
    for (kind in probabilities)
    {
        if (!probabilities.hasOwnProperty(kind)) continue;

        probability_norm += probabilities[kind];
    }
    for (kind in probabilities)
    {
        if (!probabilities.hasOwnProperty(kind)) continue;

        probabilities[kind] /= probability_norm;
    }
}
