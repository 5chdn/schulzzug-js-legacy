// ===================== DEFINE WORLD CONSTANTS ================================
// canvas size (half iphone 7 retina resolution)
const canvas_width = 375;
const canvas_height = 667;

// position of horizon on y-axis
const horizon_height = 208;
const horizon = canvas_height - horizon_height;

// distance to horizon
const horizon_distance = 40000;

// height of camera
const camera_heigth = 50;

// x position of camera
const camera_x = canvas_width / 2;

// distances of rails at horizon
const rail_distance_inner = 10;
const rail_distance_outer = 6;

// schulzzug velocity
let v_default = 10;  // default velocity
let v = v_default;   // current velocity

//collision ranges
const y_collision_range_start
    = canvas_height / 2 * horizon_distance
    / (camera_heigth + canvas_height / 2);
const y_collision_range_end = y_collision_range_start + 2000;

// ====================== EU STAR STUFF ========================================
const eu_radius = horizon_height / 4;
const eu_position = {
    'x': canvas_width / 2,
    'y': horizon_height / 2
};
const eu_stars_count = 12;
const delta_phi = 360 / eu_stars_count;
let eu_stars_indices = Array();
for (let i = 0; i < eu_stars_count; i++) {
    eu_stars_indices.push(i);
}
let eu_star_objects = Array();
const eu_star_travel_time = 1000;
let eu_star_can_spawn = true;
const eu_event_delta_v = 10;

// each time it's possible, a star will appear
const eu_star_appearance_probability = 1.0;

// ===================== STERNPHASE DEFINTIIONS ================================
const eu_star_phase_duration = 8000;
const eu_star_phase_factor = 2;

// ===================== DEFINE CONTROL VARIABLES ==============================
// swipe handling
let IOS_MODE;
let swipe_direction;
let swipe_gesture_recognizer;

// input keys
let key_left;
let key_right;
let key_up;
let key_space;
let key_mute;

// time after which a new control command can be given (ms)
const key_change_time_block = 160;
let key_mute_block = key_change_time_block;

// last time a control command was given
let key_change_time;

// ====================== RAIL AND DAM OBJECT PROPERTIES =======================

// rate of rail object appearance
let rail_object_rate_default = 500;

// this is needed for changes in velocity
let rail_object_rate = rail_object_rate_default;

//time of last appearance
let rail_object_time;

let dam_object_rate_default = 200;

// the current rate (changes when there's changes in velocity)
// let dam_object_rate = dam_object_rate_default;                               // never used @TODO #37

// time of last dam object appearance
// let dam_object_time;                                                         // never used @TODO #37

const dam_probabilities = {
    "tree0" : 0.0200,
    "tree1" : 0.0200,
    "tree2" : 0.0002, // owls :)
    "bush"  : 0.0200,
    "sign"  : 0.0020,
    "donald": 0.0020,
    "frauke": 0.0020,
};

// objects for storing arrays and sprite groups:
// - for creating an object sprite in the right rail group
let rail_object_group;
// - storing the rail objects,
//   s.t. they can be updated while approaching the train
let rail_objects = Array();
// - storing the collision objects,
//   s.t. they can be updated when a collision took place
let collision_objects = Array();
// - same for dam objects
let dam_objects = Array();
// - same for cloud objects
let cloud_object_group;


// ====================== STATS COUNTERS =======================================
let coin_counter = 0;
let meter_counter = 0;
let panel;          // sprite
let text_score;     // label
let text_distance;  // label


// ==================== SCHULZZUG DEFINITIONS ==================================
let train;          // sprite

// positions of sprite for the three rails
let train_position = [ -10, (canvas_width - 120) / 2, canvas_width - 120 + 10 ];
const train_position_distance = 130;

// names of the animation for each rail
let train_animations  = ["train_left", "train_center", "train_right"];

let train_star_animations = ["star_left", "star_center", "star_right"];

// this is false if the train jumps
let rail_can_change = true;

// this is only true if the train is currently changing its rail
let rail_is_changing = !rail_can_change;

// time the train needs to jump
let rail_jump_duration = key_change_time_block;

// when the last jump started
let rail_jump_start;

// the next train rail after finishing the rail jump (0, 1 or 2)
let train_rail_next;

let train_can_jump_up = true;
let train_is_jumping_up = !train_can_jump_up;
const train_up_jump_duration = 400;
let train_up_jump_start;

// the usual distance to the top of the screen.
const train_spacing_y = 360;

