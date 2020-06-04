// TODO: change this to use colorNode
$(document).on("click", ".grid-square", function () {
  // recolor the board

  let isStartCell = $(this).css("background-color") === startCellColor;
  let isFinishCell = $(this).css("background-color") === finishCellColor;
  let isObstacle = $(this).hasClass("obstacle");

  if (!searching && !isStartCell && !isFinishCell) {
    recolorGrid();
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (!isObstacle) {
      $(this).addClass("obstacle");
      // mark it as blocked
      graph[x][y].blocked = true;
    } else {
      $(this).removeClass("obstacle");
      // mark it as unblocked
      graph[x][y].blocked = false;
    }
  }
});

$(document).on("dragstart", ".grid-square", function (e) {
  if (!searching) {
    recolorGrid();
    let blank = new Image();
    blank.src = "./blank.png";
    e.dataTransfer = e.originalEvent.dataTransfer;
    e.dataTransfer.setDragImage(blank, 0, 0);
  }
});

// $(document).on("mousedown", ".grid-square", function (e) {
//   e.preventDefault();
// });

$(document).on("dragenter", ".grid-square", function (e) {
  if (!searching) {
    e.preventDefault();
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (e.currentTarget.classList.contains("obstacle")) {
      e.currentTarget.classList.remove("obstacle");
      graph[x][y].blocked = false;
    } else if (
      !e.currentTarget.classList.contains("start") &&
      !e.currentTarget.classList.contains("finish")
    ) {
      e.currentTarget.classList.add("obstacle");
      graph[x][y].blocked = true;
    }
  }
});
