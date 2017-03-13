// ======================================= CREATE GAME ENGINE ==================
var game = new Phaser.Game(
                           canvas_width,
                           canvas_height,
                           Phaser.AUTO,
                           'schulzzug'
                          );

// add boot and load states                           
game.state.add("boot",boot_state); // starting physics engine and game
game.state.add("load",load_state); // loading all assets

// for all levels in level_names, push the state given in levels.js
for(var i=0; i<level_names.length-1; i++)
    game.state.add(level_names[i],level_states[i]);

// this is the final state
game.state.add("ende",ende_state);

// starting the game
game.state.start("boot");
