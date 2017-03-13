// =============== PHASER CREATE GAME ENVIRONMENT ==============================

function core_create() {


    // keys
    key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    key_space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key_mute = game.input.keyboard.addKey(Phaser.Keyboard.M);

    // start physics and add basic sprites
    var grass_sprite = game.add.sprite(0, 0, level_backgrounds[level_names[current_level]].green);
    var dirt_sprite = game.add.sprite(0, 0, level_backgrounds[level_names[current_level]].dirt);
    var sky_sprite = game.add.sprite(0, 0, level_backgrounds[level_names[current_level]].sky);

    if(is_retina()){
        grass_sprite.scale.setTo(0.5,0.5);
        dirt_sprite.scale.setTo(0.5,0.5);
        sky_sprite.scale.setTo(0.5,0.5);
    }

    // sprite group for clouds
    cloud_object_group = game.add.group();

    //enable swipe and set time delta between swipe events
    swipe_gesture_recognizer = new Swipe(game);
    swipe_gesture_recognizer.next_event_rate = key_change_time_block;
    swipe_direction = 0;

    // sounds
    sound_bling = game.add.audio('bling');
    sound_bling.volume = 0.2;
    sound_smash = game.add.audio('smash');
    sound_smash.volume = 0.15;
    sound_jump = game.add.audio('jump');
    sound_jump.volume = 0.25;
    sound_eu_star = game.add.audio('star');
    sound_eu_star.volume = 0.5;
    sound_eu_star.onStop.add( function () {
        switch_bg_music();
    });
    sound_eu_star.onPlay.add( function () {
        switch_bg_music();
    });
    // sound_win = game.add.audio('tada');                                      // never used @TODO #36
    sound_whistle = game.add.audio('whistle');
    sound_whistle.volume = 1;
    sound_background = game.add.audio('ratter');
    sound_background.volume = 0.21;

    sound_bg_music = game.add.audio('bg_music');
    sound_bg_music.volume = 0.5;
    sound_bg_music.loop = true;
    sound_bg_music.play();

    // start background train sound as loop
    game.sound.mute = false;
    sound_background.loop = true;
    sound_background.play();

    // set some time variables so thehy are not undefined
    rail_object_time = game.time.now;
    dam_object_time = game.time.now;
    key_change_time = game.time.now;
    last_velocity_scale_time = game.time.now;
    time_now = game.time.now;
    time_last = time_now - 1;
    firebase_submission_time = time_now + 15000;

    // add the animated rails
    var rails = game.add.sprite(0, 208, 'rails');

    if(is_retina()) {
        rails.scale.setTo(0.5, 0.5);
    }

    rails.animations.add('move', [0, 1, 2], 8, true);
    rails.animations.play('move');

    // sprite group fot rail objects
    rail_object_group = game.add.group();

    // statistics display
    var style = "align:center;font-family:'SilkScreen',monospace";
    panel = game.add.sprite(0, canvas_height - 72, 'panel');
    if(is_retina())
        panel.scale.setTo(0.5,0.5);
    text_score = game.add.text(0, canvas_height - 72, "0", style);
    text_score.anchor.set(0.5);
    text_distance = game.add.text(0, canvas_height - 72, "0m", style);
    text_distance.anchor.set(0.5);

    flying_coin_group = game.add.group();

    // add player (train)
    train = game.add.sprite(train_position[1], train_spacing_y, 'train');
    game.physics.arcade.enable(train);

    //sprite name, array of positions within sprite, fps, should loop
    train.animations.add('train_left', [0, 1], 7, true);
    train.animations.add('train_center', [2, 3], 7, true);
    train.animations.add('train_right', [4, 5], 7, true);
    train.animations.add('jump_left',[6],10,true);
    train.animations.add('jump_right',[7],10,true);

    train.animations.add('collision_left',[8,9,20],10,true);
    train.animations.add('collision_center',[10,11,20],10,true);
    train.animations.add('collision_right',[12,13,20],10,true);

    train.animations.add('star_left', [14,15], 10, true);
    train.animations.add('star_center', [16,17], 10, true);
    train.animations.add('star_right', [18,19], 10, true);

    if(is_retina()) {
        train.scale.setTo(0.5, 0.5);
    }

    // train is at center rail
    train.animations.play('train_center');
    train.rail = 1;
    train.indefeatable = false;
    train.star_phase = false;

    // fade in rectangle
    var rect = game.add.sprite(0,0,"black");
    rect.width = canvas_width;
    rect.height = canvas_height;
    rect.alpha = 1;

    var fade_out = game.add.tween(rect).to(
                                            {
                                                alpha: 0
                                            },
                                            2*state_transition_duration,
                                            Phaser.Easing.Linear.None
                                          );

    var level_style = { align:"center",
                       fill:'red',
                       font:"50px 'SilkScreen' monospace"
                      }
    var text_level = game.add.text(canvas_width/2,
                               canvas_height/6,
                               "LEVEL " + (current_level+1),
                               level_style);
    text_level.anchor.set(0.5);
    text_level.font = 'SilkScreen';
    var text_level_fade_out = game.add.tween(text_level).to(
                                                      {
                                                          alpha: 0
                                                      },
                                            5000,
                                            Phaser.Easing.Linear.None
                                            );

    fade_out.onComplete.add( function (){
        text_level_fade_out.start();
    });

    fade_out.start();
}

