"use strict";

let firebird_update_interval = 2000;

// this is a dummy. get options from firebase
let default_coin_spending_options = [
        { 
            name: "Bildung",
            key: "34sve5ubd6" // those are fake keys.
        }, 
        { 
            name: "Europaeische Union",
            key: "sb4795n"
        }, 
        { 
            name: "Krankenversicherung",
            key: "h6876og"
        }, 
        { 
            name: "Rentenversicherung",
            key: "voiur5c0"
        } 
    ];


function firebird_get_category_keys() {
    let keys = Array();
    default_coin_spending_options.forEach(function (d) {
        keys.push(d.key);
    });
    return keys
}

function firebird_get_category_names() {
    let keys = Array();
    default_coin_spending_options.forEach(function (d) {
        keys.push(d.name);
    });
    return keys
}

function firebird_get_category_coin_counts() {
    let coin_counts = Array();
    let total_coins = 0;
    default_coin_spending_options.forEach(function (d) {
        let coins = Math.random()*10000;
        total_coins += coins;
        coin_counts.push({label: d.name, value: coins}); 
    });

    for(let i=0;i<coin_counts.length;i++){
        coin_counts[i].percentage = 100*coin_counts[i].value/total_coins;
    }


    return coin_counts;
    
}
