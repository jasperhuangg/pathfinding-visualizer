var grid_width = 50;
var grid_height = 30;

const startCellColor = "rgb(39, 224, 7)";
const finishCellColor = "rgb(224, 18, 7)";
const obstacleColor = "rgb(47, 79, 79)";
const normalCellColor = "rgb(255, 255, 255)";

var searching = false;
var needToRecolor = false;

var startCell = { x: 5, y: 5 };
var finishCell = { x: grid_width - 15, y: grid_height - 20 };

graph = [];

function initializeGraph() {
  for (let x = 0; x < grid_width; x++) {
    graph[x] = [];
    for (let y = 0; y < grid_height; y++) {
      graph[x].push({ x: x, y: y, blocked: false });
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function recolorGrid() {
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      var index = j * grid_width + i;
      var cell = $(".grid-square").eq(index);
      if (
        cell.css("background-color") !== startCellColor &&
        cell.css("background-color") !== finishCellColor &&
        cell.css("background-color") !== obstacleColor
      ) {
        cell.css("background-color", normalCellColor);
      }
    }
  }
  needToRecolor = false;
}

function colorNode(node, color) {
  if (!equalNodes(node, startCell) && !equalNodes(node, finishCell)) {
    var index = node.y * grid_width + node.x;
    $(".grid-square").eq(index).css("background-color", color);
  }
}

function equalNodes(node1, node2) {
  return node1.x === node2.x && node1.y === node2.y;
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

    var divStr = "<div class='grid-square'";

    if (equalNodes(coord, startCell))
      divStr += "style='background-color: " + startCellColor + "'";
    else if (equalNodes(coord, finishCell))
      divStr += "style='background-color: " + finishCellColor + "'";

    divStr += "></div>";
    $("#graph").append(divStr);
  }
}

function shallowCopyGraph(src, dest) {
  dest = new Array(src.length);
  for (let i = 0; i < src.length; i++) {
    dest[i] = new Array(src[i].length);
    for (let j = 0; j < src[i].length; j++) {
      dest[i][j] = {
        x: src[i][j].x,
        y: src[i][j].y,
        blocked: src[i][j].blocked,
      };
    }
  }
  return dest;
}

initializeGraph();
drawGraph();
