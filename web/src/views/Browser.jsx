var React = require('react')
var d3 = require('d3')
var acorn = require('acorn-jsx')

var src

var Browser = React.createClass({
  propTypes: {
    fileData: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      ast: parseFile(this.props.fileData)
    }
  },
  componentWillReceiveProps: function(props) {
    initGraph(this.state.ast, props.fileData)
    this.setState({
      ast: parseFile(props.fileData)
    })
  },
  componentDidMount: function() {
    initGraph(this.state.ast, this.props.fileData)
    update.call(this, this.state.ast)
  },
  componentDidUpdate: function() {
    update.call(this, this.state.ast)
  },
  closeModal: function(e) {
    this.setState({info: null})
    e.preventDefault()
  },
  render: function() {
    var modalContent
    if (this.state.info) {
      modalContent = this.state.info
    }
    return <div id="browser">
      <div className="modal" style={{display:modalContent ? 'block' : 'none'}}>
        <a href="#" onClick={this.closeModal} className="close">close</a>
        <pre>
        {modalContent}
        </pre>
      </div>
    </div>
  }
})

function parseFile(contents) {
  var opts = {
    ecmaVersion: 6,
    plugins: { jsx: true }
  }
  var parse = acorn.parse
  var ast = parse(contents, opts)
  function walk(node, parent) {
    var children = []
    Object.keys(node).forEach(function (key) {
      if (key === 'parent') return

      var child = node[key]
      if (Array.isArray(child)) {
        child.forEach(function (c) {
          if (c && typeof c.type === 'string') {
            children.push(walk(c, node))
          }
        })
      } else if (child && typeof child.type === 'string') {
        children.push(walk(child, node))
      }
    })
    if (children.length) node.children = children
    return node
  }
  return walk(ast, undefined)
}

var margin = {top: 30, right: 20, bottom: 30, left: 20}
var width = 960 - margin.left - margin.right
var barHeight = 20
var barWidth = width * .8
var duration = 400
var i = 0
var svg, diagonal, tree, tooltip, root

function initGraph(data, raw) {
  tree = d3.layout.tree()
      .nodeSize([0, 20]);

  diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  d3.select("#browser").select("svg").remove()

  svg = d3.select("#browser").append("svg")
      .attr("width", width + margin.left + margin.right)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data
  src = raw
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

function update(source) {
  if (isNaN(source.x0)) source.x0 = 0
  if (isNaN(source.y0)) source.y0 = 0
  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg").transition()
      .duration(duration)
      .attr("height", height);

  d3.select(self.frameElement).transition()
      .duration(duration)
      .style("height", height + "px");

  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * barHeight;
  });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", function(d) {
        return d._open ? 500 : barHeight;
      })
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) {
        var r = d.type
        if (d.start && d.end) {
          r += ' : '
          r += src.slice(d.start, d.end).split('\n')[0]
        }
        return r
      });

  var component = this
  nodeEnter.append("svg:image")
    .attr('x',barWidth - 20)
    .attr('y', -8)
    .attr('width', 15)
    .attr('height', 15)
    .attr("xlink:href","img/info.png")
    .style('cursor', 'pointer')
    .on('click', function(d) {
      var info = JSON.stringify(d, function(k, v) {
        if (k === 'parent') return '[Circular]'
        if (k === 'children' || k === '_children') return '...'
        return v
      }, 2);
      component.setState({info: info});
    })

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

module.exports = Browser;
