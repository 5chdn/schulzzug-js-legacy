let menu_state = {

    create: function () {

        let menubg = game.add.sprite(0,0,"menubg");
        menubg.width = canvas_width;
        menubg.height = canvas_height;

        let logo = game.add.sprite(canvas_width/2, canvas_height/3,"logo");
        let logo_scale =  canvas_width*0.8 / logo.width;
        logo.anchor.setTo(0.5,0.5);
        logo.scale.setTo(logo_scale,logo_scale);
        logo.angle = 30;

        let menu_start_button = game.add.button(canvas_width/2, 
                                            canvas_height*(1-1/4),
                                            "button",
                                            start_core_game,
                                            this, //callbackContext
                                            1, //overFrame
                                            1, //outFrame
                                            0, //downFrame
                                            1  //upFrame
                                           );

        menu_start_button.anchor.setTo(0.5,0.5);
        let menu_button_scale = canvas_width*0.6 / menu_start_button.width;
        menu_start_button.scale.setTo(menu_button_scale,menu_button_scale);

        
        let style = {
            align:"center",
            font:"30px SilkScreen monospace",
            fill: 'white'
        }
        let loading_label = game.add.text(canvas_width/2, canvas_height*(1-1/4),'start',style) ;
        loading_label.font = 'SilkScreen';
        loading_label.anchor.setTo(0.5,0.5);
    }
}

function start_core_game () {
    // sounds
    sound_bling = game.add.audio('bling');
    sound_bling.volume = 0.2;
    sound_smash = game.add.audio('smash');
    sound_smash.volume = 0.15;
    sound_jump = game.add.audio('jump');
    sound_jump.volume = 0.25;
    sound_eu_star = game.add.audio('star');
    sound_eu_star.volume = 0.5;
    sound_eu_star.onStop.add( function () {
        switch_bg_music();
    });
    sound_eu_star.onPlay.add( function () {
        switch_bg_music();
    });
    // sound_win = game.add.audio('tada');                                      // never used @TODO #36
    sound_whistle = game.add.audio('whistle');
    sound_whistle.volume = 1;
    sound_background = game.add.audio('ratter');
    sound_background.volume = 0.21;

    sound_bg_music = game.add.audio('bg_music');
    sound_bg_music.volume = 0.5;
    sound_bg_music.loop = true;
    sound_bg_music.play();

    // start background train sound as loop
    game.sound.mute = false;
    sound_background.loop = true;
    sound_background.play();

    game.state.start(level_names[default_start_level]);
}