// ================= SOUNDS ====================================================
let sound_bling;
let sound_smash;
let sound_jump;
// let sound_win;                                                               // never used @TODO #36
let sound_whistle;
let sound_background;
let sound_eu_star;

// duration of collision animation for crashes
const wall_animation_length = 1000;

// ===================== SAVING CURRENT TIME FOR ANIMATIONS ====================
let time_now;

// ======================================= CREATE GAME ENGINE ==================
let game = new Phaser.Game(
                            canvas_width,
                            canvas_height,
                            Phaser.AUTO,
                            'schulzzug',
                            {
                                preload: preload,
                                 create: create,
                                 update: update
                            });

// =============== PHASER PRELOAD ASSETS AND SOUNDS ============================

function preload() {
    game.load.image('landscape',  'assets/untergrund.50.png');
    game.load.image('grass',      'assets/green.50.png');
    game.load.image('dirt',       'assets/dirt.50.png');
    game.load.image('sky',        'assets/sky.50.png');

    game.load.image('dummy',      'assets/1pixel.png');
    game.load.image('tree0',      'assets/Tree01.50.png');
    game.load.image('tree1',      'assets/Tree02.50.png');
    game.load.image('tree2',      'assets/specialtree.50.png');
    game.load.image('cloud0',     'assets/cloud01.50.png');
    game.load.image('cloud1',     'assets/cloud02.50.png');
    game.load.image('cloud2',     'assets/cloud03.50.png');
    game.load.image('office',     'assets/Kanzleramt.50.png');
    game.load.image('bush',       'assets/Bush01.50.png');
    game.load.image('sign',       'assets/Sign01.50.png');

    game.load.image('panel',      'assets/Panel.50.png');
    game.load.image('wall_frauke','assets/afd-wall.50.png');
    game.load.image('wall_donald','assets/Trump-Wall.50.png');
    game.load.image('frauke',     'assets/Petry.png');
    game.load.image('donald',     'assets/Trump.png');
    game.load.image('wall',       'assets/wall.png');
    game.load.image('star',       'assets/star.png');

    game.load.spritesheet('coin', 'assets/Coin.50.png', 32, 32);

    if(is_retina()) {
        game.load.spritesheet(
            'rails',
            'assets/rails_animation.png',
            750, 919
        );
        game.load.spritesheet(
            'train',
            'assets/Trains_animation.png',
            240, 464
        );
    } else {
        game.load.spritesheet(
            'rails',
            'assets/rails_animation.50.png',
            375, 460
        );
        game.load.spritesheet(
            'train',
            'assets/Trains_animation.50.png',
            120, 232
        );
    }

    game.load.audio('jump',   [
            'sounds/jump.mp3',
            'sounds/jump.ogg',
            'sounds/jump.wav'
        ]);
    game.load.audio('bling',  [
            'sounds/coin.mp3',
            'sounds/coin.ogg',
            'sounds/coin.wav'
        ]);
    game.load.audio('smash',  [
            'sounds/wall_smash.mp3',
            'sounds/wall_smash.ogg',
            'sounds/wall_smash.wav'
        ]);
    game.load.audio('star',  [
            'sounds/bg_EU.mp3',
            'sounds/bg_EU.ogg',
            'sounds/bg_EU.wav'
        ]);
    game.load.audio('tada',   [
            'sounds/tada.mp3',
            'sounds/tada.ogg',
            'sounds/tada.wav'
        ]);
    game.load.audio('ratter', [
            'sounds/ratter.mp3',
            'sounds/ratter.ogg',
            'sounds/ratter.wav'
        ]);
    game.load.audio('whistle' [
            'sounds/whistle.mp3',
            'sounds/whistle.ogg',
            'sounds/whistle.wav'
        ]);
}

// =============== PHASER CREATE GAME ENVIRONMENT ==============================

