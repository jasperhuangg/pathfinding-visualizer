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
  $(".visited").removeClass("visited");
  $(".path").removeClass("path");
}

// instead of coloring background,
// create a child with css class depending on type of node
function colorNode(node, type) {
  if (!equalNodes(node, startCell) && !equalNodes(node, finishCell)) {
    var index = node.y * grid_width + node.x;

    // $(".grid-square").eq(index).children().eq(0).remove();
    if (type === "currentNode")
      $(".grid-square").eq(index).addClass("currentNode");
    else if (type === "obstacle")
      $(".grid-square").eq(index).addClass("obstacle");
    else if (type === "visited") {
      $(".grid-square").eq(index).removeClass("currentNode");
      $(".grid-square").eq(index).addClass("visited");

      // // wait for a bit, then remove all the elements underneath
      setTimeout(() => {
        $(".grid-square").eq(index).children(".neighbor").remove();
        $(".grid-square").eq(index).children(".currentNode").remove();
      }, 500);
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
