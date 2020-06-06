let blank = new Image();
blank.src = "./assets/blank.png";

$(document).on("click", ".grid-square", function () {
  // recolor the board
  let isStartCell = $(this).hasClass("start");
  let isFinishCell = $(this).hasClass("finish");
  let isObstacle = $(this).hasClass("obstacle");
  let isWeight = $(this).hasClass("weight");

  if (!searching && !isStartCell && !isFinishCell && placing === "walls") {
    recolorGrid();
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (!isObstacle && !isWeight) {
      $(this).addClass("obstacle");
      // mark it as blocked
      graph[x][y].blocked = true;
    } else if (isObstacle) {
      $(this).removeClass("obstacle");
      // mark it as unblocked
      graph[x][y].blocked = false;
    }
  } else if (
    !searching &&
    !isStartCell &&
    !isFinishCell &&
    !isObstacle &&
    placing === "weights"
  ) {
    recolorGrid();
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (!isWeight) {
      $(this).addClass("weight");
      // mark it as blocked
      graph[x][y].weighted = true;
    } else {
      $(this).removeClass("weight");
      // mark it as unblocked
      graph[x][y].weighted = false;
    }
  }
});

$(document).on("dragstart", ".grid-square", function (e) {
  if (!searching) {
    recolorGrid();
    e.dataTransfer = e.originalEvent.dataTransfer;
    e.dataTransfer.setDragImage(blank, 0, 0);
    lastDragged = $(this);
  }
});

$(document).on("dragenter", ".grid-square", function (e) {
  if (
    !searching &&
    !e.currentTarget.classList.contains("start") &&
    !e.currentTarget.classList.contains("finish") &&
    placing === "walls" &&
    !e.currentTarget.classList.contains("weight")
  ) {
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
  } else if (
    !searching &&
    !e.currentTarget.classList.contains("start") &&
    !e.currentTarget.classList.contains("finish") &&
    placing === "weights" &&
    !e.currentTarget.classList.contains("obstacle")
  ) {
    e.preventDefault();
    var index = $(".grid-square").index($(this));
    var x = index % grid_width;
    var y = (index - x) / grid_width;

    if (e.currentTarget.classList.contains("weight")) {
      e.currentTarget.classList.remove("weight");
      graph[x][y].weighted = false;
    } else if (
      !e.currentTarget.classList.contains("start") &&
      !e.currentTarget.classList.contains("finish")
    ) {
      e.currentTarget.classList.add("weight");
      graph[x][y].weighted = true;
    }
  }
});

$(document).on("dragstart", ".start", function (e) {
  if (!searching) {
    recolorGrid();
    e.dataTransfer = e.originalEvent.dataTransfer;
    e.dataTransfer.setDragImage(blank, 0, 0);
  }
});