function create() {

    // keys
    key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    key_space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_mute = game.input.keyboard.addKey(Phaser.Keyboard.M);

    // start physics and add basic sprites
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'landscape');
    game.add.sprite(0, 0, 'grass');
    game.add.sprite(0, 0, 'dirt');
    game.add.sprite(0, 0, 'sky');

    // sprite group for clouds
    cloud_object_group = game.add.group();

    //enable swipe and set time delta between swipe events
    swipe_gesture_recognizer = new Swipe(game);
    swipe_gesture_recognizer.next_event_rate = key_change_time_block;
    swipe_direction = 0;

    // sounds
    sound_bling = game.add.audio('bling');
    sound_smash = game.add.audio('smash');
    sound_jump = game.add.audio('jump');
    sound_eu_star = game.add.audio('star');
    // sound_win = game.add.audio('tada');                                      // never used @TODO #36
    sound_whistle = game.add.audio('whistle');
    sound_background = game.add.audio('ratter');

    // start background train sound as loop
    game.sound.mute = false;
    sound_background.loop = true;
    sound_background.play();

    // set some time variables so thehy are not undefined
    rail_object_time = game.time.now;
    // dam_object_time = game.time.now;                                         // never used @TODO #37
    key_change_time = game.time.now;
    time_now = game.time.now;

    // add the animated rails
    let rails = game.add.sprite(0, 208, 'rails');

    if(is_retina()) {
        rails.scale.setTo(0.5, 0.5);
    }

    rails.animations.add('move', [0, 1, 2], 8, true);
    rails.animations.play('move');

    // sprite group fot rail objects
    rail_object_group = game.add.group();

    // add player (train)
    train = game.add.sprite(train_position[1], train_spacing_y, 'train');
    game.physics.arcade.enable(train);

    //sprite name, array of positions within sprite, fps, should loop
    train.animations.add('train_left', [0, 1], 7, true);
    train.animations.add('train_center', [2, 3], 7, true);
    train.animations.add('train_right', [4, 5], 7, true);
    train.animations.add('jump_left',[6],10,true);
    train.animations.add('jump_right',[7],10,true);
    train.animations.add('collision',[9,17],10,true);
    train.animations.add('star_left', [11,12], 10, true);
    train.animations.add('star_right', [15,16], 10, true);
    train.animations.add('star_center', [13,14], 10, true);



    if(is_retina()) {
        train.scale.setTo(0.5, 0.5);
    }

    // train is at center rail
    train.animations.play('train_center');
    train.rail = 1;
    train.indefeatable = false;
    train.star_phase = false;

    // statistics display
    let style = "align:center;font-family:'SilkScreen',monospace";
    panel = game.add.sprite(0, canvas_height - 72, 'panel');
    text_score = game.add.text(0, canvas_height - 72, "0", style);
    text_score.anchor.set(0.5);
    text_distance = game.add.text(0, canvas_height - 72, "0m", style);
    text_distance.anchor.set(0.5);
}

// =============== PHASER UPDATE GAME ENVIRONMENT ==============================

