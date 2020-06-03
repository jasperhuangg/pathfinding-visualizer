async function djikstra(graph, startNode, finishNode) {
  recolorGrid();
  needToRecolor = true;
  searching = true;

  const infinity = Number.MAX_VALUE;
  var unvisited = [];
  var visited = [];
  var djikstraGraph = shallowCopyGraph(graph, []);

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < djikstraGraph.length; i++) {
    for (let j = 0; j < djikstraGraph[i].length; j++) {
      djikstraGraph[i][j].distance = infinity;
      unvisited.push(djikstraGraph[i][j]);
    }
  }

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
  visited.push(currNode);

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
      djikstraGraph[left][currNode.y].visited === undefined
    ) {
      validNeighbors.push(djikstraGraph[left][currNode.y]);
    }
    if (
      right < grid_width &&
      !djikstraGraph[right][currNode.y].blocked &&
      djikstraGraph[right][currNode.y].visited === undefined
    ) {
      validNeighbors.push(djikstraGraph[right][currNode.y]);
    }
    if (
      up >= 0 &&
      !djikstraGraph[currNode.x][up].blocked &&
      djikstraGraph[currNode.x][up].visited === undefined
    ) {
      validNeighbors.push(djikstraGraph[currNode.x][up]);
    }
    if (
      down < grid_height &&
      !djikstraGraph[currNode.x][down].blocked &&
      djikstraGraph[currNode.x][down].visited === undefined
    ) {
      validNeighbors.push(djikstraGraph[currNode.x][down]);
    }

    // update distance from start if shorter through currNode
    for (let i = 0; i < validNeighbors.length; i++) {
      if (validNeighbors[i].distance > currNode.distance + 1) {
        validNeighbors[i].distance = currNode.distance + 1;
        validNeighbors[i].predecessor = currNode;
      }
    }

    unvisited.sort((a, b) => {
      return a.distance - b.distance;
    });

    currNode = unvisited.shift();
    visited.push(currNode);
    await sleep(1);
    colorNode(currNode, "rgb(252, 3, 215)");

    if (currNode.distance === infinity) break; // there is no path to the finish node
  }

  currNode = currNode.predecessor;

  while (currNode.x !== startX || currNode.y !== startY) {
    console.log("ran");
    colorNode(currNode, "rgb(252, 240, 3)");
    await sleep(10);
    currNode = currNode.predecessor;
  }

  console.log(djikstraGraph[finishNode.x][finishNode.y]);
  searching = false;
}

$("#run-djikstras").on("click", () => {
  if (!searching) {
    djikstra(graph, startCell, finishCell);
  }
});
