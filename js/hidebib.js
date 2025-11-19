// from: http://www.robots.ox.ac.uk/~vedaldi/assets/hidebib.js
function showselected()
{
    var el = document.getElementsByTagName("div") ;
    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "paper") {
            if (el[i] .dataset.selected == 'n'){
                el [i] .style.display = 'none' ;
            }
        }
    }

    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "year_heading") {
            el [i] .style.display = 'none' ;
        }
    }
    document.getElementById('select').style = 'text-decoration:underline';
    document.getElementById('unselect').style = '';
}


function showall()
{
    var el = document.getElementsByTagName("div") ;
    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "paper") {
            if (el[i] .dataset.selected == 'n'){
                el [i] .style.display = 'block' ;
            }
        }
    }

    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "year_heading") {
            el [i] .style.display = 'block' ;
        }
    }
    document.getElementById('unselect').style = 'text-decoration:underline';
    document.getElementById('select').style = '';
}

function hideallbibs()
{
    var el = document.getElementsByTagName("div") ;
    for (var i = 0 ; i < el.length ; ++i) {
        if (el[i].className == "paper") {
            var bib = el[i].getElementsByTagName("pre") ;
            if (bib.length > 0) {
                bib [0] .style.display = 'none' ;
            }
        }
    }
}

function togglebib(paperid)
{
    var paper = document.getElementById(paperid) ;
    var bib = paper.getElementsByTagName('pre') ;
    if (bib.length > 0) {
        if (bib [0] .style.display == 'none') {
            bib [0] .style.display = 'block' ;
        } else {
            bib [0] .style.display = 'none' ;
        }
    }
}

function toggleblock(blockId)
{
    var block = document.getElementById(blockId);
    if (block.style.display == 'none') {
    	block.style.display = 'block' ;
    } else {
    	block.style.display = 'none' ;
    }
}

function hideblock(blockId)
{
    var block = document.getElementById(blockId);
    block.style.display = 'none' ;
}