function update() {

    // mute and unmute sound
    if (key_mute.isDown && key_mute_block == key_change_time_block) {
        game.sound.mute = !game.sound.mute;
        key_mute_block -= 10;
    } else if (key_mute_block < key_change_time_block &&
               key_mute_block > 0) {
        key_mute_block -= 10;
    } else {
        key_mute_block = key_change_time_block;
    }

    //time handling
    let time_last = time_now;
    time_now = game.time.now;
    let time = time_now;
    let time_delta = time - time_last;

    // ========================= PLAYER CONTROL ===========================
    let direction = null;

    if(IOS_MODE) {
        if(swipe_direction == 1) {
            direction = swipe_gesture_recognizer.DIRECTION_LEFT;
        } else if(swipe_direction == 2) {
            direction = swipe_gesture_recognizer.DIRECTION_RIGHT;
        } else if(swipe_direction == 3) {
            direction = swipe_gesture_recognizer.DIRECTION_UP;
        }

        // reset swipe
        swipe_direction = 0;
    } else {
        let swipe = swipe_gesture_recognizer.check();
        if(swipe != null) {
            direction = swipe.direction;
        }
    }

    if (key_space.isDown) {
        sound_whistle.play();
    }

    // check if player can change rail
    if (
        train.rail !== -1 &&
        time - key_change_time > key_change_time_block
    ) {
        let jump_direction = null;
        if (((             // go left
                    direction !== null
                    && direction == swipe_gesture_recognizer.DIRECTION_LEFT
                ) ||
                key_left.isDown
            ) &&
            train.rail > 0
        ) {
            rail_is_changing = true;
            if (!train.star_phase) {
                train.animations.play("jump_left");
            }
            jump_direction = -1;
        } else if (((      // go right
                    direction !== null
                    &&  direction == swipe_gesture_recognizer.DIRECTION_RIGHT
                ) ||
                key_right.isDown
            ) &&
            train.rail < 2
        ) {
            rail_is_changing = true;
            if (!train.star_phase) {
                train.animations.play("jump_right");
            }
            jump_direction = +1;
        }

        if (rail_is_changing) {
            train.v_x = jump_direction / rail_jump_duration;
            train_rail_next = train.rail + jump_direction;
            rail_jump_start = time;
            key_change_time = time;
            rail_can_change = false;
            train_can_jump_up = false;
            train.rail = -1;
            train.x_previous = train.x;
            train.y_previous = train.y;
            sound_jump.play();
        }
    }

    // check if train should jump up
    if (train.rail !== -1 && time - key_change_time > key_change_time_block ) {
        if ((direction !== null &&
             direction == swipe_gesture_recognizer.DIRECTION_UP) ||
            key_up.isDown
        ) {
            train_is_jumping_up = true;
            train_rail_next = train.rail;
            train_up_jump_start = time;
            train.rail = -1;
            train_can_jump_up = false;
            sound_jump.play();
        }
    }

    if (train_is_jumping_up) {
        let time_delta = (time - train_up_jump_start);
        if (time_delta < train_up_jump_duration) {
            let a = 1 / 300.0;
            train.y = train_spacing_y - time_delta
                    * train_up_jump_duration * a
                    + Math.pow(time_delta, 2) * a;
        } else {
            train.y = train_spacing_y;
            train.rail = train_rail_next;
            rail_can_change = true;
            train_can_jump_up = true;
            train_is_jumping_up = false;
            if (!train.star_phase) {
                train.animations.play(train_animations[train.rail]);
            } else {
                train.animations.play(train_star_animations[train.rail]);
            }
        }
    }

    // rail change animation
    if (rail_is_changing) {
        let time_delta = (time - rail_jump_start);
        if (time_delta < rail_jump_duration) {
            train.x = train.x_previous + train_position_distance
                    * train.v_x * time_delta;
            const a = 0.002;
            train.y = train_spacing_y - time_delta
                    * rail_jump_duration * a
                    + Math.pow(time_delta, 2) * a;
        } else {
            train.x = train_position[train_rail_next];
            train.y = train_spacing_y;
            train.rail = train_rail_next;
            rail_can_change = true;
            train_can_jump_up = true;
            rail_is_changing = false;
            if (!train.star_phase) {
                train.animations.play(train_animations[train.rail]);
            } else {
                train.animations.play(train_star_animations[train.rail]);
            }
        }
    }

    // ====================== UPDATING RAIL AND DAM OBJECTS ====================

    // for saving the indices of objects being out of scope
    let rail_indices_to_remove = Array();
    let dam_indices_to_remove = Array();

    // loop trough all rail objects
    for (let i = 0; i < rail_objects.length; i++) {
        // update according to new time
        // pass the train object to see if there's a collision
        update_rail_object(rail_objects[i],train);

        // remove if the object is now out of scope
        if (!rail_objects[i].active) {
            rail_indices_to_remove.push(i);
            if (rail_objects[i].kind == "star") {
                eu_star_can_spawn = true;
            }
        }

        // if there's a collision with the train
        if (rail_objects[i].collision) {

            // set a new starting point for this object
            // both in time and space
            rail_objects[i].time_start = time;
            rail_objects[i].point_start_x = rail_objects[i].sprite.x;
            rail_objects[i].point_start_y = rail_objects[i].sprite.y;

            // save direction of the object in case
            // it's a wall and has to fly somewhere
            let left_right;
            if(rail_objects[i].rail == 0) {
                left_right = 1;
            } else if(rail_objects[i].rail == 1) {
                left_right = 1 - 2 * Math.floor(Math.random() * 2);
            } else if(rail_objects[i].rail == 2) {
                left_right = -1;
            }

            rail_objects[i].direction = left_right;

            // give this object to the collision updates
            collision_objects.push(rail_objects[i]);
        }
    }

    // update all dam objects in a similar manner
    for (let i = 0; i < dam_objects.length; i++) {
        update_rail_object(dam_objects[i],train);
        if (!dam_objects[i].active) {
            dam_indices_to_remove.push(i);
        }
    }

    // loop through collision objects
    let collision_indices = Array();

    for (let i=0; i < collision_objects.length; i++) {

        // update according to their logic
        collision_update(collision_objects[i],train);

        // remove if collision animation is over (set in collision_update())
        if (!collision_objects[i].collision) {
            collision_indices.push(i);
        }
    }

    // delete all objects that are out of scope or have been collected
    delete_indices_from_array(rail_indices_to_remove, rail_objects);
    delete_indices_from_array(collision_indices, collision_objects);
    delete_indices_from_array(dam_indices_to_remove, dam_objects);

    // ========================= SPAWNING NEW OBJECTS ============================
    //
    if (time - rail_object_time > rail_object_rate) {

        let kind = 'coin';
        let random_float = Math.random();

        // there's different objects if the train is in star_phase
        if (!train.star_phase){
            if (eu_star_can_spawn
                && random_float < eu_star_appearance_probability) {
                kind = 'star';
                eu_star_can_spawn = false;
            }
            else if (random_float < eu_star_appearance_probability + 0.3) {
                kind = 'wall';
            } else {
                kind = 'coin';
            }
        } else {
            if (random_float < 0.2) {
                kind = 'wall_donald';
            }
            else if (random_float < 0.4) {
                kind = 'wall_frauke';
            } else {
                kind = 'coin';
            }

        }

        rail_objects.push(get_rail_object(kind));

        // bring the older objects to the top again
        for (let i = rail_objects.length; i--; ) {
            rail_objects[i].sprite.bringToTop();
        }

        rail_object_time = time;
    }

    // spawn new dam objects
    for (let kind in dam_probabilities) {

        // skip loop if the property is from prototype
        if (!dam_probabilities.hasOwnProperty(kind)) continue;

        let probability = dam_probabilities[kind];                              // does not respect speed @TODO #37
        if (Math.random() < probability) {
            dam_objects.push(get_dam_object(kind));

            for (let i = dam_objects.length; i--; ) {
                dam_objects[i].sprite.bringToTop();
            }
        }
    }

    for (let i = 0; i < eu_star_objects.length; i++) {
        eu_star_objects[i].sprite.bringToTop();
    }

    // spawn new clouds
    if (Math.random() < 0.01) {
        generate_cloud();
    }

    // update statistics
    meter_counter += time_delta * v / 1000.0;

    text_score.x = Math.floor(panel.x + panel.width / 4 + 16);
    text_score.y = Math.floor(panel.y + panel.height / 2 + 4);
    text_score.setText(get_metric_prefix(Math.floor(coin_counter), 2));
    text_score.font = 'SilkScreen';

    text_distance.x = Math.floor(panel.x + panel.width / 4 * 3 + 1);
    text_distance.y = Math.floor(panel.y + panel.height / 2 + 4);
    text_distance.setText(
        get_metric_prefix(Math.floor(meter_counter), 2) + "m"
    );
    text_distance.font = 'SilkScreen';
}

