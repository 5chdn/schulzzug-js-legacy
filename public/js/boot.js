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

        //check for localStorage
        if (is_mobile()){
            used_coin_menu_already = (localStorage.getItem('used_coin_menu_already') == 'true');
            game.sound.mute = (localStorage.getItem('mute') == 'true');
        }
    },

    create: function () {

        // start physics enginge and continue loading all assets
        // game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start("load");
    }
}
