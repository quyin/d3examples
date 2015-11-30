// Code for my first project using D3.

function main() {
  // create a <svg> element inside the #visualization div
  var svg = d3.select('#visualization').append('svg');
  svg.attr('width', 800);
  svg.attr('height', 800);

  // create a <circle> element inside <svg>
  var circle = svg.append('g').append('circle');
  circle.attr('r', 100);             // radius
  circle.attr('cx', 200);            // x coordiate of the center
  circle.attr('cy', 200);            // y coordiate of the center
  circle.style('fill', 'lightblue'); // fill color
}

main();