// =============== PHASER UPDATE GAME ENVIRONMENT ==============================

function core_update() {

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
    time_last = time_now;
    time_now = game.time.now;
    var time_delta = time_now - time_last;

    // ========================= PLAYER CONTROL ===========================
    var direction = null;

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
        var swipe = swipe_gesture_recognizer.check();
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
        time_now - key_change_time > key_change_time_block
        ) {
        var jump_direction = null;
        if (((             // go left
              direction !== null
              && direction == swipe_gesture_recognizer.DIRECTION_LEFT
              ) ||
             key_left.isDown
             ) &&
            train.rail > 0
            ) {
            rail_is_changing = true;
            if ( (!train.star_phase) && (!train.indefeatable) ){
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
            if ( (!train.star_phase) && (!train.indefeatable) ){
                train.animations.play("jump_right");
            }
            jump_direction = +1;
        }

        if (rail_is_changing) {
            train.v_x = jump_direction / rail_jump_duration;
            train_rail_next = train.rail + jump_direction;
            rail_jump_start = time_now;
            key_change_time = time_now;
            rail_can_change = false;
            train_can_jump_up = false;
            train.rail = -1;
            train.x_previous = train.x;
            train.y_previous = train.y;
            sound_jump.play();
        }
    }

    // check if train should jump up
    if (train.rail !== -1 && time_now - key_change_time > key_change_time_block ) {
        if ((direction !== null &&
             direction == swipe_gesture_recognizer.DIRECTION_UP) ||
            key_up.isDown
            ) {
            train_is_jumping_up = true;
            train_rail_next = train.rail;
            train_up_jump_start = time_now;
            train.rail = -1;
            train_can_jump_up = false;
            sound_jump.play();
        }
    }

    if (train_is_jumping_up) {
        var time_delta = (time_now - train_up_jump_start);
        if (time_delta < train_up_jump_duration) {
            var a = 1 / 300.0;
            train.y = train_spacing_y - time_delta
            * train_up_jump_duration * a
            + Math.pow(time_delta, 2) * a;
        } else {
            train.y = train_spacing_y;
            train.rail = train_rail_next;
            rail_can_change = true;
            train_can_jump_up = true;
            train_is_jumping_up = false;
            if (train.star_phase) {
                train.animations.play(train_star_animations[train.rail]);
            } else if (train.indefeatable) {
                train.animations.play(train_collision_animations[train.rail]);
            } else {
                train.animations.play(train_animations[train.rail]);
            }
        }
    }

    // rail change animation
    if (rail_is_changing) {
        var time_delta = (time_now - rail_jump_start);
        if (time_delta < rail_jump_duration) {
            train.x = train.x_previous + train_position_distance
            * train.v_x * time_delta;
            var a = 0.002;
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
            if (train.star_phase) {
                train.animations.play(train_star_animations[train.rail]);
            } else if (train.indefeatable) {
                train.animations.play(train_collision_animations[train.rail]);
            } else {
                train.animations.play(train_animations[train.rail]);
            }
        }
    }

    // ====================== UPDATING RAIL AND DAM OBJECTS ====================

    // for saving the indices of objects being out of scope
    var rail_indices_to_remove = Array();
    var dam_indices_to_remove = Array();

    // loop trough all rail objects
    for (var i = 0; i < rail_objects.length; i++) {
        // update according to new time
        // pass the train object to see if there's a collision
        update_rail_object(rail_objects[i],train);

        // remove if the object is now out of scope
        if (!rail_objects[i].active) {
            rail_indices_to_remove.push(i);
            if (rail_objects[i].kind == "eurostar") {
                eu_star_can_spawn = true;
            }
        }

        // if there's a collision with the train
        if (rail_objects[i].collision) {

            // set a new starting point for this object
            // both in time and space
            rail_objects[i].time_start = time_now;
            rail_objects[i].point_start_x = rail_objects[i].sprite.x;
            rail_objects[i].point_start_y = rail_objects[i].sprite.y;

            // save direction of the object in case
            // it's a wall and has to fly somewhere
            var left_right;
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
    delete_indices_from_array(rail_indices_to_remove, rail_objects);

    // update all dam objects in a similar manner
    for (var i = 0; i < dam_objects.length; i++) {
        update_rail_object(dam_objects[i],train);
        if (!dam_objects[i].active) {
            dam_indices_to_remove.push(i);
        }
    }
    delete_indices_from_array(dam_indices_to_remove, dam_objects);

    // loop through collision objects
    var collision_indices = Array();

    for (var i=0; i < collision_objects.length; i++) {

        // update according to their logic
        collision_update(collision_objects[i],train);

        // remove if collision animation is over (set in collision_update())
        if (!collision_objects[i].collision) {
            collision_indices.push(i);
        }
    }
    delete_indices_from_array(collision_indices, collision_objects);

    // ========================= SPAWNING NEW OBJECTS ============================
    //
    if (time_now - rail_object_time > rail_object_rate) {

        var kind = 'coin';
        var random_float = Math.random();
        var spawn_at_rail = null;

        // there's different objects if the train is in star_phase
        if (!train.star_phase){
            if (eu_star_can_spawn &&
                rail_objects.length > 0 &&
                rail_objects[rail_objects.length-1].kind == 'wall' &&
                random_float < eu_star_appearance_probability) {
                kind = 'eurostar';
                eu_star_can_spawn = false;
                spawn_at_rail = rail_objects[rail_objects.length-1].rail;
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

        rail_objects.push(get_rail_object(kind,spawn_at_rail));

        // bring the older objects to the top again
        for (var i = rail_objects.length; i--; ) {
            rail_objects[i].sprite.bringToTop();
        }

        rail_object_time = time_now;
    }

    // spawn new dam objects
    if (time_now - dam_object_time > dam_object_rate) {
        var total_dam_probability = 0;
        var random_number = Math.random();

        for (var kind in dam_probabilities) {

            // skip loop if the property is from prototype
            if (!dam_probabilities.hasOwnProperty(kind)) continue;

            total_dam_probability += dam_probabilities[kind];

            if (random_number < total_dam_probability) {
                dam_objects.push(get_dam_object(kind));

                for (var i = dam_objects.length; i--; ) {
                    dam_objects[i].sprite.bringToTop();
                }

                // get out of for loop
                break;
            }
        }
        dam_object_time = time_now;
    }

    for (var i = 0; i < eu_star_objects.length; i++) {
        eu_star_objects[i].sprite.bringToTop();
    }

    // =========== update velocity after collision ============
    update_velocity();

    // spawn new clouds
    if (Math.random() < 0.01) {
        generate_cloud();
    }

    // update statistics
    meter_counter += time_delta * v / 1000.0;

    // Firebase: Save game result every 15 seconds.
    var firebase_time_now = game.time.now;
    if (firebase_submission_time + 15000 < firebase_time_now) {
        updateGameResult(coin_counter, meter_counter);
        firebase_submission_time = firebase_time_now;
    }

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

function update_velocity(scale_event,scale) {

    function scale_velocity(new_scale) {
        v = new_scale * v_default;
        rail_object_rate = rail_object_rate_default / new_scale;
        dam_object_rate = dam_object_rate_default / new_scale;
    }

    if (scale_event == null) {
        //do a simple update according to the acceleration rules
        //
        if (last_scale_event == "collision")
        {
            var time_delta = time_now - time_last;

            if ( time_now - last_velocity_scale_time < time_until_full_velocity) {
                var v_drop = v_default * last_velocity_scale;
                v += time_delta * (v_default - v_drop) / time_until_full_velocity;
                var rail_object_rate_drop = rail_object_rate_default / last_velocity_scale;
                var dam_object_rate_drop = dam_object_rate_default / last_velocity_scale;
                rail_object_rate += time_delta / time_until_full_velocity * (rail_object_rate_default - rail_object_rate_drop);
                dam_object_rate += time_delta / time_until_full_velocity * (dam_object_rate_default - dam_object_rate_drop);
            }
            else {
                last_scale_event = "default";
                scale_velocity(1.0);
            }
        }
        else if (last_scale_event == "star")
        {
            if (time_now - last_velocity_scale_time > eu_star_phase_duration) {
                last_scale_event = "default";
                scale_velocity(1.0);
            }
        }

    }
    else if (scale_event == "default") {
        // scale back to standard values
        last_scale_event = "default";
        scale_velocity(1.0);
    }
    else if (scale_event == "collision") {
        // scale to wanted scale
        last_scale_event = "collision";
        last_velocity_scale = collision_velocity_drop_ratio;
        last_velocity_scale_time = time_now;
        scale_velocity(last_velocity_scale);
    }
    else if (scale_event == "star") {
        last_scale_event = "star";
        last_velocity_scale = eu_star_phase_factor;
        last_velocity_scale_time = time_now;
        scale_velocity(last_velocity_scale);
    }
    else if (scale_event == "increase_default_velocity"){
        var v_scale = v_default / (v_default + eu_event_delta_v);
        v_default += eu_event_delta_v;
        v = v_default;
        rail_object_rate_default *= v_scale;
        dam_object_rate_default *= v_scale;
        rail_object_rate = rail_object_rate_default;
        dam_object_rate = dam_object_rate_default;
        last_scale_event = "default";
    }
    else if (scale_event == "level_change"){
        var v_scale = v_default / (v_initial + eu_event_delta_v * current_level);
        v_default /= v_scale;
        v = v_default;
        rail_object_rate_default *= v_scale;
        dam_object_rate_default *= v_scale;
        rail_object_rate = rail_object_rate_default;
        dam_object_rate = dam_object_rate_default;
        last_scale_event = "default";
    }

}

function get_metric_prefix(decimal, number_digits) {
    var prefix = [
                  { value: 1E18, symbol: "E" },
                  { value: 1E15, symbol: "P" },
                  { value: 1E12, symbol: "T" },
                  { value: 1E09, symbol: "G" },
                  { value: 1E06, symbol: "M" },
                  { value: 1E03, symbol: "k" }
                  ];
    var expression = /\.0+$|(\.[0-9]*[1-9])0+$/;
    for (var i = 0; i < prefix.length; i++) {
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
    var seed = Math.random();
    var cloud_height = Math.random() * 176;
    var cloud_type = 'cloud0';
    if (seed < 0.333) {
        cloud_type = 'cloud1';
    } else if (seed < 0.667) {
        cloud_type = 'cloud2';
    } else {
        cloud_type = 'cloud0';
    }
    var cloud = cloud_object_group.create(-60, cloud_height, cloud_type);
    if(is_retina()) {
        cloud.scale.setTo(0.5,0.5);
    }
    cloud.checkWorldBounds = true;
    cloud.events.onOutOfBounds.add( function () {
                                   if (cloud.x > canvas_width)
                                   cloud.destroy();
                                   });
    game.physics.arcade.enable(cloud);
    cloud.body.gravity.x = 2 + Math.random() * 4;
}

function delete_indices_from_array(indices, array) {

    // delete object from rail_objects updated
    for (var i = indices.length - 1; i >= 0; i--) {
        array.splice(indices[i], 1);
    }
}

function collision_update(object, train) {
    if (object.kind == "coin") {
        sound_bling.play();
        object.collision = false;
        var sprite = flying_coin_group.create(
                                              object.sprite.x-object.sprite.width/2,
                                              object.sprite.y-object.sprite.height/2,
                                              "coin"
                                              );
        sprite.width = object.sprite.width;
        sprite.height = object.sprite.height;
        set_coin_sprite(sprite);
        sprite.anchor.setTo(0.5,0.5);

        const coin_duration = 800;
        var coin_collect = game.add.tween(sprite).to(
                                                     {
                                                     x: text_score.x,
                                                     y: text_score.y,
                                                     width: sprite.width/2,
                                                     height: sprite.height/2,
                                                     alpha: .6
                                                     },
                                                     coin_duration,
                                                     Phaser.Easing.Cubic.Out
                                                     );
        coin_collect.onComplete.add(function () {
                                    update_coin_counter(1);
                                    sprite.destroy();
                                    });
        object.sprite.destroy();
        coin_collect.start();
    }

    if (object.kind == "eurostar") {
        var time_delta = time_now - object.time_start;
        if (time_delta > eu_star_phase_duration) {
            train.star_phase = false;
            object.collision = false;
            train.animations.play(train_animations[train.rail]);
            train.indefeatable = false;
        } else if (time_delta === 0.0){

            //gameplay actions
            sound_eu_star.play();
            update_coin_counter(10);
            object.sprite.animations.play("static");

            //set new object properties
            var position_next = get_next_eu_star_position();
            object.sprite.anchor.setTo(0.5, 0.5);
            object.angle_index = position_next.angle_index;
            var scale_next = rail_distance_inner * 1.5
            / object.object_height_original;
            eu_star_objects.push(object);
            var auto_start = false;
            var delay = 0;

            var sky_travel = game.add.tween(object.sprite).to(
                                                              {
                                                              x: position_next.x,
                                                              y: position_next.y
                                                              },
                                                              eu_star_travel_time,
                                                              Phaser.Easing.Cubic.Out,
                                                              auto_start,
                                                              delay
                                                              );
            var sky_scale = game.add.tween(object.sprite.scale).to(
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
            update_velocity("star");
        }
    }

    if (train.star_phase) {
        if (object.kind == "wall" ||
            object.kind == "wall_frauke" ||
            object.kind == "wall_donald") {
            var time_delta = time_now - object.time_start;
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
            var time_delta = time_now - object.time_start;
            if (time_delta > wall_animation_length) {
                object.sprite.destroy();
                object.collision = false;
                train.animations.play(train_animations[train.rail]);
                train.indefeatable = false;
            } else if (time_delta === 0.0){
                sound_smash.play();
                notify_objective_c("smashed-wall");
                train.animations.play(train_collision_animations[train.rail]);
                train.indefeatable = true;
                update_coin_counter(wall_coin_penalty);
                update_velocity("collision");
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
    var random_rail = Math.floor(Math.random() * 2);
    var min_distance_to_rail = 15; // if this is smaller than 35,

    // get corresponding starting position
    var dam_width = canvas_width / 2
    - 1.5 * rail_distance_outer
    - rail_distance_inner - min_distance_to_rail;
    var exp_random = - Math.log(1-Math.random()) * (dam_width) / 3.;
    if (exp_random>dam_width) {
        exp_random = dam_width * Math.random();
    }

    if (random_rail == 0){
        exp_random = dam_width - exp_random;
    }

    var dam_offset = random_rail * (canvas_width / 2
                                    + 1.5 * rail_distance_outer
                                    + rail_distance_inner + min_distance_to_rail);
    var point_start_x = exp_random + dam_offset;
    var object_height;
    var object_width;
    var object_height_original;
    var object_width_original;

    var sprite = rail_object_group.create(0, 0, kind);
    sprite.anchor.setTo(0.5,0);

    if (kind == "tree0") {
        object_height = 40;
    } else if (kind == "tree1") {
        object_height = 35;
    } else if (kind == "olivetree") {
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
    } else if (kind == "erdogan") {
        object_height = 25;
    } else if (kind == "cactus0") {
        object_height = 35;
    } else if (kind == "cactus1") {
        object_height = 15;
    } else if (kind == "tumbleweed") {
        object_height = 15;
    } else if (kind == "goat") {
        object_height = 15;
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
    var scale_next = object_height / object_height_original;
    sprite.scale.setTo(scale_next, scale_next);
    object_width = sprite.width;

    var rail_object = {
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

function get_rail_object(kind,spawn_at_rail)
{
    // get spawn rail
    var random_rail;
    if (spawn_at_rail == null)
        random_rail = Math.floor(Math.random() * 3);
    else
        random_rail = spawn_at_rail;

    //get corresponding starting position
    var point_start_x = canvas_width / 2
    - rail_distance_outer - rail_distance_inner
    + random_rail * (rail_distance_outer
                     + rail_distance_inner);
    var object_height;
    var object_width;
    var object_height_original;
    var object_width_original;

    var sprite = rail_object_group.create(0, 0, kind);

    if (kind == 'wall') {
        object_height = rail_distance_inner * 0.80;
    } else if (kind == 'wall_frauke') {
        object_height = rail_distance_inner * 1.50;
    } else if (kind == 'wall_donald') {
        object_height = rail_distance_inner * 1.55;
    } else if (kind == 'eurostar') {
        object_height = rail_distance_inner;
        sprite.animations.add("blink",[0,1,2],8,true);
        sprite.animations.add("static",[0],8,true);
        sprite.animations.play("blink");
    } else if (kind == 'coin') {
        object_height = rail_distance_outer;
        set_coin_sprite(sprite);
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
    var scale_next = object_height / object_height_original;
    sprite.scale.setTo(scale_next, scale_next);
    object_width = sprite.width;

    var rail_object = {
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

function set_coin_sprite(sprite){
    sprite.animations.add('rotate0', [0, 1, 2], 8, true);
    sprite.animations.add('rotate1', [1, 2, 0], 8, true);
    sprite.animations.add('rotate2', [2, 0, 1], 8, true);
    var flip = Math.random();
    if (flip < 0.333) {
        sprite.animations.play('rotate0');
    } else if (flip < 0.667) {
        sprite.animations.play('rotate1');
    } else {
        sprite.animations.play('rotate2');
    }
}

function update_rail_object(object, schulzzug) {

    // get current time
    var time = game.time.now;
    var time_delta = time - object.time_start;
    object.time_start = time;

    // get position between horizon and camera
    var y = object.y + v * time_delta;
    object.y = y;

    // get center position of test object
    var sprite_center_x = camera_x
    - horizon_distance / (horizon_distance - y)
    * (camera_x - object.point_start_x);

    // set center position of object
    object.sprite.x = sprite_center_x;

    // get new width
    var width = -horizon_distance * ((camera_x
                                      - (object.point_start_x + object.object_width / 2))
                                     / (horizon_distance - y) - (camera_x
                                                                 - (object.point_start_x - object.object_width / 2))
                                     / (horizon_distance - y));

    // get and set new scale of object
    var wScale = width / object.object_width_original;
    object.sprite.scale.setTo(wScale);

    // get vertical coordinate
    var height = camera_height - horizon_distance
    / (horizon_distance - y) * (camera_height
                                - object.object_height / 2) + horizon;
    object.sprite.y = flip_z(height);

    // get collision range, destroy if out of scope
    if (y > horizon_distance)
    {
        object.sprite.alpha = 0;
        object.sprite.destroy();
        object.active = false;
    }



    if (object.rail >= 0 &&
        object.rail <= 2 &&
        y > y_collision_range_start &&
        y < y_collision_range_end &&
        !schulzzug.indefeatable &&
        object.rail == schulzzug.rail ){
            object.collision = true;
            object.active = false;
    }
}

function notify_objective_c(notifciation) {
    if(IOS_MODE) {
        var iframe = document.createElement("IFRAME");
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
    //check if too negative

    // statistics display
    if (Math.abs(coins) > 1){
        var style = {align:"center",
            font:'30px SilkScreen monospace'}
        var base_text = "";
        if (coins>0) {
            base_text = "+";
            style.fill = "green";
        } else if (coins<0) {
            base_text = "";
            style.fill = "red";
        }

        var text_coin;
        text_coin = game.add.text(train.x+train.width/2, train.y, "0", style);
        text_coin.anchor.set(0.5);
        text_coin.setText(base_text+Math.round(coins));
        text_coin.font = 'SilkScreen';

        var up_duration = 1500;
        var coin_up = game.add.tween(text_coin).to(
                                                   {
                                                   y: 0,
                                                   alpha: 0
                                                   },
                                                   up_duration,
                                                   Phaser.Easing.Linear.None
                                                   );

        coin_up.onComplete.add( function () {
                               text_coin.destroy()
                               });
        coin_up.start();
    }

    if (coin_counter + coins < 0) {
        coin_counter = 0;
    } else {
        coin_counter += coins;
    }
}

function eu_flag_complete_event() {
    var eu_flag_radius = canvas_width / 1.5;
    var eu_flag_height = canvas_width / 3.0;
    var eu_flag_position = {
    x: canvas_width / 2.0,
    y: canvas_height + eu_flag_radius + eu_flag_height / 2.0
    };

    for(var i = eu_stars_count - 1; i >= 0; i--) {
        var star = eu_star_objects[i];
        var star_angle = get_angle_from_index(star.angle_index);
        var position_next = {
        x: eu_flag_position.x + eu_flag_radius * Math.cos(star_angle),
        y: eu_flag_position.y + eu_flag_radius * Math.sin(star_angle)
        };
        var scale_next = eu_flag_height / star.object_height_original;
        var star_alpha = 0;
        var auto_start = false;
        var delay = eu_star_phase_duration - eu_star_travel_time;

        var pulse_count = 12;
        var pulse_duration = delay / (2 * pulse_count);
        var pulse_scale = star.sprite.height
        / star.object_height_original * 1.3;
        var pulse_delay = 0;
        var pulse_yoyo = true;

        var star_pulse = game.add.tween(star.sprite.scale).to(
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

        var star_travel = game.add.tween(star.sprite).to(
                                                         {
                                                         alpha: star_alpha,
                                                         x: position_next.x,
                                                         y: position_next.y
                                                         },
                                                         eu_star_travel_time,
                                                         Phaser.Easing.Cubic.In,
                                                         auto_start
                                                         );
        var star_scale = game.add.tween(star.sprite.scale).to(
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
                                       //update_velocity("increase_default_velocity");
                                       eu_star_can_spawn = true;
                                       next_level();
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

        star.sprite.animations.play("blink");
        star_pulse.start();
    }
}

function get_next_eu_star_position() {
    var index = Math.floor(Math.random() * eu_stars_indices.length);
    var index_phi = eu_stars_indices[index];
    eu_stars_indices.splice(index, 1);
    var angle = get_angle_from_index(index_phi);
    var position_next = {
    x: eu_position.x + eu_radius * Math.cos(angle),
    y: eu_position.y + eu_radius * Math.sin(angle),
    star_is_last: false,
    angle_index: index_phi
    };

    if (eu_stars_indices.length === 0) {
        position_next.star_is_last = true;
        for(var i=0; i<eu_stars_count; i++) {
            eu_stars_indices.push(i);
        }
    }

    return position_next;
}

function get_angle_from_index(index_phi) {
    var angle = (delta_phi * index_phi - 90) / 180 * Math.PI;
    return angle;
}

function switch_bg_music() {
    // in order to ensure that music resumes playing
    // in blocks of 4 bars
    if (sound_bg_music.isPlaying) {
        sound_bg_music.pause();
        var blocklength_of_4_bars_in_ms = 1 / (bg_music_bpm / 4 / 60) * 4 * 1000;
        var current_block = Math.floor(sound_bg_music.pausedPosition / blocklength_of_4_bars_in_ms);
        sound_bg_music.pausedPosition = current_block * blocklength_of_4_bars_in_ms;
    } else {
        sound_bg_music.resume();
    }
}

function next_level() {
    current_level++;
    var rect = game.add.sprite(0,0,"black");
    rect.width = canvas_width;
    rect.height = canvas_height;
    rect.alpha = 0;

    train.indefeatable = true;

    var fade_out = game.add.tween(rect).to(
                                            {
                                                alpha: 1
                                            },
                                            state_transition_duration,
                                            Phaser.Easing.Linear.None
                                          );
    fade_out.onComplete.add( function (){
        game.state.start(level_names[current_level]);
        train.indefeatable = false;
    });

    fade_out.start();
}
