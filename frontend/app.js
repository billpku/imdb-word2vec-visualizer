import React from 'react';
import url from 'url';
import $ from 'jquery';
import d3 from 'd3';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {similarWords: {}};
    this.errorHandler = this.errorHandler.bind(this);
  }

  render() {

    if (this.state.error) {
      return <div>
        <h1>{this.state.error}</h1>
        <h3>{this.state.errorMessage}</h3>
      </div>
    }

    if (!this.state.similarWords) {
      return <div>Loading...</div>
    }

    return (
        <div className="similar-words"></div>
    )
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    let onclick = (e) => {
      console.log(e);
      this.graph.nodes.push({name: 'Foo', group: e.group + 1});
      this.graph.nodes.push({name: 'Bar', group: e.group + 1});
      this.graph.links.push({source: e.index, target: this.graph.nodes.length - 2, value: 0.5});
      this.graph.links.push({source: e.index, target: this.graph.nodes.length - 1, value: 0.5});

      this.updateGraph();
    };

    if (this.graph.nodes.length == 0) {
      this.graph.nodes.push({"name": this.state.query, "group":1});

      Object.keys(this.state.similarWords).forEach((word, index) => {
        this.graph.nodes.push({name: word, group: 2});
        this.graph.links.push({source: 0, target: index + 1, value: this.state.similarWords[word] * 10});
      });
    }

    var color = d3.scale.category20();

    var link = this.svg.selectAll(".link")
        .data(this.graph.links);

    link.enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return d.value; });

    link.exit().remove();

    var node = this.svg.selectAll(".node")
        .data(this.graph.nodes);

    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on("click", onclick)
        .call(this.force.drag);

    nodeEnter.append("circle")
        .attr("r", 40)
        .style("fill", function(d) { return color(d.group); })

    nodeEnter.append("title")
        .text(function(d) { return d.name; });

    nodeEnter.append("text")
        .attr("dx", ".10em")
        .attr("dy", ".10em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });

    node.exit().remove();

    this.force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    this.force
        .charge(-2500)
        .gravity(0.1)
        .linkDistance(400)
        .size([1000, 1000])
        .start();
  }

  componentDidMount() {
    var width = 1000,
        height = 1000;

    this.force = d3.layout.force();

    this.graph = {
      nodes: this.force.nodes(),
      links: this.force.links()
    };

    this.svg = d3.select(".similar-words").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid");
  }

  doWordRequest(query) {
    return $.get(`http://127.0.0.1:8080/similarity/${query}`).then((response) => {
      this.setState({
        query: query,
        similarWords: response
      });

      return response;
    }, this.errorHandler);
  }

  errorHandler(err) {
    const errorMessage = err.responseJSON ? err.responseJSON.error : err.responseText;
    this.setState({error: 'Error', errorMessage: errorMessage});
  }
}
