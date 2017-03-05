/* global Phaser */

// canvas size
const width = 375;
const height = 667;

// object to be displayed (coin and such)
//let object;

// position of horizon on y-axis
const horizon = height - 208;

// Schulzzuggeschwindigkeit
let v = 10;

// distance to horizon
let L = 40000;

// height of camera
let h_camera = 50;

// x position of camera
let x_camera = width / 2;

// distances of rails
const raildistance_inner = 10;
const raildistance_outer = 6;

// height/width of test object
//let h_object = raildistance_inner;
//let w_object;

//start coordinate of test object
//let x_s = width / 2 - raildistance_outer - raildistance_inner;

// graphics object for lines
let gfx;

// game engine
let game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

// after that time, movement will start
//let t0;

let new_rail_object_rate = 500;
let last_rail_object_time;

let key_left;
let key_right;

let new_bahndamm_object_rate = 200;
let bahndamm_probabilities = {
    "tree0": 0.01,
    "tree1": 0.01,
    "tree2": 0.0001,
    "bush": 0.01,
    "sign": 0.001,
};
let last_bahndamm_object_time;

let coin_counter = 0;
let meter_counter = 0;

//collision ranges
let y_collision_begin_range = height / 2 * L / (h_camera+height / 2);
let y_collision_end_range = y_collision_begin_range + 1000;

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
    
    game.load.spritesheet('coin', 'assets/Coin.50.png', 32, 32);
    game.load.spritesheet('rails','assets/rails_animation.50.png', 375, 460);
    //game.load.spritesheet('train','assets/Train.52.png', 120, 232);
    game.load.spritesheet('train','assets/Trains_animation.50.png', 120, 232);
    
    game.load.audio('jump', 'sounds/jump.wav');
    game.load.audio('bling', 'sounds/coin.wav');
    game.load.audio('smash', 'sounds/wall_smash.wav');

}

//let original_object_height;
let railObjectGroup;
let railObjects = Array();
let collisionObjects = Array();
let bahndammObjects = Array();
let cloudObjectGroup;
let train;
let bahndammKinds = ["tree0","tree1","tree2","bush","sign"];

let train_position = Array();
train_position.push(-10);
train_position.push((width - 120) / 2);
train_position.push(width - 120+10);
let can_change_rail = true;

//key changing rate
let key_change_rate = 200;
let last_key_change_time;

let jump_duration = 200;
let last_jump_start;
let new_train_rail;
let train_std_y = 360;

let panel;
let text_score;
let text_distance;

let bling;
let smash;
let jump;

// create scenery
function create() {
    
    //keys
    key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    //add for gleise
    gfx = game.add.graphics(0, 0); 
    gfx.lineStyle(1, 0xff0000, 1);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'landscape');
    game.add.sprite(0, 0, 'grass');
    game.add.sprite(0, 0, 'dirt');
    game.add.sprite(0, 0, 'sky');

    bling = game.add.audio('bling');
    smash = game.add.audio('smash');
     jump = game.add.audio( 'jump');
        
    last_rail_object_time = game.time.now;
    last_bahndamm_object_time = game.time.now;
    last_key_change_time = game.time.now;

    cloudObjectGroup = game.add.group();
    
    let rails = game.add.sprite(0, 208, 'rails');
    rails.animations.add('move', [0, 1, 2], 8, true);
    rails.animations.play('move');
    
    railObjectGroup = game.add.group();
    
    train = game.add.sprite(train_position[1], train_std_y, 'train');
    game.physics.arcade.enable(train);
    train.animations.add('links', [0, 1], 7, true);
    train.animations.add('mitte', [2, 3], 7, true);
    train.animations.add('rechts', [4, 5], 7, true);
    train.animations.add('jump_left',[6],10,true);
    train.animations.add('jump_right',[7],10,true);
    train.animations.add('collision',[8],10,true);
    
    train.animations.play('mitte');

    //train is in middle rail
    train.rail = 1;

    //schulzzug
    //
    //
    //add test object
    //
    /*
    object = game.add.sprite(0,0,'dummy');
    object.anchor.setTo(0.5,0.5);

    //set start x-value
    object.x = x_s;
    //flip_z is necessary due to different orientation of screen coordinates
    object.y = flip_z(horizon + h_object/2);

    //get the original height of the object to scale it to the wanted heifht
    original_object_height = object.height;

    //get and set new scale
    let new_scale = h_object / original_object_height;
    object.scale.setTo(new_scale,new_scale);
    w_object = object.width;
    

    //set object start time to now
    t0 = game.time.now;
    */
    //railObjects.push( getRailObject("dummy"));
    //console.log(railObjects);
    draw_rails(); 
    
    let style = "align:center;font-family:'SilkScreen',monospace";
    panel = game.add.sprite(0, height - 72, 'panel');
    text_score = game.add.text(0, height - 72, "0", style);
    text_distance = game.add.text(0, height - 72, "0m", style);
    text_score.anchor.set(0.5);
    text_distance.anchor.set(0.5);
}

