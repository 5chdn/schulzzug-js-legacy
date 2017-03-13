
// first state to be called
let boot_state = {


    create: function () {

        // start physics enginge and continue loading all assets
        // game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    }
}
