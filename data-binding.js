// Code for data binding in D3.

function main() {
  var svg = d3.select('#visualization').append('svg');
  svg.attr('width', 800);
  svg.attr('height', 800);

  // load the data from a text file, and call the callback function when it's
  // done
  d3.text('flickr-20users', function(err, content) {
    if (err) {
      // if any error happens, we just print it and return (thus no
      // visualization will be shown)
      console.error(err);
      return;
    }

    // split the content by line. trim() is used to rid empty line(s) at the end
    var lines = content.trim().split('\n');

    // lines.map() applies the function on each element in the array, to
    // transform the array into another one.
    // in this case, transform lines to user objects, by parsing the JSON
    // string.
    var users = lines.map(function(line) {
      try {
        return JSON.parse(line);
      } catch (error) {
        console.warn("Cannot parse line: " + line);
      }
    });
    console.log(users); // just for debugging

    // create a sqrt scale for converting following count to circle radius
    var followingCounts = users.map(function(user) {
      return user.following.length;
    });
    var min = Math.min.apply(null, followingCounts);
    var max = Math.max.apply(null, followingCounts);
    var scale = d3.scale.sqrt().domain([min, max]).range([12, 50]);

    // helper functions for computing radius and position
    function radius(user) {
      return scale(user.following.length);
    }
    function circlex(user, i) {
      return (i%5) * 120 + 80;
    }
    function circley(user, i) {
      return Math.floor(i/5) * 120 + 80;
    }

    // helper for colors
    var palette = d3.scale.category20();

    // DATA BINDING !!!
    var node = svg         // takes the <svg> element we created before,
      .selectAll('.node')  // select all the subelements with class 'node'
      .data(users);        // bind each subelement with one user object from users

    // at this point, node is a placeholder for each existing, to-be-created,
    // and to-be-deleted subelement -- this is the key for understanding how D3
    // works.

    var g = node
      .enter()                // returns a placeholder for each to-be-created element
      .append('g')            // create the element (a <g> inside <svg>)
      .classed('node', true); // set CSS class so that we can select them from now on

    var circle = g.append('circle'); // create a <circle> inside each <g>
    circle.attr('r', radius);
    circle.attr('cx', circlex);
    circle.attr('cy', circley);
    circle.style('fill', function(d, i) {
      return palette(i); // returns different colors for different i's
    });

    var text = g.append('text'); // create a <text> inside each <g>
    text.text(function(d) {
      return d.following.length;
    });
    text.attr('font-family', 'Helvetica');
    text.attr('font-size', '9pt');
    text.attr('text-anchor', 'middle');       // horizontal centering
    text.attr('dominant-baseline', 'middle'); // vertical centering
    text.attr('x', circlex);
    text.attr('y', circley);
  });
}

main();

