
// canvas size
var width = 375;
var height = 667;

// object to be displayed (coin and such)
var object;

// position of horizon on y-axis
var horizont = height-210;

// Schulzzuggeschwindigkeit
var v = 10;

// distance to horizon
var L = 40000;

// height of camera
var h_camera = 50;

// x position of camera
var x_camera = width/2;

// distances of rails
var gleisabstand_innen = 10;
var gleisabstand_aussen = 6;

// height/width of test object
var h_object = gleisabstand_innen;
var w_object;

//start coordinate of test object
var x_s = width/2 - gleisabstand_aussen-gleisabstand_innen;

// graphics object for lines
var gfx;

// game engine
var game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

// after that time, movement will start
var t0;

var new_rail_object_rate = 500;
var last_rail_object_time;

function preload() {
    game.load.image('dummy','assets/1pixel.png');
}

var original_object_height;
var railObjectGroup;
var railObjects = Array();
// create scenery
//
function create() {

    //add for gleise
    gfx = game.add.graphics(0, 0); 
    gfx.lineStyle(1, 0xff0000, 1);

    railObjectGroup = game.add.group();


    game.physics.startSystem(Phaser.Physics.ARCADE);
    last_rail_object_time = game.time.now;
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
    object.y = flip_z(horizont + h_object/2);

    //get the original height of the object to scale it to the wanted heifht
    original_object_height = object.height;

    //get and set new scale
    var new_scale = h_object / original_object_height;
    object.scale.setTo(new_scale,new_scale);
    w_object = object.width;
    

    //set object start time to now
    t0 = game.time.now;
    */
    //railObjects.push( getRailObject("dummy"));
    //console.log(railObjects);
    draw_gleis(); 

}

function draw_gleis() {

    var t0;

    var x_start = width/2 - 1.5*gleisabstand_innen - gleisabstand_aussen;
    //vr linedd.graphics(x, y);1 = Phaser.Line(this_x_start,horizont,x_L,h);
    var y_g = height/2*L/(h_camera+height/2);
    
    for( var gleis = 0; gleis < 3; gleis++)
    {
        var this_x_start = x_start + gleis*(gleisabstand_innen + gleisabstand_aussen);
        var x_L = x_camera - L * (x_camera - this_x_start) / (h_camera - (L-y_g));
        var x_R = x_camera - L * (x_camera - (this_x_start+gleisabstand_innen)) / (h_camera - (L-(y_g)));
        var h = h_camera - L/(L-y_g) * (h_camera) + horizont
        /*
        console.log("h =", h);
        console.log("y_g=",y_g);

        console.log(this_x_start,horizont,x_L,h);
        console.log(this_x_start,x_L,horizont);
        console.log(horizont);
        console.log(x_L);
        console.log(x_L);
        console.log(x_R);
        */
        gfx.moveTo(this_x_start,flip_z(horizont));
        gfx.lineTo(flip_x(x_L),flip_z(h));
        gfx.moveTo(this_x_start+gleisabstand_innen,flip_z(horizont));
        gfx.lineTo(flip_x(x_R),flip_z(h));
        //var line1 = Phaser.Line(this_x_start,horizont,x_L,h);
        //gleis_lines.push(new Phaser.Line(this_x_start,horizont,x_L,h));
        //gleis_lines.push(new Phaser.Line(this_x_start+gleisabstand_innen,flip_z(horizont),x_R,flip_z(h)));
        
    }
}

function update() {
    t = game.time.now;

    var remove_indices = Array();

    for (var i=0; i<railObjects.length; i++)
    {
        updateRailObject(railObjects[i]);
        if (!railObjects[i].active)
            remove_indices.push(i);
    }

    for (var i = remove_indices.length-1; i>=0; i--)
        railObjects.splice(remove_indices[i],1);


    if (t-last_rail_object_time>new_rail_object_rate) {
        railObjects.push(getRailObject("dummy"));
        last_rail_object_time = t;
    }
    
}

function flip_z(z) {

    return height - z;
}

function flip_x(x) {
    return width - x;
}

function getRailObject(kind)
{
    //get spawn rail
    var rail = Math.floor(Math.random()*3);
    //get corresponding starting position
    var x_s = width/2 - gleisabstand_aussen-gleisabstand_innen + rail * (gleisabstand_aussen+gleisabstand_innen);
    var h_object;
    var w_object;
    var original_object_height;

    if (kind=="dummy") {
        h_object = gleisabstand_innen;
    }

    var sprite = railObjectGroup.create(0,0,'dummy');
    sprite.anchor.setTo(0.5,0.5);

    //set start x-value
    sprite.x = x_s;
    //flip_z is necessary due to different orientation of screen coordinates
    sprite.y = flip_z(horizont + h_object/2);

    //get the original height of the object to scale it to the wanted heifht
    original_object_height = sprite.height;
    original_object_width = sprite.width;

    //get and set new scale
    var new_scale = h_object / original_object_height;
    sprite.scale.setTo(new_scale,new_scale);
    w_object = sprite.width;


    var railObject = {
        "rail": rail,
        "sprite": sprite,
        "original_object_height": original_object_height,
        "original_object_width": original_object_width,
        "t0": game.time.now,
        "active": true,
        "w_object": w_object,
        "h_object": h_object,
        "x_s": x_s
    };

    return railObject;
}

function updateRailObject(object) {

    //get current time
    t = game.time.now;
    //object.sprite.anchor.setTo(0.5,0.5);

    //get position between horizon and camera
    var y = v*(t-object.t0);

    //get center position of test object
    var x_o = x_camera - L/(L-y) * (x_camera - object.x_s);

    //set center position of object
    object.sprite.x = x_o;

    //get new width
    var w = -L*( (x_camera-(object.x_s+object.w_object/2))/(L-y) - (x_camera - (object.x_s-object.w_object/2))/(L-y) );

    //get and set new scale of object
    var wScale = w/object.original_object_width;
    object.sprite.scale.setTo(wScale);

    //get vertical coordinate
    var h = h_camera - L/(L-y) * (h_camera - object.h_object / 2.) + horizont;
    object.sprite.y = flip_z(h);
    
    //destroy if out of scope
    if (y>L) 
    {
        object.sprite.destroy()
        object.active = false;
    }
}
