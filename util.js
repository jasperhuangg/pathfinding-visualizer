var currentTheme = "sunset";
var currentSpeed = "fast";

function shallowCopyGraph(src, dest) {
  dest = new Array(src.length);
  for (let i = 0; i < src.length; i++) {
    dest[i] = new Array(src[i].length);
    for (let j = 0; j < src[i].length; j++) {
      dest[i][j] = {
        x: src[i][j].x,
        y: src[i][j].y,
        blocked: src[i][j].blocked,
        weighted: src[i][j].weighted,
      };
    }
  }
  return dest;
}

function equalNodes(node1, node2) {
  return node1.x === node2.x && node1.y === node2.y;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function recolorGrid() {
  $(".visitedSunset").removeClass("visitedSunset");
  $(".visitedOcean").removeClass("visitedOcean");
  $(".visitedChaos").removeClass("visitedChaos");
  $(".visitedGray").removeClass("visitedGray");
  $(".visitedGreen").removeClass("visitedGreen");
  $(".visitedCottonCandy").removeClass("visitedCottonCandy");

  $(".currentNodeGray").removeClass("currentNodeGray");
  $(".currentNodeSunset").removeClass("currentNodeSunset");
  $(".currentNodeChaos").removeClass("currentNodeChaos");
  $(".currentNodeOcean").removeClass("currentNodeOcean");
  $(".currentNodeGreen").removeClass("currentNodeGreen");
  $(".currentNodeCottonCandy").removeClass("currentNodeCottonCandy");

  $(".path").removeClass("path");
}

// instead of coloring background,
// create a child with css class depending on type of node
function colorNode(node, type) {
  if (!equalNodes(node, startCell) && !equalNodes(node, finishCell)) {
    var index = node.y * grid_width + node.x;

    if (type === "currentNode") {
      if (currentTheme === "sunset")
        $(".grid-square").eq(index).addClass("currentNodeSunset");
      else if (currentTheme === "ocean")
        $(".grid-square").eq(index).addClass("currentNodeOcean");
      else if (currentTheme === "chaos")
        $(".grid-square").eq(index).addClass("currentNodeChaos");
      else if (currentTheme === "gray")
        $(".grid-square").eq(index).addClass("currentNodeGray");
      else if (currentTheme === "green")
        $(".grid-square").eq(index).addClass("currentNodeGreen");
      else if (currentTheme === "cotton candy")
        $(".grid-square").eq(index).addClass("currentNodeCottonCandy");
    } else if (type === "obstacle") {
      $(".grid-square").eq(index).addClass("obstacle");
    } else if (type === "visited") {
      if (currentTheme === "sunset") {
        $(".grid-square").eq(index).removeClass("currentNodeSunset");
        $(".grid-square").eq(index).addClass("visitedSunset");
      } else if (currentTheme === "ocean") {
        $(".grid-square").eq(index).removeClass("currentNodeOcean");
        $(".grid-square").eq(index).addClass("visitedOcean");
      } else if (currentTheme === "chaos") {
        $(".grid-square").eq(index).removeClass("currentNodeChaos");
        $(".grid-square").eq(index).addClass("visitedChaos");
      } else if (currentTheme === "gray") {
        $(".grid-square").eq(index).removeClass("currentNodeGray");
        $(".grid-square").eq(index).addClass("visitedGray");
      } else if (currentTheme === "green") {
        $(".grid-square").eq(index).removeClass("currentNodeGreen");
        $(".grid-square").eq(index).addClass("visitedGreen");
      } else if (currentTheme === "cotton candy") {
        $(".grid-square").eq(index).removeClass("currentNodeCottonCandy");
        $(".grid-square").eq(index).addClass("visitedCottonCandy");
      }
    } else if (type === "path") {
      $(".grid-square").eq(index).removeClass("visitedOcean");
      $(".grid-square").eq(index).removeClass("visitedGreen");
      $(".grid-square").eq(index).removeClass("visitedSunset");
      $(".grid-square").eq(index).removeClass("visitedCottonCandy");
      $(".grid-square").eq(index).removeClass("visitedGray");
      $(".grid-square").eq(index).removeClass("visitedChaos");

      $(".grid-square").eq(index).addClass("path");
    }
  }
}

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

$(".theme").on("click", function () {
  var theme = $(this).html();

  if (theme === "Sunset Blvd.") {
    currentTheme = "sunset";
  } else if (theme === "Ocean's 11") {
    currentTheme = "ocean";
  } else if (theme === "Rachel Green") {
    currentTheme = "green";
  } else if (theme === "Chaos Theory") {
    currentTheme = "chaos";
  } else if (theme === "50 Shades") {
    currentTheme = "gray";
  } else if (theme === "Fairy Floss") {
    currentTheme = "cotton candy";
  }

  $("#themesToggle").html(theme);
});

$(".speed").on("click", function () {
  var speed = $(this).html();

  if (speed === "Fast") {
    currentSpeed = "fast";
  } else if (speed === "Medium") {
    currentSpeed = "medium";
  } else if (speed === "Slow") {
    currentSpeed = "slow";
  } else if (speed === "Instantaneous") {
    currentSpeed = "instant";
  }
  $("#speedToggle").html(speed);
});

$(".placeable").on("click", function () {
  var item = $(this).html();

  if (item === "Walls") {
    placing = "walls";
  } else if (item === "Weights") {
    placing = "weights";
  }

  $("#placingToggle").html("Place " + item);
});

// select a random theme on page load
$(document).ready(function () {
  var random = Math.floor(Math.random() * 6);

  if (random === 0) {
    currentTheme = "sunset";
    $("#themesToggle").html("Sunset Blvd.");
  } else if (random === 1) {
    currentTheme = "ocean";
    $("#themesToggle").html("Ocean's 11");
  } else if (random === 2) {
    currentTheme = "chaos";
    $("#themesToggle").html("Chaos Theory");
  } else if (random === 3) {
    currentTheme = "green";
    $("#themesToggle").html("Rachel Green");
  } else if (random === 4) {
    currentTheme = "gray";
    $("#themesToggle").html("50 Shades");
  } else if (random === 5) {
    currentTheme = "cotton candy";
    $("#themesToggle").html("Fairy Floss");
  }
});

function disableButtons() {
  $("#themesToggle").attr("disabled", "");
  $("#placingToggle").attr("disabled", "");
  $("#run-greedyBFS").attr("disabled", "");
  $("#run-djikstras").attr("disabled", "");
  $("#clear-grid").attr("disabled", "");
  $("#run-astar").attr("disabled", "");
}

function enableButtons() {
  $("#themesToggle").removeAttr("disabled");
  $("#placingToggle").removeAttr("disabled");
  $("#run-greedyBFS").removeAttr("disabled");
  $("#run-djikstras").removeAttr("disabled");
  $("#clear-grid").removeAttr("disabled");
  $("#run-astar").removeAttr("disabled");
}

$("#clear-grid").on("click", function () {
  clearGrid();
});
