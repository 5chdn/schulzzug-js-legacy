
// first state to be called
let boot_state = {


    create: function () {

        // start physics enginge and continue loading all assets
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    }
}
