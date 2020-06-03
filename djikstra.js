function djikstra(graph, startNode, finishNode) {
  const infinity = Number.MAX_VALUE;
  var unvisited = [];
  var djikstraGraph = shallowCopyGraph(graph, []);

  // initialize all nodes to dist infinity from the startNode
  for (let i = 0; i < djikstraGraph.length; i++) {
    for (let j = 0; j < djikstraGraph[i].length; j++) {
      djikstraGraph[i][j].distance = infinity;
      // console.log(djikstraGraph[i][j].distance);
      unvisited.push(djikstraGraph[i][j]);
      // console.log(unvisited[unvisited.length - 1]);
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

  while (
    // we haven't reached the finishNode or there is no possible path to the finishNode
    !equalNodes(currNode, finishNode)
  ) {
    var validNeighbors = [];
    const left = currNode.x - 1;
    const right = currNode.x + 1;
    const up = currNode.y - 1;
    const down = currNode.y + 1;

    // consider all of the current node's valid neighbors
    if (left >= 0 && !djikstraGraph[left][currNode.y].blocked) {
      validNeighbors.push(djikstraGraph[left][currNode.y]);
    }
    if (right < grid_width && !djikstraGraph[right][currNode.y].blocked) {
      validNeighbors.push(djikstraGraph[right][currNode.y]);
    }
    if (up >= 0 && !djikstraGraph[currNode.x][up].blocked) {
      validNeighbors.push(djikstraGraph[currNode.x][up]);
    }
    if (down < grid_height && !djikstraGraph[currNode.x][down].blocked) {
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
    if (currNode.distance === infinity) break;
  }

  currNode = currNode.predecessor;

  while (currNode.x !== startX || currNode.y !== startY) {
    console.log("ran");
    var index = currNode.y * grid_width + currNode.x;
    $(".grid-square").eq(index).css("background-color", "yellow");
    currNode = currNode.predecessor;
  }

  console.log(djikstraGraph[finishNode.x][finishNode.y]);
}

djikstra(graph, startCell, finishCell);