function get_metric_prefix(decimal, number_digits) {
    let prefix = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E09, symbol: "G" },
        { value: 1E06, symbol: "M" },
        { value: 1E03, symbol: "k" }
    ];
    let expression = /\.0+$|(\.[0-9]*[1-9])0+$/;
    for (let i = 0; i < prefix.length; i++) {
        if (decimal >= prefix[i].value) {
            return (decimal / prefix[i].value)
              .toFixed(number_digits)
              .replace(expression, "$1")
              + prefix[i].symbol;
        }
    }
    return decimal.toFixed(number_digits).replace(expression, "$1");
}

function generate_cloud() {
    let seed = Math.random();
    let cloud_height = Math.random() * 176;
    let cloud_type = 'cloud0';
    if (seed < 0.333) {
        cloud_type = 'cloud1';
    } else if (seed < 0.667) {
        cloud_type = 'cloud2';
    } else {
        cloud_type = 'cloud0';
    }
    let cloud = cloud_object_group.create(-60, cloud_height, cloud_type);
    game.physics.arcade.enable(cloud);
    cloud.body.gravity.x = 2 + Math.random() * 4;
}

function delete_indices_from_array(indices, array) {

    // delete object from rail_objects updated
    for (let i = indices.length - 1; i >= 0; i--) {
        array.splice(indices[i], 1);
    }
}

