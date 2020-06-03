// onclick events for when obstacles are added to the graph to update the graph
// color square gray on click, remove it from the graph
$(document).on("click", ".grid-square", function () {
  // recolor the board
  if (needToRecolor) recolorGrid();
  let isStartCell = $(this).css("background-color") === startCellColor;
  let isFinishCell = $(this).css("background-color") === finishCellColor;
  let isObstacle = $(this).css("background-color") === obstacleColor;

  if (!isStartCell && !isFinishCell) {
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (!isObstacle) {
      $(this).css("background-color", obstacleColor);
      // mark it as blocked
      graph[x][y].blocked = true;
    } else {
      $(this).css("background-color", normalCellColor);
      // mark it as unblocked
      graph[x][y].blocked = false;
    }
  }
});

function clearBoard() {
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].length; j++) {
      if (
        i !== startCell.x &&
        j !== startCell.y &&
        i !== finishCell.x &&
        j !== finishCell.y
      ) {
        var index = j * grid_width + i;
        $(".grid-square").eq(index).css("background-color", normalCellColor);
      }
    }
  }
}
