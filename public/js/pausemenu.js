let pause_bg_alpha = 0.5;
let pause_pause_button_alpha = 0.5;
let pause_button_alpha = 1;

let pause_menu = {};

let pause_buttons = [

    { 
        label: "Lass Martin Fahren",
        layer: 0,
        on_click: function () {
            pause_menu_goto_layer(2);
        }
    },
    
    { 
        label: "Spende Schulzcoins",
        layer: 0,
        on_click: function () {
            pause_menu_goto_layer(1);
        }
    },

    { 
        label: "Weiterfahren",
        layer: 0,
        on_click: hide_pause_menu
    },

    { 
        label: "Ja",
        layer: 2,
        on_click: function () {
            hide_pause_menu();
            next_level("end");
        }
    },

    { 
        label: "Zurueck",
        layer: 2,
        on_click: function () {
            pause_menu_goto_layer(0);
        }
    },
    { 
        label: "Zurueck",
        layer: 1,
        on_click: function () {
            pause_menu_goto_layer(0);
        }
    }
];


let pause_layers = [
    {
        layer_position: 0,
        title: "Pause"
    },
    {
        layer_position: 1,
        title: "Wofuer willst du\ndie Schulzcoins spenden?"
    },
    {
        layer_position: -1,
        title: "Sicher?"
    }
];

pause_menu.button_layer_count = pause_layers.length;

let pause_style = {
            align:"center",
            font:'20px SilkScreen monospace',
            fill: 'white'
        }

function create_pause_menu () {

    pause_menu.pause_button = game.add.button(20,20,"pause_button",
                                 function() {
                                     show_pause_menu();
                                 },
                                 this);
    let p_button_scale = 48/ pause_menu.pause_button.width;
    pause_menu.pause_button.scale.setTo(p_button_scale);
    pause_menu.pause_button.alpha = 0;
    pause_menu.pause_button.inputEnabled = false;

    pause_menu.is_active = false;

    pause_menu.rect = game.add.sprite(0,0,"black");
    pause_menu.rect.width = canvas_width;
    pause_menu.rect.height = canvas_height-panel.height;
    pause_menu.rect.alpha = 0;

    pause_menu.layer_titles = Array();
    pause_menu.buttons = Array();
    pause_menu.button_labels = Array();

    pause_menu.current_layer = 0;

    for(let layer=0; layer<pause_menu.button_layer_count; layer++){
        let pos = pause_layers[layer].layer_position;
        let x = canvas_width*(pos+1/2);
        let y = canvas_height/6;
        let layer_label = game.add.text(x,y,pause_layers[layer].title,pause_style);
        layer_label.anchor.setTo(0.5,0.5);
        layer_label.font = 'SilkScreen';
        layer_label.alpha = 0;

        pause_menu.layer_titles.push(layer_label);
        y += canvas_height/6;
        let dy = canvas_height/10;
        let button_count = 0;
        for(let iButton=0; iButton<pause_buttons.length; iButton++) {
            if (pause_buttons[iButton].layer == layer)
            {
                let by = y + dy* button_count;
                let button = game.add.button(x,by,"button",
                                             pause_buttons[iButton].on_click,
                                             this,1,1,0,1);
                let button_scale = canvas_width*0.8/ button.width;
                let button_label = game.add.text(x,by,pause_buttons[iButton].label,pause_style);
                button_label.font = 'SilkScreen';
                button_label.anchor.setTo(0.5,0.5);
                button_label.alpha = 0;
                button.alpha = 0;
                button.anchor.setTo(0.5,0.5);
                //button.width *= button_scale;
                //button.height = dy;
                button.scale.setTo(button_scale,button_scale);
                button.inputEnabled = false;
                pause_menu.buttons.push(button);
                pause_menu.button_labels.push(button_label);
                button_count++;
            }
        }
    }
}

function destroy_pause_menu () {
    if (pause_menu.hasOwnProperty("rect")) {
        pause_menu.rect.destroy();
        pause_menu.layer_titles.forEach(function(d) { d.destroy(); });
        pause_menu.button_labels.forEach(function(d) { d.destroy(); });
        pause_menu.buttons.forEach(function(d) { d.destroy() });
        pause_menu.is_active = false;
        pause_menu.pause_button.destroy();
    }
}

function pause_menu_goto_layer(layer) {

    let dlayer =   pause_layers[pause_menu.current_layer].layer_position
                 - pause_layers[layer].layer_position;

    let arrs = [ 
                pause_menu.layer_titles,
                pause_menu.button_labels,
                pause_menu.buttons
              ];

     arrs.forEach( function (arr) {
         arr.forEach( function (obj) {
             let tween = game.add.tween(obj).to({ x: obj.x + dlayer * canvas_width},
                                                1000,
                                                Phaser.Easing.Cubic.InOut
                                               );
             tween.start();
         });
     });

     pause_menu.current_layer = layer;

}

function show_pause_menu() {
    pause_menu.rect.alpha = pause_bg_alpha;
    pause_menu.layer_titles.forEach(function(d) { d.alpha = 1; });
    pause_menu.button_labels.forEach(function(d) { d.alpha = 1; });
    pause_menu.buttons.forEach(function(d) { d.alpha = 1; d.inputEnabled = true; });
    pause_menu.is_active = true;
    game.tweens.pauseAll();
    pause_menu.pause_button.alpha = 0;
    pause_menu.pause_button.inputEnabled = false;
}

function hide_pause_menu() {
    pause_menu.rect.alpha = 0;
    pause_menu.layer_titles.forEach(function(d) { d.alpha = 0; });
    pause_menu.button_labels.forEach(function(d) { d.alpha = 0; });
    pause_menu.buttons.forEach(function(d) { d.alpha = 0; d.inputEnabled = false; });
    pause_menu.is_active = false;
    game.tweens.resumeAll();
    pause_menu.pause_button.alpha = pause_pause_button_alpha;
    pause_menu.pause_button.inputEnabled = true;
}

function activate_pause_button() {
    pause_menu.pause_button.alpha = pause_pause_button_alpha;
    pause_menu.pause_button.inputEnabled = true;
}

function create_spend_buttons () {

    let options = [ 
        { 
            name: "Bildung",
            key: "34sve5ubd6"
        }, 
        { 
            name: "EU",
            key: "sb4795n"
        } 
    ];

    for(let i=0; i<options.length; i++) {
        pause_buttons.push({
            label: options[i].name,
            layer: 1,
            on_click: function() {
                update_coin_counter(-coin_counter);
            }
        });
    }
}