function collision_update(object, train) {
    if (object.kind == "coin") {                                                // make them fly @TODO #35
        sound_bling.play();
        object.sprite.destroy();
        update_coin_counter(1);
        object.collision = false;
    }

    if (object.kind == "star") {
        let time_delta = time_now - object.time_start;
        if (time_delta > eu_star_phase_duration) {
            v = v_default;
            rail_object_rate = rail_object_rate_default;
            // dam_object_rate = dam_object_rate_default;                       // never used @TODO #37
            train.star_phase = false;
            object.collision = false;
            train.animations.play(train_animations[train.rail]);
            train.indefeatable = false;
        } else if (time_delta === 0.0){

            //gameplay actions
            sound_eu_star.play();
            update_coin_counter(10);

            //set new object properties
            let position_next = get_next_eu_star_position();
            object.sprite.anchor.setTo(0.5, 0.5);
            object.angle_index = position_next.angle_index;
            let scale_next = rail_distance_inner * 1.5
                           / object.object_height_original;
            eu_star_objects.push(object);
            let auto_start = false;
            let delay = 0;

            let sky_travel = game.add.tween(object.sprite).to(
                                            {
                                               x: position_next.x,
                                               y: position_next.y
                                            },
                                            eu_star_travel_time,
                                            Phaser.Easing.Cubic.Out,
                                            auto_start,
                                            delay
                                            );
            let sky_scale = game.add.tween(object.sprite.scale).to(
                                            {
                                               x: scale_next,
                                               y: scale_next
                                            },
                                            eu_star_travel_time,
                                            Phaser.Easing.Cubic.Out,
                                            auto_start,
                                            delay
                                            );

            if (position_next.star_is_last) {
                eu_star_can_spawn = false;
                sky_travel.onComplete.add(eu_flag_complete_event);
            } else {
                eu_star_can_spawn = true;
            }


            sky_travel.start();
            sky_scale.start();

            // set train properties
            train.indefeatable = false;
            train.star_phase = true;


            train.animations.play(train_star_animations[train.rail]);

            // velocities
            v = v_default * eu_star_phase_factor;
            rail_object_rate = rail_object_rate_default / eu_star_phase_factor;
            // dam_object_rate = dam_object_rate_default / eu_star_phase_factor;// never used @TODO #37

        }
    }

    if (train.star_phase) {
        if (object.kind == "wall" ||
            object.kind == "wall_frauke" ||
            object.kind == "wall_donald") {
            let time_delta = time_now - object.time_start;
            if (time_delta > wall_animation_length) {
                object.sprite.destroy();
                object.collision = false;
                train.indefeatable = false;
            } else if (time_delta === 0.0) {
                sound_smash.play();
                notify_objective_c("smashed-wall");
                update_coin_counter(10);
            } else{
                object.sprite.x = object.point_start_x
                                + object.direction
                                * time_delta;
                object.sprite.y = object.point_start_y
                                - time_delta / 100.0
                                + Math.pow(time_delta, 2) / 1000.0;
                object.sprite.angle = object.direction * time_delta / 5;
            }
        }
    }  else {
        if (object.kind == "wall" ||
            object.kind == "wall_frauke" ||
            object.kind == "wall_donald") {
            let time_delta = time_now - object.time_start;
            if (time_delta > wall_animation_length) {
                object.sprite.destroy();
                object.collision = false;
                train.animations.play(train_animations[train.rail]);
                train.indefeatable = false;
            } else if (time_delta === 0.0){
                sound_smash.play();
                notify_objective_c("smashed-wall");
                train.animations.play("collision");
                train.indefeatable = true;
                if (coin_counter >= 10) {
                    coin_counter -= 10;
                } else {
                    coin_counter = 0;
                }
            } else {
                object.sprite.x = object.point_start_x
                                + object.direction * time_delta;
                object.sprite.y = object.point_start_y
                                - time_delta / 100.0
                                + Math.pow(time_delta, 2) / 1000.0;
                object.sprite.angle = object.direction * time_delta / 5;
            }
        }
    }
}

function flip_z(z) {
    return canvas_height - z;
}

function flip_x(x) {
    return canvas_width - x;
}

