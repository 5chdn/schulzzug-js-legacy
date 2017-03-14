let ende_state = {

    preload: function () {
        if (is_retina())
            game.load.image("byebye","assets/Twitter.png");
        else
            game.load.image("byebye","assets/Twitter.50.png");
    },

    create: function () {
        let style = {
            align:"center",
            font:'30px SilkScreen monospace',
            fill: 'white'
        }
        let byebye = game.add.sprite(0,0,"byebye");
        let byebye_scale = canvas_width / byebye.width;
        byebye.scale.setTo(byebye_scale,byebye_scale);
        let remaining_space = canvas_height - byebye.height;
        let ende_label = game.add.text(canvas_width/2, 
                                       canvas_height - 0.5*remaining_space,
                                       'Danke fuer deine \n Hilfe, Genosse!\n Von hier ueber-\nnehme ich wieder.\nGlueck auf!',
                                       style) ;
        ende_label.font = 'SilkScreen';
        ende_label.anchor.setTo(0.5,0.5);

        function go_back() {
            game.state.start("germany");
        }
        game.input.onDown.add( go_back() );
        game.input.keyboard.onDownCallback = go_back;

    }
}


