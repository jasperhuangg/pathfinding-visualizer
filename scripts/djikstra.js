async function djikstra(graph, startNode, finishNode) {
  recolorGrid();
  searching = true;

  const infinity = Number.MAX_VALUE;
  var unvisited = [];
  var djikstraGraph = shallowCopyGraph(graph, []);

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < djikstraGraph.length; i++) {
    for (let j = 0; j < djikstraGraph[i].length; j++) {
      djikstraGraph[i][j].distance = infinity;
      djikstraGraph[i][j].visited = false;
      unvisited.push(djikstraGraph[i][j]);
    }
  }

  var numSteps = 0;
  $("#steps-taken").html("Tiles Examined: " + numSteps);

  const startX = startNode.x;
  const startY = startNode.y;

  // initialize start node's distance to be 0
  djikstraGraph[startX][startY].distance = 0;

  // moves start node to the front of the unvisited array
  unvisited.sort((a, b) => {
    return a.distance - b.distance;
  });

  var currNode = unvisited.unshift(); // currNode should be the startNode here
  currNode.visited = true;

  while (!equalNodes(currNode, finishNode)) {
    // highlight the currentNode a color
    var validNeighbors = [];
    const left = currNode.x - 1;
    const right = currNode.x + 1;
    const up = currNode.y - 1;
    const down = currNode.y + 1;

    // consider all of the current node's valid neighbors
    if (
      left >= 0 &&
      !djikstraGraph[left][currNode.y].blocked &&
      !djikstraGraph[left][currNode.y].visited
    ) {
      validNeighbors.push(djikstraGraph[left][currNode.y]);
    }
    if (
      right < grid_width &&
      !djikstraGraph[right][currNode.y].blocked &&
      !djikstraGraph[right][currNode.y].visited
    ) {
      validNeighbors.push(djikstraGraph[right][currNode.y]);
    }
    if (
      up >= 0 &&
      !djikstraGraph[currNode.x][up].blocked &&
      !djikstraGraph[currNode.x][up].visited
    ) {
      validNeighbors.push(djikstraGraph[currNode.x][up]);
    }
    if (
      down < grid_height &&
      !djikstraGraph[currNode.x][down].blocked &&
      !djikstraGraph[currNode.x][down].visited
    ) {
      validNeighbors.push(djikstraGraph[currNode.x][down]);
    }

    // update distance from start if shorter through currNode
    for (let i = 0; i < validNeighbors.length; i++) {
      if (currNode.weighted === true || validNeighbors[i].weighted === true) {
        if (validNeighbors[i].distance > currNode.distance + 10) {
          validNeighbors[i].distance = currNode.distance + 10;
          validNeighbors[i].predecessor = currNode;
        }
      } else {
        if (validNeighbors[i].distance > currNode.distance + 1) {
          validNeighbors[i].distance = currNode.distance + 1;
          validNeighbors[i].predecessor = currNode;
        }
      }
    }

    unvisited.sort((a, b) => {
      return a.distance - b.distance;
    });

    var lastNode = currNode;
    currNode = unvisited.shift();
    if (currNode.distance === infinity || unvisited.length === 0) {
      console.log("breaking");
      break; // there is no path to the finish node
    }

    $(".currentNodeGray").removeClass("currentNodeGray");
    $(".currentNodeSunset").removeClass("currentNodeSunset");
    $(".currentNodeOcean").removeClass("currentNodeOcean");
    $(".currentNodeChaos").removeClass("currentNodeChaos");
    $(".currentNodeGreen").removeClass("currentNodeGreen");
    $(".currentNodeCottonCandy").removeClass("currentNodeCottonCandy");

    colorNode(currNode, "currentNode");
    colorNode(lastNode, "visited");

    if (currentSpeed === "fast") await sleep(20);
    else if (currentSpeed === "medium") await sleep(180);
    else if (currentSpeed === "slow") await sleep(500);

    numSteps++;
    $("#steps-taken").html("Tiles Examined: " + numSteps);
  }

  if (currNode.distance !== infinity) {
    var weight = 1;
    currNode = currNode.predecessor;

    var path = [];
    while (currNode.x !== startX || currNode.y !== startY) {
      path.push(currNode);
      if (currNode.weighted === true) weight += 10;
      else weight += 1;
      currNode = currNode.predecessor;
    }

    $("#steps-taken").html(
      $("#steps-taken").html() + " | Path Weight: " + weight
    );

    await sleep(100);

    for (let i = path.length - 1; i >= 0; i--) {
      colorNode(path[i], "path");
      await sleep(50);
    }
  }

  searching = false;
  enableButtons();
}

$("#run-djikstras").on("click", () => {
  if (!searching) {
    console.log("Running Djikstra's Algorithm...");
    $("#info-section").removeClass("d-none");
    $("#info-section-placeholder").addClass("d-none");

    $("#currently-visualizing").html(
      "Dijkstra's Algorithm (Guarantees Shortest Path)"
    );
    recolorGrid();
    disableButtons();
    djikstra(graph, startCell, finishCell);
  }
});
