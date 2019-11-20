window.onload = function() {
    var width = self.frameElement ? 960 : innerWidth,
        height = self.frameElement ? 500 : innerHeight;
    var data = d3.range(20).map(function() { return [Math.random() * width, Math.random() * height]; });
    console.log(data);
    var color = d3.scale.category10();
    var dataSet = [
        { word: "voisin", pos: [200, 200], col: 0 },
        { word: "village", pos: [200, 300], col: 1 },
        { word: "bonheur", pos: [200, 400], col: 2 },
        { word: "villégiature", pos: [200, 500], col: 3 }
    ];
    dataSet = [];
    var drag = d3.behavior.drag()
        .origin(function(d) { return { x: d[0], y: d[1] }; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    var dragWord = d3.behavior.drag()
        .origin(function(d) { return { x: d.pos[0], y: d.pos[1] }; })
        .on("dragstart", dragWordstarted)
        .on("drag", draggedWord)
        .on("dragend", dragWordended);

    var svg = d3.select("#svgcontainer")
        .on("touchstart", nozoom)
        .on("touchmove", nozoom)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("z-index", "1");

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#D1F7D5");

    // svg.append("g")
    //     .attr("transform", "translate(" + 0 + "," + 0 + ")");


    // svg.selectAll("circle")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("transform", function(d) { return "translate(" + d + ")"; })
    //     .attr("r", 32)
    //     .style("fill", function(d, i) { return color(i); })
    //     .call(drag);

    // d3.select("#svgcontainer")
    //     .selectAll("p")
    //     .data(["ma", "voix", "reprend", "des", "forces"])
    //     .enter().append("p")
    //     .text(function(d) { return d; });
    // // d3.select("#svgcontainer").text("D3:" + d3.select("#msg").property("value"));

    var words = svg.selectAll("g")
        .data(dataSet)
        .enter().append("g");
    //     .attr("x", function(d) { return d.pos[0]; })
    //     .attr("y", function(d) { return d.pos[1]; })
    //     .attr("transform", function(d) { return "translate(" + d.pos + ")"; })
    //     .call(dragWord);

    // var rects = words.append("svg:rect")
    //     .attr("width", 200)
    //     .attr("height", 40)
    //     .style("fill", "#FF9197");

    // var texts = words.append("svg:text")
    //     // .attr("x", function(d) { return d.pos[0]; })
    //     // .attr("y", function(d) { return d.pos[1]; })
    //     .attr("dx", "1.5em")
    //     .attr("dy", "1.5em")
    //     .text(function(d) { return d.word; })
    //     .style("fill", "#000000");
    setWords();

    function setWords() {
        words.attr("x", function(d) { return d.pos[0]; })
            .attr("y", function(d) { return d.pos[1]; })
            .attr("transform", function(d) { return "translate(" + d.pos + ")"; })
            .call(dragWord);

        var rects = words.append("svg:rect")
            // .attr("width", 200)
            .attr("width", function(d) {
                var l = d.word.length;
                var px = 16;
                return (px * 2) + l * 19;
            })
            .attr("height", 45)
            .style("fill", function(d) { return colorList[d.col]; });

        var texts = words.append("svg:text")
            // .attr("x", function(d) { return d.pos[0]; })
            // .attr("y", function(d) { return d.pos[1]; })
            .attr("dx", "0.45em")
            .attr("dy", "1em")
            .text(function(d) { return d.word; })
            .style("fill", function(d) { return colorList[getOppositeColor(d.col)]; })
            .style("font-size", "32")
            .attr("font-family", "Source Code Pro")
            .style("cursor", "default");
    }

    function updateData(word) {
        if (word.length > 0) {
            var ww = word.length;
            var px = 16;
            ww = (px * 2) + ww * 19;
            var xRand = Math.random() * width;
            var newX = (xRand + ww > innerWidth) ? (xRand - ww) : xRand;
            var newY = Math.max(10, Math.random() * height - 40);
            var col = Math.floor(Math.random() * 5);
            var w = { word: word, pos: [newX, newY], col: col };
            dataSet.push(w);
            console.log(dataSet);
            // svg.enter().append("svg");
            // words.data(dataSet);


            words = svg.selectAll("g").data(dataSet);
            words.exit().remove();

            words.enter().append("g");
            setWords();
        }


        // var selection = words.data(dataSet);
        // selection.exit().remove();
        // words.data(dataSet)
        //     .attr("x", function(d) { return d.pos[0]; })
        //     .attr("y", function(d) { return d.pos[1]; })
        //     .attr("transform", function(d) { return "translate(" + d.pos + ")"; })
        //     .call(dragWord);

        // // words.select("g");
        // rects.attr("width", 200)
        //     .attr("height", 40)
        //     .style("fill", "#7B89FF");

        // // words.select("text");
        // texts.attr("dx", "1.5em")
        //     .attr("dy", "1.5em")
        //     .text(function(d) { return d.word; })
        //     .style("fill", "#000000");
    }

    var form = document.getElementById("newword");
    // console.log(form);

    function handleForm(event) {
        console.log(event);
        console.log(document.getElementById("word").value);
        var wo = document.getElementById("word").value;
        updateData(wo);
        event.preventDefault();
    }
    form.addEventListener('submit', handleForm);


    function saveSVG(event) {
        writeDownloadLink();
        event.preventDefault();
    }
    document.getElementById('save-svg').onclick = function() {
        form.target = '_blank';
        writeDownloadLink();
        // form.submit();
    }

    function dragstarted() {
        this.parentNode.appendChild(this);

        d3.select(this).transition()
            .ease("elastic")
            .duration(500)
            .attr("r", 48);
    }

    function dragWordstarted() {
        // this.parentNode.appendChild(this);
    }

    function dragged(d) {
        d[0] = d3.event.x;
        d[1] = d3.event.y;

        d3.select(this)
            .attr("transform", "translate(" + d + ")");
    }

    function draggedWord(d) {
        d.pos[0] = d3.event.x;
        d.pos[1] = d3.event.y;
        d3.select(this)
            .attr("transform", "translate(" + d.pos + ")");
    }

    function dragended() {
        d3.select(this).transition()
            .ease("elastic")
            .duration(500)
            .attr("r", 32);
    }

    function dragWordended() {}

    function nozoom() {
        d3.event.preventDefault();
    }
};

function handleClick(event) {
    console.log(document.getElementById("myVal").value)
    draw(document.getElementById("myVal").value)
    return false;
}

function draw(val) {
    // d3.select("body").select("ul").append("li");
    dataset.push(val);
    var p = d3.select("body").selectAll("li")
        .data(dataset)
        .text(function(d, i) { return i + ": " + d; })
}

function writeDownloadLink() {
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = d3.select("svg")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], { type: "image/svg+xml" });
    saveAs(blob, "mes-mots.svg");
};