function draw_rails() {

    //let t0;

    let x_start = width / 2 - 1.5 * raildistance_inner - raildistance_outer;
    //vr linedd.graphics(x, y);1 = Phaser.Line(this_x_start,horizon,x_L,h);
    let y_g = height / 2 * L / (h_camera+height / 2);
    
    for(let rail = 0; rail < 3; rail++)
    {
        let this_x_start = x_start + rail * (raildistance_inner + raildistance_outer);
        let x_L = x_camera - L * (x_camera - this_x_start) / (h_camera - (L - y_g));
        let x_R = x_camera - L * (x_camera - (this_x_start + raildistance_inner)) / (h_camera - (L - y_g));
        let h = h_camera - L / (L - y_g) * h_camera + horizon;
        
        /*
        console.log("h =", h);
        console.log("y_g=",y_g);

        console.log(this_x_start,horizon,x_L,h);
        console.log(this_x_start,x_L,horizon);
        console.log(horizon);
        console.log(x_L);
        console.log(x_L);
        console.log(x_R);
        */
        
        gfx.moveTo(this_x_start, flip_z(horizon));
        gfx.lineTo(flip_x(x_L), flip_z(h));
        gfx.moveTo(this_x_start + raildistance_inner, flip_z(horizon));
        gfx.lineTo(flip_x(x_R), flip_z(h));
        
        //let line1 = Phaser.Line(this_x_start,horizon,x_L,h);
        //gleis_lines.push(new Phaser.Line(this_x_start,horizon,x_L,h));
        //gleis_lines.push(new Phaser.Line(this_x_start+raildistance_inner,flip_z(horizon),x_R,flip_z(h)));
        
    }
}

