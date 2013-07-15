/*jslint unparam: true */
/*globals $, d3, console, window */

(function () {
    "use strict";

    var width = 1500,
        height = 1000;

    var color = d3.scale.category10();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    $.ajax({
        url: "https://www.healthcare.gov/api/index.json",
        dataType: "jsonp",
        success: function (data) {
            var nodes, nodeMap, links, graph;
            console.log(data);
            nodes = [];
            links = [];
            nodeMap = {};
            data.forEach(function (d) {
                if (!d) {
                    return;
                }
                if (d.categories.length > 0) {
                    return;
                }
                d.name = d.title;
                d.type = "article";
                nodes.push(d);
                d.categories.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "category"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d.topics.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "topic"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d.tags.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "tag"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d.audience.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "audience"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d.condition.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "condition"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d["insurance-status"].forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "insurance-status"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
                d.segment.forEach(function (c) {
                    var node = nodeMap[c];
                    if (!nodeMap[c]) {
                        node = {name: c, type: "segment"};
                        nodeMap[c] = node;
                        nodes.push(node);
                    }
                    links.push({source: d, target: node});
                });
            });

            graph = {nodes: nodes, links: links};

            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = svg.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke", "black")
                .style("stroke-width", 1)
                .style("opacity", 0.2);

            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 6)
                .style("fill", function(d) { return color(d.type); })
                .style("opacity", 1)
                .style("cursor", function (d) {
                    if (d.url) {
                        return "pointer";
                    }
                })
                .on("mouseover", function (d) {
                    nodes.forEach(function (node) {
                        node.brush = false;
                    });
                    links.forEach(function (link) {
                        if (link.source === d || link.target === d) {
                            link.source.brush = true;
                            link.target.brush = true;
                            link.brush = true;
                        } else {
                            link.brush = false;
                        }
                    });
                    node.style("opacity", function (node) { return node.brush ? 1 : 0.2; });
                    link.style("opacity", function (link) { return link.brush ? 1 : 0.2; });
                })
                .on("mouseout", function (d) {
                    node.style("opacity", 1);
                    link.style("opacity", 0.2);
                })
                .on("click", function (d) {
                    if (d.url) {
                        window.location = "https://www.healthcare.gov" + d.url;
                    }
                })
                .call(force.drag);

            node.append("title")
                .text(function(d) { return d.type + ": " + d.name; });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });
        }
    });
}());