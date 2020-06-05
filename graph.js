var grid_width = 60;
var grid_height = 22;

var searching = false;

var startCell = { x: 3, y: grid_height / 2 };
var finishCell = { x: grid_width - 4, y: grid_height / 2 };

graph = [];

function initializeGraph() {
  for (let x = 0; x < grid_width; x++) {
    graph[x] = [];
    for (let y = 0; y < grid_height; y++) {
      graph[x].push({ x: x, y: y, blocked: false });
    }
  }
}

function drawGraph() {
  // set grid-template-columns css property for .grid to be grid_width x 1fr
  var gridTemplateString = "";

  for (let i = 0; i < grid_width; i++) {
    gridTemplateString += "1fr";
    if (i !== grid_width - 1) gridTemplateString += " ";
  }

  $("#graph").css("grid-template-columns", gridTemplateString);

  const GridWidthXGridHeight = grid_width * grid_height;

  // append grid_width * grid_height divs inside of graph
  for (let i = 0; i < GridWidthXGridHeight; i++) {
    var x = i % grid_width;
    var y = (i - x) / grid_width;

    var coord = { x: x, y: y };

    var divStr = "<div draggable='true' class='grid-square";

    if (equalNodes(coord, startCell)) divStr += " start";
    else if (equalNodes(coord, finishCell)) divStr += " finish";

    divStr += "'></div>";
    $("#graph").append(divStr);
  }
}

initializeGraph();
drawGraph();