function get_dam_object(kind) {

    // get spawn rail
    let random_rail = Math.floor(Math.random() * 2);

    // get corresponding starting position
    let dam_width = canvas_width / 2
                  - 1.5 * rail_distance_outer
                  - rail_distance_inner - 35;
    let dam_offset = random_rail * (canvas_width / 2
                   + 1.5 * rail_distance_outer
                   + rail_distance_inner + 35);
    let point_start_x = dam_width * Math.random() + dam_offset;
    let object_height;
    let object_width;
    let object_height_original;
    let object_width_original;

    let sprite = rail_object_group.create(0, 0, kind);

    if (kind == "tree0") {
        object_height = 40;
    } else if (kind == "tree1") {
        object_height = 35;
    } else if (kind == "tree2") {
        object_height = 35;
    } else if (kind == "bush") {
        object_height = 10;
    } else if (kind == "sign") {
        object_height = 20;
    } else if (kind == "frauke") {
        object_height = 25;
    } else if (kind == "donald") {
        object_height = 25;
    }

    sprite.anchor.setTo(0.5, 0.5);

    // set start x-value
    sprite.x = point_start_x;
    // flip_z is necessary due to different orientation of screen coordinates
    sprite.y = flip_z(horizon + object_height / 2);

    // get the original height of the object to scale it to the wanted heifht
    object_height_original = sprite.height;
    object_width_original = sprite.width;

    //get and set new scale
    let scale_next = object_height / object_height_original;
    sprite.scale.setTo(scale_next, scale_next);
    object_width = sprite.width;

    let rail_object = {
        "kind": kind,
        "rail": -1,
        "sprite": sprite,
        "object_height_original": object_height_original,
        "object_width_original": object_width_original,
        "time_start": time_now,
        "active": true,
        "object_width": object_width,
        "object_height": object_height,
        "point_start_x": point_start_x,
        "y": 0,
        "collision": false
    };

    return rail_object;
}

function get_rail_object(kind)
{
    // get spawn rail
    let random_rail = Math.floor(Math.random() * 3);

    //get corresponding starting position
    let point_start_x = canvas_width / 2
                      - rail_distance_outer - rail_distance_inner
                      + random_rail * (rail_distance_outer
                      + rail_distance_inner);
    let object_height;
    let object_width;
    let object_height_original;
    let object_width_original;

    let sprite = rail_object_group.create(0, 0, kind);

    if (kind == 'wall') {
        object_height = rail_distance_inner * 0.80;
    } else if (kind == 'wall_frauke') {
        object_height = rail_distance_inner * 1.50;
    } else if (kind == 'wall_donald') {
        object_height = rail_distance_inner * 1.55;
    } else if (kind == 'star') {
        object_height = rail_distance_inner;
    } else if (kind == 'coin') {
        object_height = rail_distance_outer;

        sprite.animations.add('rotate0', [0, 1, 2], 8, true);
        sprite.animations.add('rotate1', [1, 2, 0], 8, true);
        sprite.animations.add('rotate2', [2, 0, 1], 8, true);
        let flip = Math.random();
        if (flip < 0.333) {
            sprite.animations.play('rotate0');
        } else if (flip < 0.667) {
            sprite.animations.play('rotate1');
        } else {
            sprite.animations.play('rotate2');
        }
    }

    sprite.anchor.setTo(0.5, 0.5);

    // set start x-value
    sprite.x = point_start_x;

    // flip_z is necessary due to different orientation of screen coordinates
    sprite.y = flip_z(horizon + object_height / 2);

    // get the original height of the object to scale it to the wanted heifht
    object_height_original = sprite.height;
    object_width_original = sprite.width;

    // get and set new scale
    let scale_next = object_height / object_height_original;
    sprite.scale.setTo(scale_next, scale_next);
    object_width = sprite.width;

    let rail_object = {
        "kind": kind,
        "rail": random_rail,
        "sprite": sprite,
        "object_height_original": object_height_original,
        "object_width_original": object_width_original,
        "time_start": game.time.now,
        "y": 0,
        "active": true,
        "object_width": object_width,
        "object_height": object_height,
        "point_start_x": point_start_x,
        "collision": false
    };

    return rail_object;
}

function update_rail_object(object, schulzzug) {

    // get current time
    let time = game.time.now;
    let time_delta = time - object.time_start;
    object.time_start = time;

    // get position between horizon and camera
    let y = object.y + v * time_delta;
    object.y = y;

    // get center position of test object
    let sprite_center_x = camera_x
                        - horizon_distance / (horizon_distance - y)
                        * (camera_x - object.point_start_x);

    // set center position of object
    object.sprite.x = sprite_center_x;

    // get new width
    let width = -horizon_distance * ((camera_x
              - (object.point_start_x + object.object_width / 2))
              / (horizon_distance - y) - (camera_x
              - (object.point_start_x - object.object_width / 2))
              / (horizon_distance - y));

    // get and set new scale of object
    let wScale = width / object.object_width_original;
    object.sprite.scale.setTo(wScale);

    // get vertical coordinate
    let height = camera_heigth - horizon_distance
               / (horizon_distance - y) * (camera_heigth
               - object.object_height / 2) + horizon;
    object.sprite.y = flip_z(height);

    // get collision range, destroy if out of scope
    if (y > horizon_distance)
    {
        object.sprite.destroy();
        object.active = false;
    }

    if (y > y_collision_range_start &&
        y < y_collision_range_end &&
        !schulzzug.indefeatable) {
        if (object.rail == schulzzug.rail) {
            object.collision = true;
            object.active = false;
        }
    }
}