function update() {
    let t = game.time.now;

    let remove_indices = Array();
    let remove_bahndamm_indices = Array();

    if (can_change_rail && 
        key_left.isDown && 
        t-last_key_change_time>key_change_rate &&
        train.rail > 0
       ) {
        last_jump_start = t;
        last_key_change_time = t;
        can_change_rail = false;
                jump.play();
        train.animations.play("jump_left");
        train.last_x = train.x;
        train.last_y = train.y;
        train.geschw_x = -1/jump_duration;
        new_train_rail = train.rail -1;
        train.rail = -1;
    } else if (can_change_rail &&
               key_right.isDown && 
               t-last_key_change_time>key_change_rate &&
               train.rail < 2    
              ) {
        last_jump_start = t;
        last_key_change_time = t;
        can_change_rail = false;
                jump.play();
        train.animations.play("jump_right");
        train.last_x = train.x;
        train.last_y = train.y;
        train.geschw_x = 1.0/jump_duration;
        new_train_rail = train.rail + 1;
        train.rail = -1;
    }

    if (!can_change_rail) {
        let dt = (t-last_jump_start);
        if (dt < jump_duration) {
            train.x = train.last_x + 130*train.geschw_x * dt;
            let a = 1/1000.;
            train.y = train_std_y - dt*jump_duration*a + Math.pow(dt,2)*a;
        } else {
            train.x = train_position[new_train_rail];
            train.y = train_std_y;
            train.rail = new_train_rail;
            can_change_rail = true;
            if (train.rail === 0.0) {
                // jump.play();
                train.animations.play("links");
            } else if (train.rail === 1) {
                // jump.play();
                train.animations.play("mitte");
            } else if (train.rail === 2) {
                // jump.play();
                train.animations.play("rechts");
            }
        }
    }

    for (let i = 0; i < railObjects.length; i++)
    {
        updateRailObject(railObjects[i],train);
        if (!railObjects[i].active) {
            remove_indices.push(i);
        }
        
        if (railObjects[i].collision) {
            railObjects[i].t0 = t;
            collisionObjects.push(railObjects[i]);
        }
    }

    for (let i = 0; i < bahndammObjects.length; i++)
    {
        updateRailObject(bahndammObjects[i],train);
        if (!bahndammObjects[i].active) {
            remove_bahndamm_indices.push(i);
        }
    }
    let collision_indices = Array();
    for (let i=0; i<collisionObjects.length; i++) {
        collisionUpdate(collisionObjects[i]);
        if (!collisionObjects[i].collision) {
            collision_indices.push(i);
        }
    }

    delete_indices_from_array(remove_indices,railObjects);
    delete_indices_from_array(collision_indices,collisionObjects);
    delete_indices_from_array(remove_bahndamm_indices,bahndammObjects);

    // spawn new rail object
    if (t - last_rail_object_time > new_rail_object_rate) {
        
        let kind = 'coin';
        let seed = Math.random();
        //if (seed < 0.125) {
        //    kind = 'bush';
        //} else if (seed < 0.200) {
        //    kind = 'sign';
        //} else {
        //    kind = 'coin';
        //}
        
        railObjects.push(getRailObject(kind));
        for (var i = railObjects.length; i--; ) {
            railObjects[i].sprite.bringToTop();
        }
        last_rail_object_time = t;
    }

    //spawn new bahndamm objects

    for (var kind in bahndamm_probabilities) {
        // skip loop if the property is from prototype
        if (!bahndamm_probabilities.hasOwnProperty(kind)) continue;
        var prob = bahndamm_probabilities[kind];
        if (Math.random() < prob) {
            bahndammObjects.push(getBahndammObject(kind));
            
            for (var i = bahndammObjects.length; i--; ) {
                bahndammObjects[i].sprite.bringToTop();
            }
        }
    }
    
    if (Math.random() < 0.01)
        generateCloud();
    
    meter_counter++;
    
    text_score.x = Math.floor(panel.x + panel.width / 4 + 16);
    text_score.y = Math.floor(panel.y + panel.height / 2 + 4);
    text_score.setText(nFormatter(coin_counter, 2));
    text_score.font = 'SilkScreen';
    
    text_distance.x = Math.floor(panel.x + panel.width / 4 * 3 + 1);
    text_distance.y = Math.floor(panel.y + panel.height / 2 + 4);
    text_distance.setText(nFormatter(meter_counter, 2) + "m");
    text_distance.font = 'SilkScreen';
}

function nFormatter(num, digits) {
  let si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "k" }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1")
        + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, "$1");
}


function generateCloud() {
    let seed = Math.random();
    let cloud_height = seed * 176;
    let cloud_type = 'cloud0';
    if (seed < 0.667) {
        cloud_type = 'cloud1';
    } else if (seed < 0.333) {
        cloud_type = 'cloud2';
    } else {
        cloud_type = 'cloud0';
    }
    let cloud = cloudObjectGroup.create(-60, cloud_height, cloud_type);
    game.physics.arcade.enable(cloud);
    cloud.body.gravity.x = 4;
}

function delete_indices_from_array(indices,array){
    // delete object from railObjects updated
    for (let i = indices.length - 1; i >= 0; i--)
        array.splice(indices[i], 1);
}

function collisionUpdate(object) {
    if (object.kind == "coin") {
        bling.play();
        object.sprite.destroy();
        coin_counter += 1;
        object.collision = false;
    }

    if (object.kind == "mauer") {
        smash.play();
        let dt = game.time.now - object.t0;
        if (dt>mauer_animation_length) {
            object.sprite.destroy();
            object.collision = false;
        }
    }
}


function flip_z(z) {
    return height - z;
}

function flip_x(x) {
    return width - x;
}

