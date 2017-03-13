let level_names = [
    "deutschland",
    //"frankreich",
    "usa",
    //"tuerkei",
    //"niederlande",
    //"grossbritannien",
    "ende"
];

let current_level = 0;

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
    }
}


let level_states = Array();

for(let i=0; i<level_names.length-1; i++)
{

    level_states.push({

        init: function () {
            //update dam objects
            dam_probabilities = level_dam_probabilities[level_names[current_level]];
            update_probabilities(dam_probabilities);

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

            for (let i = rail_objects.length; i--; ) {
                rail_objects[i].sprite.destroy();
            }
            rail_objects.length = 0;

            eu_star_can_spawn = true;
        },

        create: core_create,

        update: core_update
        
    });
}

function update_probabilities (probabilities) {
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
