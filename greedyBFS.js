async function greedyBFS(graph, startNode, finishNode) {
  recolorGrid();
  searching = true;

  const infinity = Number.MAX_VALUE;
  var open = [];
  var greedyBFSGraph = shallowCopyGraph(graph, []);

  var numSteps = 0;
  $("#steps-taken").html("Steps Taken: " + numSteps);

  const startX = startNode.x;
  const startY = startNode.y;

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < greedyBFSGraph.length; i++) {
    for (let j = 0; j < greedyBFSGraph[i].length; j++) {
      greedyBFSGraph[i][j].f = infinity;
      greedyBFSGraph[i][j].g = infinity;
      greedyBFSGraph[i][j].h = infinity;
      greedyBFSGraph[i][j].set = "neither";
    }
  }

  // initialize start node's distance to be 0
  greedyBFSGraph[startX][startY].f = 0;
  greedyBFSGraph[startX][startY].g = 0;
  greedyBFSGraph[startX][startY].h = 0;
  greedyBFSGraph[startX][startY].set = "open";

  open.push(greedyBFSGraph[startX][startY]);
  var lastNode;
  while (open.length > 0) {
    open.sort((a, b) => {
      return a.f - b.f;
    });

    var currNode = open.shift();

    currNode.set = "closed";

    $(".currentNodeGray").removeClass("currentNodeGray");
    $(".currentNodeSunset").removeClass("currentNodeSunset");
    $(".currentNodeOcean").removeClass("currentNodeOcean");
    $(".currentNodeChaos").removeClass("currentNodeChaos");
    $(".currentNodeGreen").removeClass("currentNodeGreen");

    colorNode(currNode, "currentNode");
    if (lastNode !== undefined) colorNode(lastNode, "visited");

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
    if (left >= 0 && !greedyBFSGraph[left][currNode.y].blocked) {
      validNeighbors.push(greedyBFSGraph[left][currNode.y]);
    }
    if (right < grid_width && !greedyBFSGraph[right][currNode.y].blocked) {
      validNeighbors.push(greedyBFSGraph[right][currNode.y]);
    }
    if (up >= 0 && !greedyBFSGraph[currNode.x][up].blocked) {
      validNeighbors.push(greedyBFSGraph[currNode.x][up]);
    }
    if (down < grid_height && !greedyBFSGraph[currNode.x][down].blocked) {
      validNeighbors.push(greedyBFSGraph[currNode.x][down]);
    }

    for (let i = 0; i < validNeighbors.length; i++) {
      var neighbor = validNeighbors[i];
      if (neighbor.set === "neither") {
        open.push(neighbor);
        neighbor.set = "open";
        neighbor.h = calculateHeuristic(neighbor, finishNode);
        neighbor.f = neighbor.h;
        neighbor.predecessor = currNode;
      }
    }
    lastNode = currNode;
    numSteps++;
    $("#steps-taken").html("Steps Taken: " + numSteps);
  }

  if (equalNodes(currNode, finishNode)) {
    currNode = currNode.predecessor;

    var path = [];
    while (currNode.x !== startX || currNode.y !== startY) {
      path.push(currNode);
      currNode = currNode.predecessor;
    }

    $("#steps-taken").html(
      $("#steps-taken").html() + " | Path Length: " + path.length
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

$("#run-greedyBFS").on("click", () => {
  if (!searching) {
    console.log("Running Greedy BFS Search Algorithm...");
    $("#info-section").removeClass("d-none");
    $("#info-section-placeholder").addClass("d-none");

    $("#currently-visualizing").html(
      "Currently Visualizing: Greedy Best-First-Search"
    );
    recolorGrid();
    greedyBFS(graph, startCell, finishCell);
    disableButtons();
  }
});
