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
const camera_height = 50;

// x position of camera
const camera_x = canvas_width / 2;

// distances of rails at horizon
const rail_distance_inner = 10;
const rail_distance_outer = 6;

// schulzzug velocity
var v_initial = 10          // default velocity for the whole game
var v_default = v_initial;  // default velocity for the current level
var v = v_default;   // current velocity

//collision ranges
const y_collision_range_start
= canvas_height / 2 * horizon_distance
/ (camera_height + canvas_height / 2);
const y_collision_range_end = y_collision_range_start + 2000;

// ====================== EU STAR STUFF ========================================
const eu_radius = horizon_height / 4;
const eu_position = {
    'x': canvas_width / 2,
    'y': horizon_height / 2
};
const eu_stars_count = 3;
const delta_phi = 360 / eu_stars_count;
var eu_stars_indices = Array();
for (var i = 0; i < eu_stars_count; i++) {
    eu_stars_indices.push(i);
}
var eu_star_objects = Array();
const eu_star_travel_time = 1000;
var eu_star_can_spawn = true;
const eu_event_delta_v = 10;

// each time it's possible, a star will appear
const eu_star_appearance_probability = .1; // std: 0.1, debug: 1.0

// ===================== STERNPHASE DEFINTIIONS ================================
const eu_star_phase_duration = 8000; // std: 8000, debug: 4000
const eu_star_phase_factor = 2;

// ===================== DEFINE CONTROL VARIABLES ==============================
// swipe handling
var IOS_MODE;
var swipe_direction;
var swipe_gesture_recognizer;

// input keys
var key_left;
var key_right;
var key_up;
var key_space;
var key_mute;

// time after which a new control command can be given (ms)
const key_change_time_block = 200;
var key_mute_block = key_change_time_block;

// last time a control command was given
var key_change_time;

// ====================== RAIL AND DAM OBJECT PROPERTIES =======================

// rate of rail object appearance
var rail_object_rate_default = 500;

// this is needed for changes in velocity
var rail_object_rate = rail_object_rate_default;

//time of last appearance
var rail_object_time;

var dam_object_rate_default = 150;

// the current rate (changes when there's changes in velocity)
var dam_object_rate = dam_object_rate_default;

// time of last dam object appearance
var dam_object_time;
var dam_probabilities;

//var rail_standard_object_probabilities;
//var rail_sternphase_object_probabilities;


// objects for storing arrays and sprite groups:
// - for creating an object sprite in the right rail group
var rail_object_group;
// - storing the rail objects,
//   s.t. they can be updated while approaching the train
var rail_objects = Array();
// - storing the collision objects,
//   s.t. they can be updated when a collision took place
var collision_objects = Array();
// - same for dam objects
var dam_objects = Array();
// - same for cloud objects
var cloud_object_group;


// ====================== STATS COUNTERS =======================================
var coin_counter = 0;
var meter_counter = 0;
var panel;          // sprite
var text_score;     // label
var text_distance;  // label


// ==================== SCHULZZUG DEFINITIONS ==================================
var train;          // sprite

// positions of sprite for the three rails
var train_position = [ -10, (canvas_width - 120) / 2, canvas_width - 120 + 10 ];
const train_position_distance = 130;

// names of the animation for each rail
var train_animations  = ["train_left", "train_center", "train_right"];

var train_star_animations = ["star_left", "star_center", "star_right"];

var train_collision_animations = ["collision_left", "collision_center", "collision_right"];

// this is false if the train jumps
var rail_can_change = true;

// this is only true if the train is currently changing its rail
var rail_is_changing = !rail_can_change;

// time the train needs to jump
var rail_jump_duration = key_change_time_block;

// when the last jump started
var rail_jump_start;

// the next train rail after finishing the rail jump (0, 1 or 2)
var train_rail_next;

var train_can_jump_up = true;
var train_is_jumping_up = !train_can_jump_up;
const train_up_jump_duration = 400;
var train_up_jump_start;

// the usual distance to the top of the screen.
const train_spacing_y = 360;

// ================= SOUNDS ====================================================
var sound_bling;
var sound_smash;
var sound_jump;
// var sound_win;                                                               // never used @TODO #36
var sound_whistle;
var sound_background;
var sound_eu_star;
var sound_bg_music;
var bg_music_bpm = 120; //the bg_music has 120 BPM (beats per minute)

// ============================ COLLISIONS =====================================
const wall_coin_penalty = -100;
const wall_animation_length = 2000;
const time_until_full_velocity = 8000;
var last_velocity_scale_time;
var last_velocity_scale = 1;
var last_scale_event = "default";
const collision_velocity_drop_ratio = 0.3;

// ===================== SAVING CURRENT TIME FOR ANIMATIONS ====================
var time_now;
var time_last;


// state transitions 

var state_transition_duration = 1000;