var colorList = [
    "#4094C1",
    "#FAD26E",
    "#E96861",
    "#38A56F",
    "#E3DFE8"
];


function getOppositeColor(i) {
    var newIndex;
    switch (i) {
        case 0:
            newIndex = 1;
            break;
        case 1:
            newIndex = 0;
            break;
        case 2:
            newIndex = 4;
            break;
        case 3:
            newIndex = 4;
            break;
        case 4:
            newIndex = 2;
            break;
        default:
            newIndex = 0;
    }
    return newIndex;
}
// https://stackoverflow.com/questions/20644415/d3-appending-text-to-a-svg-rectangle
// https://bl.ocks.org/mbostock/9631744
// https://bl.ocks.org/d3noob/204d08d309d2b2903e12554b0aef6a4d
// https://gist.github.com/niksumeiko/360164708c3b326bd1c8
// https://stackoverflow.com/questions/19454310/stop-form-refreshing-page-on-submit
// http://bl.ocks.org/eesur/9910343
// https://d3js.org/
// http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
// https://stackoverflow.com/questions/52821117/how-to-append-multiple-rectangles-in-d3
// https://devdocs.io/d3~4/d3-selection#selection_classed
// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
// https://www.geeksforgeeks.org/d3-js-d3-range-function/
// https://github.com/d3/d3-drag
// https://www.tutorialspoint.com/d3js/d3js_dragging_api.htm
// https://stackoverflow.com/questions/36367191/d3-js-creating-a-rectangle/36367254#36367254
// view-source:https://bl.ocks.org/mbostock/raw/9631744/
// https://bl.ocks.org/mbostock/raw/9631744/
// https://bl.ocks.org/mbostock/9631744
// https://www.dashingd3js.com/svg-basic-shapes-and-d3js