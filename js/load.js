// the load state
var load_state = {

    // add loading label to the black screen
    preload: function () {
        var style = {
            align:"center",
            font:"30px SilkScreen monospace",
            fill: 'white'
        }
        var loading_label = game.add.text(canvas_width/2, canvas_height/2,'lading...',style) ;
        loading_label.font = 'SilkScreen';
        loading_label.anchor.setTo(0.5,0.5);

        // load all assets
        preload_all_assets();

    },

    // when loading is done, start with the first level
    create: function () {
        game.state.start(level_names[current_level]);
    }

}



function preload_all_assets() {
    
    
    game.load.image("black", "assets/black.png");
    
    if(is_retina()) {
        game.load.image('grass_de',      'assets/green.png');
        game.load.image('dirt_de',       'assets/dirt.png');
        game.load.image('sky_de',        'assets/sky.png');

        game.load.image('grass_us',      'assets/usa_assets/green_USA.png');
        game.load.image('dirt_us',       'assets/usa_assets/dirt_USA.png');
        game.load.image('sky_us',        'assets/usa_assets/sky_USA.png');

        game.load.image('grass_tr',      'assets/tuerkei_assets/green_TUR.png');
        game.load.image('dirt_tr',       'assets/tuerkei_assets/dirt_TUR.png');
        game.load.image('sky_tr',        'assets/tuerkei_assets/sky_TUR.png');

        game.load.image('panel',      'assets/Panel.png');

        game.load.image('cloud0',     'assets/cloud01.png');
        game.load.image('cloud1',     'assets/cloud02.png');
        game.load.image('cloud2',     'assets/cloud03.png');

        game.load.image('wall_frauke','assets/afd-wall.png');
        game.load.image('wall_donald','assets/Trump-Wall.png');
        game.load.image('frauke',     'assets/Petry.png');
        game.load.image('donald',     'assets/Trump.png');
        game.load.image('wall',       'assets/wall.png');
        game.load.image('erdogan',    'assets/tuerkei_assets/Erdogan.png');
        
        game.load.image('tree0',      'assets/Tree01.png');
        game.load.image('tree1',      'assets/Tree02.png');
        game.load.image('tree2',      'assets/specialtree.png');
        game.load.image('office',     'assets/Kanzleramt.png');
        game.load.image('bush',       'assets/Bush01.png');
        game.load.image('sign',       'assets/Sign01.png');
        game.load.image('tumbleweed', 'assets/usa_assets/Tumbleweed.png');
        game.load.image('cactus0',    'assets/usa_assets/cactus01.png');
        game.load.image('cactus1',    'assets/usa_assets/cactus02.png');
        game.load.image('olivetree',  'assets/tuerkei_assets/Olive.png');
        game.load.image('goat',       'assets/tuerkei_assets/Goat.png');
        
        game.load.spritesheet(
                              'rails',
                              'assets/rails_animation.png',
                              750, 919
                              );
        game.load.spritesheet(
                              'eurostar',
                              'assets/star_animation.png',
                              60,64
                              );

        game.load.spritesheet('train', 'assets/Trains_animation.png', 240, 464);
        game.load.spritesheet('coin', 'assets/Coin.png', 64, 64);

    } else {
        game.load.image('grass',      'assets/green.50.png');
        game.load.image('dirt',       'assets/dirt.50.png');
        game.load.image('sky',        'assets/sky.50.png');

        game.load.image('grass_us',   'assets/usa_assets/green_USA.50.png');
        game.load.image('dirt_us',    'assets/usa_assets/dirt_USA.50.png');
        game.load.image('sky_us',     'assets/usa_assets/sky_USA.50.png');

        game.load.image('grass_tr',      'assets/tuerkei_assets/green_TUR.50.png');
        game.load.image('dirt_tr',       'assets/tuerkei_assets/dirt_TUR.50.png');
        game.load.image('sky_tr',        'assets/tuerkei_assets/sky_TUR.50.png');

        game.load.image('panel',      'assets/Panel.50.png');

        game.load.image('cloud0',     'assets/cloud01.50.png');
        game.load.image('cloud1',     'assets/cloud02.50.png');
        game.load.image('cloud2',     'assets/cloud03.50.png');

        game.load.image('wall_frauke','assets/afd-wall.50.png');
        game.load.image('wall_donald','assets/usa_assets/Trump-Wall.50.png');
        game.load.image('frauke',     'assets/Petry.png');
        game.load.image('donald',     'assets/Trump.png');
        game.load.image('erdogan',    'assets/tuerkei_assets/Erdogan.50.png');
        game.load.image('wall',       'assets/wall.png');

        game.load.image('tree0',      'assets/Tree01.50.png');
        game.load.image('tree1',      'assets/Tree02.50.png');
        game.load.image('tree2',      'assets/specialtree.50.png');
        game.load.image('office',     'assets/Kanzleramt.50.png');
        game.load.image('bush',       'assets/Bush01.50.png');
        game.load.image('sign',       'assets/Sign01.50.png');
        game.load.image('tumbleweed', 'assets/usa_assets/Tumbleweed.50.png');
        game.load.image('cactus0',    'assets/usa_assets/cactus01.50.png');
        game.load.image('cactus1',    'assets/usa_assets/cactus02.50.png');
        game.load.image('olivetree',  'assets/tuerkei_assets/Olive.50.png');
        game.load.image('goat',       'assets/tuerkei_assets/Goat.50.png');
        
        game.load.spritesheet(
                              'rails',
                              'assets/rails_animation.50.png',
                              375, 460
                              );
        game.load.spritesheet(
                              'eurostar',
                              'assets/star_animation.png',
                              60,64
                              );

        game.load.spritesheet('train', 'assets/Trains_animation.50.png', 120, 232);
        game.load.spritesheet('coin', 'assets/Coin.50.png', 32, 32);

    }
    
    game.load.audio('jump',   [
                               'sounds/jump.mp3',
                               'sounds/jump.ogg',
                               'sounds/jump.wav'
                               ]);
    game.load.audio('bling',  [
                               'sounds/coin.mp3',
                               'sounds/coin.ogg',
                               'sounds/coin.wav'
                               ]);
    game.load.audio('smash',  [
                               'sounds/wall_smash.mp3',
                               'sounds/wall_smash.ogg',
                               'sounds/wall_smash.wav'
                               ]);
    game.load.audio('star',  [
                              'sounds/bg_EU.mp3',
                              'sounds/bg_EU.ogg',
                              'sounds/bg_EU.wav'
                              ]);
    game.load.audio('tada',   [
                               'sounds/tada.mp3',
                               'sounds/tada.ogg',
                               'sounds/tada.wav'
                               ]);
    game.load.audio('ratter', [
                               'sounds/ratter.mp3',
                               'sounds/ratter.ogg',
                               'sounds/ratter.wav'
                               ]);
    game.load.audio('whistle', [
                                'sounds/whistle.mp3',
                                'sounds/whistle.ogg',
                                'sounds/whistle.wav'
                                ]);
    game.load.audio('bg_music', [
                                'sounds/die_internationale_8bit_simple_loop.mp3',
                                'sounds/die_internationale_8bit_simple_loop.ogg'
                                ]);
}
function is_retina() {
    /*
    var query = "(-webkit-min-device-pixel-ratio: 2), "
    + "(min-device-pixel-ratio: 2), "
    + "(min-resolution: 192dpi)";
    
    if (matchMedia(query).matches) {
        return true;
    } else {
        // do non high-dpi stuff
    }
    return false;
    */
    return true;
}

