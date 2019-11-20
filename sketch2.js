window.onload = function() {
    var height = window.innerHeight,
        width = window.innerWidth;
    var draw = SVG('maboite')
    var background = draw.rect(width, height).move(0, 0).fill('#FFF2C4');
    var rect = draw.rect(100, 100).move(0, 0).fill('#FF3EE8');
    rect.draggable();
    var rect2 = draw.rect(100, 100).move(50, 50).fill('#FF3442');
    rect2.draggable();
};