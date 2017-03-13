// ======================================= CREATE GAME ENGINE ==================
let game = new Phaser.Game(
                           canvas_width,
                           canvas_height,
                           Phaser.AUTO,
                           'schulzzug'
                          );

game.state.add("boot",boot_state);
game.state.add("load",load_state);

for(let i=0; i<level_names.length-1; i++)
{
    console.log(level_names[i],level_states[i]);
    game.state.add(level_names[i],level_states[i]);
}

game.state.add("ende",ende_state);
    

game.state.start("boot");
