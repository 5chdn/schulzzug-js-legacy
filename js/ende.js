var ende_state = {

    create: function () {
        let style = {
            align:"center",
            font:'30px SilkScreen monospace',
            fill: 'white'
        }
        let loading_label = game.add.text(canvas_width/2, canvas_height/2,'Ende.',style) ;
        loading_label.anchor.setTo(0.5,0.5);
    }

}
