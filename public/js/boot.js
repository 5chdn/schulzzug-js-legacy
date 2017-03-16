"use strict";
// first state to be called
let boot_state = {

    preload: function () {
        if (is_android) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.stage.backgroundColor = '#000';
        }

        if (is_retina()) 
            game.load.image("logo","assets/schulzzug_logo.png");
        else
            game.load.image("logo","assets/schulzzug_logo.50.png");
    },

    create: function () {

        // start physics enginge and continue loading all assets
        // game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    }
}
