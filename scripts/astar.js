async function astar(graph, startNode, finishNode) {
  recolorGrid();
  searching = true;

  const infinity = Number.MAX_VALUE;
  var open = [];
  var astarGraph = shallowCopyGraph(graph, []);

  var numSteps = 0;
  $("#steps-taken").html("Tiles Examined: " + numSteps);

  const startX = startNode.x;
  const startY = startNode.y;

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < astarGraph.length; i++) {
    for (let j = 0; j < astarGraph[i].length; j++) {
      astarGraph[i][j].f = infinity;
      astarGraph[i][j].g = infinity;
      astarGraph[i][j].h = infinity;
      astarGraph[i][j].set = "neither";
    }
  }

  // initialize start node's distance to be 0
  astarGraph[startX][startY].f = 0;
  astarGraph[startX][startY].g = 0;
  astarGraph[startX][startY].h = 0;
  astarGraph[startX][startY].set = "open";

  open.push(astarGraph[startX][startY]);
  var lastNode;
  while (open.length > 0) {
    open.sort((a, b) => {
      if (a.f !== b.f) return a.f - b.f;
      else return a.h - b.h;
    });

    var currNode = open.shift();

    currNode.set = "closed";

    $(".currentNodeGray").removeClass("currentNodeGray");
    $(".currentNodeSunset").removeClass("currentNodeSunset");
    $(".currentNodeOcean").removeClass("currentNodeOcean");
    $(".currentNodeChaos").removeClass("currentNodeChaos");
    $(".currentNodeGreen").removeClass("currentNodeGreen");
    $(".currentNodeCottonCandy").removeClass("currentNodeCottonCandy");

    colorNode(currNode, "currentNode");
    if (lastNode !== undefined && currentSpeed !== "instantaneous")
      colorNode(lastNode, "visited");

    if (currentSpeed === "fast") await sleep(20);
    else if (currentSpeed === "medium") await sleep(180);
    else if (currentSpeed === "slow") await sleep(500);

    if (equalNodes(currNode, finishNode)) break;

    var validNeighbors = [];
    const left = currNode.x - 1;
    const right = currNode.x + 1;
    const up = currNode.y - 1;
    const down = currNode.y + 1;

    // consider all of the current node's valid neighbors
    if (left >= 0 && !astarGraph[left][currNode.y].blocked) {
      validNeighbors.push(astarGraph[left][currNode.y]);
    }
    if (right < grid_width && !astarGraph[right][currNode.y].blocked) {
      validNeighbors.push(astarGraph[right][currNode.y]);
    }
    if (up >= 0 && !astarGraph[currNode.x][up].blocked) {
      validNeighbors.push(astarGraph[currNode.x][up]);
    }
    if (down < grid_height && !astarGraph[currNode.x][down].blocked) {
      validNeighbors.push(astarGraph[currNode.x][down]);
    }

    for (let i = 0; i < validNeighbors.length; i++) {
      var neighbor = validNeighbors[i];

      if (neighbor.set === "closed") continue;
      var cost;
      if (currNode.weighted === true || neighbor.weighted === true)
        cost = currNode.g + 10;
      else cost = currNode.g + 1;

      if (neighbor.set === "open" && cost < neighbor.g) {
        neighbor.set = "neither";
        open.remove(neighbor);
      }
      // if (neighbor.set === "closed" && cost < neighbor.g) {
      //   neighbor.set = "neither";
      // }
      if (neighbor.set === "neither") {
        open.push(neighbor);
        neighbor.set = "open";
        neighbor.g = cost;
        neighbor.h = calculateHeuristic(neighbor, finishNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.predecessor = currNode;
      }
    }
    lastNode = currNode;
    numSteps++;
    $("#steps-taken").html("Tiles Examined: " + numSteps);
  }

  if (equalNodes(currNode, finishNode)) {
    currNode = currNode.predecessor;

    var path = [];

    var weight = 1;
    while (currNode.x !== startX || currNode.y !== startY) {
      path.push(currNode);
      if (currNode.weighted === true) weight += 10;
      else weight++;
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

function calculateHeuristic(node, finishNode) {
  return Math.abs(node.x - finishNode.x) + Math.abs(node.y - finishNode.y);
}

$("#run-astar").on("click", () => {
  if (!searching) {
    console.log("Running A* Search Algorithm...");
    $("#info-section").removeClass("d-none");
    $("#info-section-placeholder").addClass("d-none");
    $("#currently-visualizing").html(
      "A* Search Algorithm (Guarantees Shortest Path)"
    );
    recolorGrid();
    astar(graph, startCell, finishCell);
    disableButtons();
  }
});
