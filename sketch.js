var move = function(dx, dy, x, y) {
    var clientX, clientY;
    if ((typeof dx == 'object') && (dx.type == 'touchmove')) {
        clientX = dx.changedTouches[0].clientX;
        clientY = dx.changedTouches[0].clientY;
        dx = clientX - this.data('ox');
        dy = clientY - this.data('oy');
    }
    this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    });
}

var start = function(x, y, ev) {
    if ((typeof x == 'object') && (x.type == 'touchstart')) {
        x.preventDefault();
        this.data('ox', x.changedTouches[0].clientX);
        this.data('oy', x.changedTouches[0].clientY);
    }
    this.data('origTransform', this.transform().local);
};

var stop = function() {};

window.onload = function() {
    var height = window.innerHeight,
        width = window.innerWidth;
    var s = Snap("#maboite");
    var background = s.rect(0, 0, width, height);
    background.attr({
        fill: "#CBAF6C",
        stroke: "#000",
        strokeWidth: 0
    });
    var bigCircle = s.circle(200, 10, 40);
    // bigCircle.addClass("draggable");
    var bigCircle2 = s.circle(60, 40, 40);
    bigCircle2.attr({
        fill: "#CB232E",
        stroke: "#000",
        strokeWidth: 0
    });
    var t1 = s.text(60, 40, "Snap");
    var groupe = s.group(bigCircle2, t1);
    // groupe.addClass("draggable-group");
    bigCircle.drag(move, start, stop);
    groupe.drag(move, start, stop);
}



function makeDraggable(evt) {
    var svg = evt.target;

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        if (evt.touches) { evt = evt.touches[0]; }
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    var selectedElement, offset, transform;

    function initialiseDragging(evt) {
        offset = getMousePosition(evt);

        // Make sure the first transform on the element is a translate transform
        var transforms = selectedElement.transform.baseVal;

        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translate = svg.createSVGTransform();
            translate.setTranslate(0, 0);
            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }

        // Get initial translation
        transform = transforms.getItem(0);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;
    }

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable')) {
            selectedElement = evt.target;
            initialiseDragging(evt);
        } else if (evt.target.parentNode.classList.contains('draggable-group')) {
            selectedElement = evt.target.parentNode;
            initialiseDragging(evt);
        }
    }

    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var coord = getMousePosition(evt);
            transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
    }

    function endDrag(evt) {
        selectedElement = false;
    }
}