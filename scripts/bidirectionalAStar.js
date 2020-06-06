async function bidirectionalAStar(graph, startNode, finishNode) {
  recolorGrid();
  searching = true;

  const infinity = Number.MAX_VALUE;
  var openSource = [];
  var openDest = [];
  var closedSource = [];
  var closedDest = [];

  var numSteps = -3; // -2 for both start and finish nodes + -1 for overlapping connecting node

  $("#steps-taken").html("Cells Examined: " + numSteps);

  const startX = startNode.x;
  const startY = startNode.y;

  const finishX = finishNode.x;
  const finishY = finishNode.y;

  var bidirectionalAStarGraph = shallowCopyGraph(graph, []);

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < bidirectionalAStarGraph.length; i++) {
    for (let j = 0; j < bidirectionalAStarGraph[i].length; j++) {
      bidirectionalAStarGraph[i][j].fSrc = infinity;
      bidirectionalAStarGraph[i][j].gSrc = infinity;
      bidirectionalAStarGraph[i][j].hSrc = infinity;
      bidirectionalAStarGraph[i][j].fDest = infinity;
      bidirectionalAStarGraph[i][j].gDest = infinity;
      bidirectionalAStarGraph[i][j].hDest = infinity;
      bidirectionalAStarGraph[i][j].setSource = "neither";
      bidirectionalAStarGraph[i][j].setDest = "neither";
    }
  }

  // initialize start/finish node distance from start/finish to 0
  bidirectionalAStarGraph[startX][startY].fSrc = 0;
  bidirectionalAStarGraph[startX][startY].gSrc = 0;
  bidirectionalAStarGraph[startX][startY].hSrc = 0;
  bidirectionalAStarGraph[startX][startY].setSource = "open";
  openSource.push(bidirectionalAStarGraph[startX][startY]);

  bidirectionalAStarGraph[finishX][finishY].fDest = 0;
  bidirectionalAStarGraph[finishX][finishY].gDest = 0;
  bidirectionalAStarGraph[finishX][finishY].hDest = 0;
  bidirectionalAStarGraph[finishX][finishY].setDest = "open";
  openDest.push(bidirectionalAStarGraph[finishX][finishY]);

  var lastNodeSource;
  var lastNodeDest;

  while (openSource.length > 0 && openDest.length > 0) {
    openSource.sort((a, b) => {
      if (a.fSrc !== b.fSrc) return a.fSrc - b.fSrc;
      else return a.hSrc - b.hSrc;
    });
    openDest.sort((a, b) => {
      if (a.fDest !== b.fDest) return a.fDest - b.fDest;
      else return a.hDest - b.hDest;
    });

    var currNodeSource = openSource.shift();
    var currNodeDest = openDest.shift();

    currNodeSource.setSource = "closed";
    currNodeDest.setDest = "closed";

    $(".currentNodeGray").removeClass("currentNodeGray");
    $(".currentNodeSunset").removeClass("currentNodeSunset");
    $(".currentNodeOcean").removeClass("currentNodeOcean");
    $(".currentNodeChaos").removeClass("currentNodeChaos");
    $(".currentNodeGreen").removeClass("currentNodeGreen");
    $(".currentNodeCottonCandy").removeClass("currentNodeCottonCandy");

    if (checkIntersection(closedSource, closedDest)) {
      break; // the paths have reached each other
    }
    numSteps += 2;

    $("#steps-taken").html("Cells Examined: " + numSteps);

    closedSource.push(currNodeSource);
    closedDest.push(currNodeDest);

    colorNode(currNodeSource, "currentNode");
    colorNode(currNodeDest, "currentNode");
    if (lastNodeSource !== undefined && currentSpeed !== "instantaneous")
      colorNode(lastNodeSource, "visited");
    if (lastNodeDest !== undefined && currentSpeed !== "instantaneous")
      colorNode(lastNodeDest, "visited");

    if (currentSpeed === "fast") await sleep(20);
    else if (currentSpeed === "medium") await sleep(180);
    else if (currentSpeed === "slow") await sleep(500);

    var validNeighborsSource = [];
    var validNeighborsDest = [];
    var left = currNodeSource.x - 1;
    var right = currNodeSource.x + 1;
    var up = currNodeSource.y - 1;
    var down = currNodeSource.y + 1;

    // consider all of the current node's (from source) valid neighbors
    if (left >= 0 && !bidirectionalAStarGraph[left][currNodeSource.y].blocked) {
      validNeighborsSource.push(
        bidirectionalAStarGraph[left][currNodeSource.y]
      );
    }
    if (
      right < grid_width &&
      !bidirectionalAStarGraph[right][currNodeSource.y].blocked
    ) {
      validNeighborsSource.push(
        bidirectionalAStarGraph[right][currNodeSource.y]
      );
    }
    if (up >= 0 && !bidirectionalAStarGraph[currNodeSource.x][up].blocked) {
      validNeighborsSource.push(bidirectionalAStarGraph[currNodeSource.x][up]);
    }
    if (
      down < grid_height &&
      !bidirectionalAStarGraph[currNodeSource.x][down].blocked
    ) {
      validNeighborsSource.push(
        bidirectionalAStarGraph[currNodeSource.x][down]
      );
    }

    left = currNodeDest.x - 1;
    right = currNodeDest.x + 1;
    up = currNodeDest.y - 1;
    down = currNodeDest.y + 1;

    // consider all of the current node's (from dest) valid neighbors
    if (left >= 0 && !bidirectionalAStarGraph[left][currNodeDest.y].blocked) {
      validNeighborsDest.push(bidirectionalAStarGraph[left][currNodeDest.y]);
    }
    if (
      right < grid_width &&
      !bidirectionalAStarGraph[right][currNodeDest.y].blocked
    ) {
      validNeighborsDest.push(bidirectionalAStarGraph[right][currNodeDest.y]);
    }
    if (up >= 0 && !bidirectionalAStarGraph[currNodeDest.x][up].blocked) {
      validNeighborsDest.push(bidirectionalAStarGraph[currNodeDest.x][up]);
    }
    if (
      down < grid_height &&
      !bidirectionalAStarGraph[currNodeDest.x][down].blocked
    ) {
      validNeighborsDest.push(bidirectionalAStarGraph[currNodeDest.x][down]);
    }

    // UPDATE NEIGHBORS FROM SOURCE
    for (let i = 0; i < validNeighborsSource.length; i++) {
      let neighbor = validNeighborsSource[i];

      if (neighbor.setSource === "closed") continue;

      var cost;
      if (currNodeSource.weighted === true || neighbor.weighted === true)
        cost = currNodeSource.gSrc + 10;
      else cost = currNodeSource.gSrc + 1;

      if (neighbor.setSource === "open" && cost < neighbor.gSrc) {
        neighbor.setSource = "neither";
        openSource.remove(neighbor);
      }
      if (neighbor.setSource === "neither") {
        openSource.push(neighbor);
        neighbor.setSource = "open";
        neighbor.gSrc = cost;
        neighbor.hSrc = calculateHeuristic(neighbor, finishNode);
        neighbor.fSrc = neighbor.gSrc + neighbor.hSrc;
        neighbor.predecessorSource = currNodeSource;
      }
    }
    lastNodeSource = currNodeSource;

    // UPDATE NEIGHBORS FROM DEST
    for (let i = 0; i < validNeighborsDest.length; i++) {
      let neighbor = validNeighborsDest[i];

      if (neighbor.setDest === "closed") continue;

      var cost;
      if (currNodeDest.weighted === true || neighbor.weighted === true)
        cost = currNodeDest.gDest + 10;
      else cost = currNodeDest.gDest + 1;

      if (neighbor.setDest === "open" && cost < neighbor.gDest) {
        neighbor.setDest = "neither";
        openDest.remove(neighbor);
      }
      if (neighbor.setDest === "neither") {
        openDest.push(neighbor);
        neighbor.setDest = "open";
        neighbor.gDest = cost;
        neighbor.hDest = calculateHeuristic(neighbor, startNode);
        neighbor.fDest = neighbor.gDest + neighbor.hDest;
        neighbor.predecessorDest = currNodeDest;
      }
    }
    lastNodeDest = currNodeDest;
  }

  if (checkIntersection(closedSource, closedDest)) {
    var connectingNode = findIntersection(closedSource, closedDest);

    var path = [];

    var weight = 1;

    path.push(connectingNode);

    if (connectingNode.weighted) weight += 10;
    else weight++;

    var pathNode = connectingNode.predecessorSource;

    // console.log(
    //   "(" +
    //     connectingNode.predecessorSource.x +
    //     ", " +
    //     connectingNode.predecessorSource.y +
    //     ") (" +
    //     connectingNode.predecessorDest.x +
    //     ", " +
    //     connectingNode.predecessorDest.y +
    //     ")"
    // );

    while (!equalNodes(pathNode, startNode)) {
      path.unshift(pathNode);
      if (pathNode.weighted) weight += 10;
      else weight++;
      pathNode = pathNode.predecessorSource;
    }
    pathNode = connectingNode.predecessorDest;
    while (!equalNodes(pathNode, finishNode)) {
      path.push(pathNode);
      if (pathNode.weighted) weight += 10;
      else weight++;
      pathNode = pathNode.predecessorDest;
    }

    $("#steps-taken").html(
      $("#steps-taken").html() + " | Path Weight: " + weight
    );

    await sleep(100);

    for (let i = 0; i < path.length; i++) {
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

function checkIntersection(closed1, closed2) {
  var intersection = closed1.filter((x) => closed2.indexOf(x) !== -1);
  return intersection.length > 0;
}

function findIntersection(closed1, closed2) {
  var intersection = closed1.filter((x) => closed2.indexOf(x) !== -1);
  return intersection[0];
}
