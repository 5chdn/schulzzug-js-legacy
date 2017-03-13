

var boot_state = {

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    }
}
