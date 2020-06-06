// TODO: figure out how to exit properly from loop
// - likely need two different set strings, startSet and startFinish
// - when the same node is found in both the start and finish closed set, we stop searching

async function bidirectionalAStar(graph, startNode, finishNode) {
  recolorGrid();
  searching = true;

  const infinity = Number.MAX_VALUE;
  var openStart = [];
  var openFinish = [];
  var bidirectionalAStarGraph = shallowCopyGraph(graph, []);

  var numSteps = 0;
  $("#steps-taken").html("Tiles Examined: " + numSteps);

  const startX = startNode.x;
  const startY = startNode.y;

  const finishX = finishNode.x;
  const finishY = finishNode.y;

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < bidirectionalAStarGraph.length; i++) {
    for (let j = 0; j < bidirectionalAStarGraph[i].length; j++) {
      bidirectionalAStarGraph[i][j].f = infinity;
      bidirectionalAStarGraph[i][j].g = infinity;
      bidirectionalAStarGraph[i][j].h = infinity;
      bidirectionalAStarGraph[i][j].setStart = "neither";
      bidirectionalAStarGraph[i][j].setFinish = "neither";
    }
  }

  // initialize start node's distance to be 0
  bidirectionalAStarGraph[startX][startY].f = 0;
  bidirectionalAStarGraph[startX][startY].g = 0;
  bidirectionalAStarGraph[startX][startY].h = 0;
  bidirectionalAStarGraph[startX][startY].setStart = "open";

  // initialize finish node's distance to be 0
  bidirectionalAStarGraph[finishX][finishY].f = 0;
  bidirectionalAStarGraph[finishX][finishY].g = 0;
  bidirectionalAStarGraph[finishX][finishY].h = 0;
  bidirectionalAStarGraph[finishX][finishY].setFinish = "open";

  openStart.push(bidirectionalAStarGraph[startX][startY]);
  openFinish.push(bidirectionalAStarGraph[finishX][finishY]);

  var lastNodeStart;
  var lastNodeFinish;
  while (openStart.length > 0 && openFinish.length > 0) {
    openStart.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      else return a.h - b.h;
    });

    openFinish.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      else return a.h - b.h;
    });

    var currNodeStart = openStart.shift();
    var currNodeFinish = openFinish.shift();

    currNodeStart.setStart = "closed";
    currNodeFinish.setFinish = "closed";

    $(".currentNodeGray").removeClass("currentNodeGray");
    $(".currentNodeSunset").removeClass("currentNodeSunset");
    $(".currentNodeOcean").removeClass("currentNodeOcean");
    $(".currentNodeChaos").removeClass("currentNodeChaos");
    $(".currentNodeGreen").removeClass("currentNodeGreen");
    $(".currentNodeCottonCandy").removeClass("currentNodeCottonCandy");

    colorNode(currNodeStart, "currentNode");
    colorNode(currNodeFinish, "currentNode");

    if (lastNodeStart !== undefined) colorNode(lastNodeStart, "visited");
    if (lastNodeFinish !== undefined) colorNode(lastNodeFinish, "visited");

    if (currentSpeed === "fast") await sleep(20);
    else if (currentSpeed === "medium") await sleep(180);
    else if (currentSpeed === "slow") await sleep(500);

    console.log(currNodeStart.setFinish + ", " + currNodeFinish.setStart);

    if (
      currNodeStart.setFinish === "closed" ||
      currNodeFinish.setStart === "closed"
    ) {
      console.log("breaking");
      break;
    }

    // SEARCH FROM START

    var validNeighborsStart = [];
    var left = currNodeStart.x - 1;
    var right = currNodeStart.x + 1;
    var up = currNodeStart.y - 1;
    var down = currNodeStart.y + 1;

    // consider all of the current node's valid neighbors
    if (left >= 0 && !bidirectionalAStarGraph[left][currNodeStart.y].blocked) {
      validNeighborsStart.push(bidirectionalAStarGraph[left][currNodeStart.y]);
    }
    if (
      right < grid_width &&
      !bidirectionalAStarGraph[right][currNodeStart.y].blocked
    ) {
      validNeighborsStart.push(bidirectionalAStarGraph[right][currNodeStart.y]);
    }
    if (up >= 0 && !bidirectionalAStarGraph[currNodeStart.x][up].blocked) {
      validNeighborsStart.push(bidirectionalAStarGraph[currNodeStart.x][up]);
    }
    if (
      down < grid_height &&
      !bidirectionalAStarGraph[currNodeStart.x][down].blocked
    ) {
      validNeighborsStart.push(bidirectionalAStarGraph[currNodeStart.x][down]);
    }

    for (let i = 0; i < validNeighborsStart.length; i++) {
      var neighbor = validNeighborsStart[i];

      if (neighbor.setStart === "closed") continue;
      var cost;

      if (currNodeStart.weighted === true || neighbor.weighted === true)
        cost = currNodeStart.g + 10;
      else cost = currNodeStart.g + 1;

      if (neighbor.setStart === "open" && cost < neighbor.g) {
        neighbor.setStart = "neither";
        openStart.remove(neighbor);
      }
      if (neighbor.setStart === "neither") {
        openStart.push(neighbor);
        neighbor.setStart = "open";
        neighbor.g = cost;
        neighbor.h = calculateHeuristic(neighbor, finishNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.predecessor = currNodeStart;
      }
    }
    lastNodeStart = currNodeStart;

    // SEARCH FROM FINISH
    var validNeighborsFinish = [];
    left = currNodeFinish.x - 1;
    right = currNodeFinish.x + 1;
    up = currNodeFinish.y - 1;
    down = currNodeFinish.y + 1;

    // consider all of the current node's valid neighbors
    if (left >= 0 && !bidirectionalAStarGraph[left][currNodeFinish.y].blocked) {
      validNeighborsFinish.push(
        bidirectionalAStarGraph[left][currNodeFinish.y]
      );
    }
    if (
      right < grid_width &&
      !bidirectionalAStarGraph[right][currNodeFinish.y].blocked
    ) {
      validNeighborsFinish.push(
        bidirectionalAStarGraph[right][currNodeFinish.y]
      );
    }
    if (up >= 0 && !bidirectionalAStarGraph[currNodeFinish.x][up].blocked) {
      validNeighborsFinish.push(bidirectionalAStarGraph[currNodeFinish.x][up]);
    }
    if (
      down < grid_height &&
      !bidirectionalAStarGraph[currNodeFinish.x][down].blocked
    ) {
      validNeighborsFinish.push(
        bidirectionalAStarGraph[currNodeFinish.x][down]
      );
    }

    for (let i = 0; i < validNeighborsFinish.length; i++) {
      var neighbor = validNeighborsFinish[i];

      if (neighbor.setFinish === "closed") continue;
      var cost;
      if (currNodeFinish.weighted === true || neighbor.weighted === true)
        cost = currNodeFinish.g + 10;
      else cost = currNodeFinish.g + 1;

      if (neighbor.setFinish === "open" && cost < neighbor.g) {
        neighbor.setFinish = "neither";
        openFinish.remove(neighbor);
      }
      if (neighbor.setFinish === "closed" && cost < neighbor.g) {
        neighbor.setFinish = "neither";
      }
      if (neighbor.setFinish === "neither") {
        openFinish.push(neighbor);
        neighbor.setFinish = "open";
        neighbor.g = cost;
        neighbor.h = calculateHeuristic(neighbor, startNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.predecessor = currNodeFinish;
      }
    }
    lastNodeFinish = currNodeFinish;

    numSteps += 2;
    $("#steps-taken").html("Tiles Examined: " + numSteps);
  }

  if (
    currNodeFinish.setStart === "closed" ||
    currNodeStart.setFinish === "closed"
  ) {
    var path = [];
    console.log(JSON.stringify(currNodeStart));
    console.log(JSON.stringify(currNodeFinish));
    console.log(currNodeStart.setFinish + ", " + currNodeFinish.setStart);
    var weight = 1;
    // while (currNodeStart.x !== startX || currNodeStart.y !== startY) {
    //   path.push(currNodeStart);
    //   if (currNodeStart.weighted === true) weight += 10;
    //   else weight++;
    //   currNodeStart = currNodeStart.predecessor;
    // }
    // console.log("past");
    // while (currNodeFinish.x !== finishX || currNodeFinish.y !== finishY) {
    //   path.unshift(currNodeFinish);
    //   if (currNodeFinish.weighted === true) weight += 10;
    //   else weight++;
    //   currNodeFinish = currNodeFinish.predecessor;
    // }

    $("#steps-taken").html(
      $("#steps-taken").html() + " | Path Weight: " + weight
    );

    await sleep(100);

    for (let i = path.length - 1; i >= 0; i--) {
      console.log(path[i].x);
      colorNode(path[i], "path");
      await sleep(50);
    }
  }
  searching = false;
  enableButtons();
}

function calculateHeuristic(node, finishNode) {
  return Math.abs(node.x - finishNode.x) + Math.abs(node.y - finishNode.y);
}

$("#run-bidirectionalAStar").on("click", () => {
  if (!searching) {
    console.log("Running Bidirectional A* Search Algorithm...");
    $("#info-section").removeClass("d-none");
    $("#info-section-placeholder").addClass("d-none");
    $("#currently-visualizing").html(
      "Bidirectional A* Search Algorithm (Guarantees Shortest Path)"
    );
    recolorGrid();
    bidirectionalAStar(graph, startCell, finishCell);
    disableButtons();
  }
});

function checkIfNeighbors(node1, node2, graph) {
  var neighbors = [];
  if (node1.x + 1 < grid_width) neighbors.push(graph[node1.x + 1][node1.y]);
  if (node1.x - 1 >= 0) neighbors.push(graph[node1.x - 1][node1.y]);
  if (node1.y - 1 >= 0) neighbors.push(graph[node1.x][node1.y - 1]);
  if (node1.y + 1 < grid_height) neighbors.push(graph[node1.x][node1.y + 1]);

  for (let i = 0; i < neighbors.length; i++) {
    if (equalNodes(neighbors[i], node2)) return true;
  }

  return false;
}
