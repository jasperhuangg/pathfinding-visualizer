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
  $(".currentNodeGray").removeClass("currentNodeGray");
  $(".currentNodeSunset").removeClass("currentNodeSunset");
  $(".currentNodeChaos").removeClass("currentNodeChaos");
  $(".currentNodeOcean").removeClass("currentNodeOcean");
  $(".path").removeClass("path");
}

// instead of coloring background,
// create a child with css class depending on type of node
function colorNode(node, type) {
  if (!equalNodes(node, startCell) && !equalNodes(node, finishCell)) {
    var index = node.y * grid_width + node.x;

    // $(".grid-square").eq(index).children().eq(0).remove();
    if (type === "currentNode") {
      if (currentTheme === "sunset")
        $(".grid-square").eq(index).addClass("currentNodeSunset");
      else if (currentTheme === "ocean")
        $(".grid-square").eq(index).addClass("currentNodeOcean");
      else if (currentTheme === "chaos")
        $(".grid-square").eq(index).addClass("currentNodeChaos");
      else if (currentTheme === "gray")
        $(".grid-square").eq(index).addClass("currentNodeGray");
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
      }
    } else if (type === "path") {
      $(".grid-square").eq(index).removeClass("visited");
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
  } else if (theme === "Chaos Theory") {
    currentTheme = "chaos";
  } else if (theme === "50 Shades") {
    currentTheme = "gray";
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
  }

  $("#speedToggle").html(speed);
});

// select a random theme on page load
$(document).ready(function () {
  var random = Math.floor(Math.random() * 4);

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
    currentTheme = "gray";
    $("#themesToggle").html("50 Shades");
  }
});

function disableButtons() {
  $("#themesToggle").attr("disabled", "");
  // $("#speedToggle").attr("disabled", "");
  $("#run-djikstras").attr("disabled", "");
  $("#run-astar").attr("disabled", "");
}

function enableButtons() {
  $("#themesToggle").removeAttr("disabled");
  // $("#speedToggle").removeAttr("disabled");
  $("#run-djikstras").removeAttr("disabled");
  $("#run-astar").removeAttr("disabled");
}