function notify_objective_c(notifciation) {
    if(IOS_MODE) {
        let iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", "ios-js://"+notifciation);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }
}

function activateIosMode() {
    IOS_MODE = true;
}

function update_coin_counter(coins) {
    coin_counter += coins;
}

function eu_flag_complete_event() {
    let eu_flag_radius = canvas_width / 1.5;
    let eu_flag_height = canvas_width / 3.0;
    let eu_flag_position = {
       x: canvas_width / 2.0,
       y: canvas_height + eu_flag_radius + eu_flag_height / 2.0
    };

    for(let i = eu_stars_count - 1; i >= 0; i--) {
        let star = eu_star_objects[i];
        let star_angle = get_angle_from_index(star.angle_index);
        let position_next = {
            x: eu_flag_position.x + eu_flag_radius * Math.cos(star_angle),
            y: eu_flag_position.y + eu_flag_radius * Math.sin(star_angle)
        };
        let scale_next = eu_flag_height / star.object_height_original;
        let star_alpha = 0;
        let auto_start = false;
        let delay = eu_star_phase_duration - eu_star_travel_time;

        let pulse_count = 12;
        let pulse_duration = delay / (2 * pulse_count);
        let pulse_scale = star.sprite.height
                        / star.object_height_original * 1.3;
        let pulse_delay = 0;
        let pulse_yoyo = true;

        let star_pulse = game.add.tween(star.sprite.scale).to(
                        {
                            x: pulse_scale,
                            y: pulse_scale
                        },
                        pulse_duration,
                        Phaser.Easing.Bounce.InOut,
                        auto_start,
                        pulse_delay,
                        pulse_count,
                        pulse_yoyo
                     );

        let star_travel = game.add.tween(star.sprite).to(
                        {
                            alpha: star_alpha,
                            x: position_next.x,
                            y: position_next.y
                        },
                        eu_star_travel_time,
                        Phaser.Easing.Cubic.In,
                        auto_start
                        );
        let star_scale = game.add.tween(star.sprite.scale).to(
                        {
                            x: scale_next,
                            y: scale_next
                        },
                        eu_star_travel_time,
                        Phaser.Easing.Cubic.In,
                        auto_start
                        );
        if (i == 0) {
            star_travel.onComplete.add(function(target, tween) {
                target.destroy();
                let v_scale = v_default / (v_default + eu_event_delta_v);
                v_default += eu_event_delta_v;
                v = v_default;
                rail_object_rate_default *= v_scale;
                dam_object_rate_default *= v_scale;
                rail_object_rate = rail_object_rate_default;
                // dam_object_rate = dam_object_rate_default;                   // never used @TODO #37
                eu_star_can_spawn = true;
            });
        } else {
            star_travel.onComplete.add(function(target, tween) {
                target.destroy();
            });
        }
        eu_star_objects.pop();

        star_pulse.onComplete.add(function(target, tween) {
            star_travel.start();
            star_scale.start();
        });

        star_pulse.start();
    }
}

function get_next_eu_star_position() {
    let index = Math.floor(Math.random() * eu_stars_indices.length);
    let index_phi = eu_stars_indices[index];
    eu_stars_indices.splice(index, 1);
    let angle = get_angle_from_index(index_phi);
    let position_next = {
        x: eu_position.x + eu_radius * Math.cos(angle),
        y: eu_position.y + eu_radius * Math.sin(angle),
        star_is_last: false,
        angle_index: index_phi
    };

    if (eu_stars_indices.length === 0) {
        position_next.star_is_last = true;
        for(let i=0; i<eu_stars_count; i++) {
            eu_stars_indices.push(i);
        }
    }

    return position_next;
}

function get_angle_from_index(index_phi) {
    let angle = (delta_phi * index_phi - 90) / 180 * Math.PI;
    return angle;
}

function is_retina() {
    let query = "(-webkit-min-device-pixel-ratio: 2), "
              + "(min-device-pixel-ratio: 2), "
              + "(min-resolution: 192dpi)";

    if (matchMedia(query).matches) {
        return true;
    } else {
        // do non high-dpi stuff
    }
    return false;
}