function getBahndammObject(kind)
{
    //get spawn rail
    let seite = Math.floor(Math.random() * 2);
    //get corresponding starting position
    let damm_width = width / 2 - 1.5*raildistance_outer - raildistance_inner-20;
    let damm_offset = seite * (width / 2 + 1.5*raildistance_outer + raildistance_inner + 20);
    let x_s = damm_width * Math.random() + damm_offset;
    let h_object;
    let w_object;
    let original_object_height;

    let sprite = railObjectGroup.create(0, 0, kind);
    
    if (kind == "tree0") {
        h_object = 40;
    }
    if (kind == "tree1") {
        h_object = 35;
    }
    if (kind == "tree2") {
        h_object = 35;
    }
    if (kind == "bush") {
        h_object = 10;
    }
    if (kind == "sign") {
        h_object = 20;
    }

    
    sprite.anchor.setTo(0.5, 0.5);

    //set start x-value
    sprite.x = x_s;
    //flip_z is necessary due to different orientation of screen coordinates
    sprite.y = flip_z(horizon + h_object / 2);

    //get the original height of the object to scale it to the wanted heifht
    original_object_height = sprite.height;
    original_object_width = sprite.width;

    //get and set new scale
    let new_scale = h_object / original_object_height;
    sprite.scale.setTo(new_scale, new_scale);
    w_object = sprite.width;

    let railObject = {
        "kind": kind,
        "rail": -1,
        "sprite": sprite,
        "original_object_height": original_object_height,
        "original_object_width": original_object_width,
        "t0": game.time.now,
        "active": true,
        "w_object": w_object,
        "h_object": h_object,
        "x_s": x_s,
        "collision": false
    };

    return railObject;
}

function getRailObject(kind)
{
    //get spawn rail
    let rail = Math.floor(Math.random() * 3);
    //get corresponding starting position
    let x_s = width / 2 - raildistance_outer - raildistance_inner + rail * (raildistance_outer + raildistance_inner);
    let h_object;
    let w_object;
    let original_object_height;
    let original_object_width;

    let sprite = railObjectGroup.create(0, 0, kind);
    
    if (kind == 'dummy') {
        h_object = raildistance_inner;
    }
    
    if (kind == 'bush') {
        h_object = raildistance_inner * 0.8;
    }
    
    if (kind == 'sign') {
        h_object = raildistance_inner * 1.6;
    }
    
    if (kind == 'coin') {
        h_object = raildistance_outer;
        
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

    //set start x-value
    sprite.x = x_s;
    //flip_z is necessary due to different orientation of screen coordinates
    sprite.y = flip_z(horizon + h_object / 2);

    //get the original height of the object to scale it to the wanted heifht
    original_object_height = sprite.height;
    original_object_width = sprite.width;

    //get and set new scale
    let new_scale = h_object / original_object_height;
    sprite.scale.setTo(new_scale, new_scale);
    w_object = sprite.width;

    let railObject = {
        "kind": kind,
        "rail": rail,
        "sprite": sprite,
        "original_object_height": original_object_height,
        "original_object_width": original_object_width,
        "t0": game.time.now,
        "active": true,
        "w_object": w_object,
        "h_object": h_object,
        "x_s": x_s,
        "collision": false
    };

    return railObject;
}

function updateRailObject(object,schulzzug) {

    //get current time
    let t = game.time.now;
    //object.sprite.anchor.setTo(0.5,0.5);

    //get position between horizon and camera
    let y = v * (t - object.t0);

    //get center position of test object
    let x_o = x_camera - L / (L - y) * (x_camera - object.x_s);

    //set center position of object
    object.sprite.x = x_o;

    //get new width
    let w = -L * ((x_camera - (object.x_s + object.w_object / 2)) / (L - y) - (x_camera - (object.x_s - object.w_object / 2)) / (L - y));

    //get and set new scale of object
    let wScale = w / object.original_object_width;
    object.sprite.scale.setTo(wScale);

    //get vertical coordinate
    let h = h_camera - L / (L - y) * (h_camera - object.h_object / 2) + horizon;
    object.sprite.y = flip_z(h);
    
    //get collision range
    //destroy if out of scope
    if (y > L) 
    {
        object.sprite.destroy();
        object.active = false;
    }

    if (y>y_collision_begin_range && y<y_collision_end_range) {
        if (object.rail == schulzzug.rail) {
            object.collision = true;
            object.active = false;
        }
    }
}
