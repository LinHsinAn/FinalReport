var ls = window.localStorage; 

var keys = document.getElementsByClassName("i18n"); 

function replace(zh, en) {
    for (var i = 0; i < keys.length; i++) {
        if (ls.lang == "en") {
            keys[i].innerHTML = keys[i].innerHTML.replace(zh, en);
        }
    }
}

function switchlang() {
    if (ls.lang == "en") {
        ls.lang = "zh";
    } 
    else {
        ls.lang = "en";
    }

    location.reload(); 
}

document.addEventListener('DOMContentLoaded', function() {
    
    var langBtn = document.getElementById("lang_switch");

    if (langBtn) {
        langBtn.innerText = (ls.lang == "en") ? "中文" : "English";
        
        langBtn.onclick = function() {
            switchlang();
        };
    }

    if (typeof runI18n === "function") {
        runI18n();
    }
});