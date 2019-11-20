window.onload = function() {
    var width = self.frameElement ? 960 : innerWidth,
        height = self.frameElement ? 500 : innerHeight;
    var data = d3.range(20).map(function() { return [Math.random() * width, Math.random() * height]; });
    console.log(data);
    var color = d3.scale.category10();
    var dataSet = [
        { word: "voisin", pos: [200, 200] },
        { word: "village", pos: [200, 300] },
        { word: "bonheur", pos: [200, 400] },
        { word: "villégiature", pos: [200, 500] }
    ];
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

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + d + ")"; })
        .attr("r", 32)
        .style("fill", function(d, i) { return color(i); })
        .call(drag);

    d3.select("#svgcontainer")
        .selectAll("p")
        .data(["ma", "voix", "reprend", "des", "forces"])
        .enter().append("p")
        .text(function(d) { return d; });
    // d3.select("#svgcontainer").text("D3:" + d3.select("#msg").property("value"));

    var bar = svg.selectAll("g")
        .data(dataSet)
        .enter().append("g")
        // .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        // .attr("transform", function(d) { return "translate(" + d + ")"; })
        // .attr("transform", function(d) { return "translate([" + d.x + ", " + d.y + "])"; })
        .attr("x", function(d) { return d.pos[0]; })
        .attr("y", function(d) { return d.pos[1]; })
        .attr("transform", function(d) { return "translate(" + d.pos + ")"; })
        .call(dragWord);

    bar.append("rect")

        .attr("width", 200)
        .attr("height", 40)
        .style("fill", "#FF9197");

    bar.append("text")
        // .attr("x", function(d) { return d.pos[0]; })
        // .attr("y", function(d) { return d.pos[1]; })

        .attr("dx", "1.5em")
        .attr("dy", "1.5em")
        .text(function(d) { return d.word; })
        .style("fill", "#000000");

    var form = document.getElementById("newword");
    // console.log(form);

    function handleForm(event) {
        console.log(document.getElementById("word").value);
        event.preventDefault();
    }
    form.addEventListener('submit', handleForm);

    function dragstarted() {
        this.parentNode.appendChild(this);

        d3.select(this).transition()
            .ease("elastic")
            .duration(500)
            .attr("r", 48);
    }

    function dragWordstarted() {
        this.parentNode.appendChild(this);
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
    saveAs(blob, "myProfile.svg");
};




// https://stackoverflow.com/questions/20644415/d3-appending-text-to-a-svg-rectangle
// https://bl.ocks.org/mbostock/9631744
// https://bl.ocks.org/d3noob/204d08d309d2b2903e12554b0aef6a4d