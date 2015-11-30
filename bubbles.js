// Code for a static bubble visualization in D3.

function main() {
  var svg = d3.select('#visualization').append('svg');
  svg.attr('width', 800);
  svg.attr('height', 800);

  d3.text('flickr-20users', function(err, content) {
    if (err) {
      console.error(err);
      return;
    }

    var lines = content.trim().split('\n');
    var users = lines.map(function(line) {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.warn("Cannot parse line: " + line);
      }
    });
    console.log(users);

    var palette = d3.scale.category20();

    // create a layout helper
    var bubbleLayout = d3.layout
      .pack()           // type of layout (short for 'circle packing')
      .size([800, 800]) // total size of laid out visualization
      .sort(null)       // tell D3 not to sort data
      .padding(5);      // padding between bubbles, in pixel

    // for circle packing algorithms, d3 assumes that the input data has a
    // predefined field, 'value', so that it can compute the size for each
    // circle.
    //
    // or, you can provide a function to compute the value for each data record,
    // which is what we are doing here.
    bubbleLayout.value(function(user) {
      return user.following.length;
    });

    // the 'circle packing' algorithm is designed for hierarchical data. here we
    // just pack all user records into one single root, so that the data can
    // work with the algorithm.
    var root = {
      isRoot: true,    // used to tell if a data record is the root or not
      children: users, // predefined by the layout algorithm for representing hierachies
    };

    // data binding!
    // laidOut contains the same data as root, with extra fields added by the
    // layout algorithm to indicate where to put the circles and how big they
    // are.
    var laidOut = bubbleLayout.nodes(root);

    var node = svg.selectAll('.node').data(laidOut);

    var g = node.enter().append('g').classed('node', true);
    g.attr('transform', function(d) {
      // we apply a transform on the whole <g> so that we don't have to specify
      // x and y on circles and text elements individually.
      return 'translate(' + d.x + ',' + d.y + ')';
    });

    var circle = g.append('circle');
    circle.attr('r', function(d) {
      // r is a field added by the layout algorithm. its value indicates the
      // radius of the laid out circle for this data record.
      return d.r;
    });
    circle.style('fill', function(d, i) {
      if (d.isRoot) {
        return 'none'; // don't fill the circle that contains everything
      } else {
        return palette(i);
      }
    });

    var text = g.append('text');
    text.text(function(d) {
      if (!d.isRoot) {
        return d.following.length;
      }
    });
    text.attr('font-family', 'Helvetica');
    text.attr('font-size', '9pt');
    text.attr('text-anchor', 'middle');
    text.attr('dominant-baseline', 'middle');
  });
}

main();

