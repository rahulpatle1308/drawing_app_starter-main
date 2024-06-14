var selectedTool = "brush";
var selectedColor = "black";
var selectedSize = 10;
var selectedFill = false;
var isDrawing = false;
var prevMouseX = 0;
var prevMouseY = 0;
var snapshot = null;

var tools = document.querySelectorAll(".tool");
var brushSize = document.querySelector("#brush-size");
var colors = document.querySelectorAll(".color");
var fillColor = document.querySelector("#fill-color");
var clearCanvas = document.querySelector("#clear");
var saveImage = document.querySelector("#save");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// Added Listener to All Tool Board Elements

colors.forEach((color) => {
  color.addEventListener("click", function () {
    selectedColor = color.id;

    colors.forEach((color) => {
      color.classList.remove("selected");
    });

    color.classList.add("selected");
  });
});

fillColor.addEventListener("change", function () {
  selectedFill = fillColor.checked ? true : false;
  console.log(selectedFill);
});

tools.forEach((tool) => {
  tool.addEventListener("click", function () {
    selectedTool = tool.id;

    tools.forEach((tool) => {
      tool.classList.remove("active");
    });

    tool.classList.add("active");
  });
});

brushSize.addEventListener("change", function () {
  selectedSize = brushSize.value;
  console.log(selectedSize);
});

function cleanCanvas() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

window.addEventListener("load", function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  cleanCanvas();
});

clearCanvas.addEventListener("click", () => {
  cleanCanvas();
});

saveImage.addEventListener("click", () => {
  var link = document.createElement("a");
  link.download = "ricr_canvas.png";
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = selectedSize;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool == "brush" || selectedTool == "eraser") {
    ctx.strokeStyle = selectedTool == "eraser" ? "#fff" : selectedColor;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool == "rectangle") {
    drawRectangle(e);
  } else if (selectedTool == "circle") {
    drawCircle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  }
});

canvas.addEventListener("mouseup", (e) => {
  isDrawing = false;
  ctx.closePath();
});

function drawRectangle(e) {
  var width = e.offsetX - prevMouseX;
  var height = e.offsetY - prevMouseY;

  if (selectedFill) {
    ctx.fillRect(prevMouseX, prevMouseY, width, height);
  } else {
    ctx.strokeRect(prevMouseX, prevMouseY, width, height);
  }
}

function drawCircle(e) {
  var radius = Math.sqrt(
    Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
  );

  ctx.beginPath();
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

  if (selectedFill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function drawTriangle(e) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}
