// Code for an interactive bubble visualization in D3.

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
      if (user.mousedOver) {
        return user.following.length * 2;
      } else {
        return user.following.length;
      }
    });

    // the 'circle packing' algorithm is designed for hierarchical data. here we
    // just pack all user records into one single root, so that the data can
    // work with the algorithm.
    var root = {
      isRoot: true,    // used to tell if a data record is the root or not
      children: users, // predefined by the layout algorithm for representing hierachies
    };

    function transform(d) {
      // we apply a transform on the whole <g> so that we don't have to specify
      // x and y on circles and text elements individually.
      return 'translate(' + d.x + ',' + d.y + ')';
    }

    function fontSize(d) {
      if (d.mousedOver) {
        return '18pt';
      } else {
        return '9pt';
      }
    }

    function radius(d) {
      // r is a field added by the layout algorithm. its value indicates the
      // radius of the laid out circle for this data record.
      return d.r;
    }

    function update() {
      var laidOut = bubbleLayout.nodes(root);

      var node = svg.selectAll('.node').data(laidOut);

      var g = node.enter().append('g').classed('node', true);
      g.attr('transform', transform);
      g.on('mouseenter', function(d, i) {
        d.mousedOver = true;
        update();
      });
      g.on('mouseleave', function(d, i) {
        d.mousedOver = false;
        update();
      });
      g.on('click', function(d, i) {
        console.log("clicked: ", d);
      });

      var circle = g.append('circle');
      circle.attr('r', radius);
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
      text.attr('font-size', fontSize);
      text.attr('text-anchor', 'middle');
      text.attr('dominant-baseline', 'middle');

      var transition = node.transition().duration(1000);
      transition.attr('transform', transform)
      transition.select('text').attr('font-size', fontSize);
      transition.select('circle').attr('r', radius);
    };

    update();
  });
}

main();


