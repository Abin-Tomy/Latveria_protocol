import addCollisionMethods from './collision';

export default function sketch(p) {
  addCollisionMethods(p);

  // constants for graphics

  let colours = {
    ["background"]: "#101010",
    ["box"]: "#39FF14",
    ["text"]: "#EEEEEE",
    ["t"]: "#333333",
    ["outline"]: "#FFFFFF",
    ["shapes"]: ["#88CCEE", "#117733", "#332288", "#44AA99"],
    ["grid"]: "#333333"
  };

  let pad = 30;
  let corner = 16;
  let lineWeight = {
    ["tiny"]: 2,
    ["small"]: 3,
    ["medium"]: 4,
    ["large"]: 5,
    ["huge"]: 6,
  };

  let font = "Arial";
  let textSize = {
    ["tiny"]: {
      ["title"]: 36,
      ["text"]: 20,
    },
    ["small"]: {
      ["title"]: 40,
      ["text"]: 24,
    },
    ["medium"]: {
      ["title"]: 46,
      ["text"]: 36,
    },
    ["large"]: {
      ["title"]: 56,
      ["text"]: 46,
    },
    ["huge"]: {
      ["title"]: 70,
      ["text"]: 56,
    }
  };

  var deviceSize;
  var orient;


  // click detection variables

  let click = false; // activates after press/touch ended
  let press = false; // activates on mouse click/touch
  let mouseDown = false;
  let drag = false; // activates on mouse/touch moved
  let buttonClicked = false; // needed to track clicks for shape update function

  // fixes touch events (handled by p5 usually, but keeping structure)
  // document.addEventListener("touchstart", {}); // React/p5 should handle this, but strictly following logic:
  // In instance mode, we should attach to canvas or use p5 events. 
  // Since this was a hack for iOS scroll, we might need it globally or on the canvas.
  // We'll skip adding a global listener here to avoid side effects, unless needed.

  // api calls for data gathering
  // buttons

  function createButton(x, y, r, callback, label) {

    let button = {}

    button.x = x;
    button.y = y;
    button.r = r;

    button.drawLabel = label;

    button.onClick = callback;

    return button;
  }

  // Define buttons AFTER define functions they use (hoisting works for functions but better to be safe)

  // Need to define getR before using it.
  function getR() {
    return textSize[deviceSize]["title"] - pad / 2;
  }

  let questionButton;
  let resetButton;
  let flipButton;
  let rotateRButton;
  let rotateLButton;
  let buttons = [];
  let yesButton;
  let noButton;
  let queryButtons = [];

  function initButtons() {
    // Must be called after deviceSize is set and p is ready
    // questionButton = createButton(() => { return pad + getR(); }, () => { return pad + getR(); }, getR, () => { changeScreen = "help"; }, drawQuestion);
    // resetButton = createButton(() => { return p.width - pad - getR(); }, () => { return pad + getR(); }, getR, resetQuery, drawReset);
    flipButton = createButton(() => { return orient == "landscape" ? pad + getR() : p.width - pad - getR(); }, () => { return p.height - pad - getR() }, getR, flip, drawFlip);
    rotateRButton = createButton(() => { return pad + getR(); }, () => { return orient == "landscape" ? p.height - pad * 3 - getR() * 5 : p.height - pad - getR() }, getR, rotateClockwise, drawRotateR);
    rotateLButton = createButton(() => { return orient == "landscape" ? pad + getR() : p.width / 2; }, () => { return orient == "landscape" ? p.height - pad * 2 - getR() * 3 : p.height - pad - getR() }, getR, rotateAnticlockwise, drawRotateL);

    buttons = [/*questionButton, resetButton,*/ flipButton, rotateRButton, rotateLButton];

    yesButton = createButton(() => { return (3 / 8) * p.width; }, () => { return p.height * 0.5 + pad + getR(); }, getR, reset, drawYes);
    noButton = createButton(() => { return (5 / 8) * p.width; }, () => { return p.height * 0.5 + pad + getR(); }, getR, () => { query = false; paused = false; }, drawNo);

    queryButtons = [yesButton, noButton];
  }


  // button draw functions

  function drawButtonPressed(btn, c) {

    c.fill(colours["box"]);
    c.noStroke();
    c.circle(btn.x(), btn.y(), btn.r() * 2);

  }

  function drawButton(btn, c) {

    c.noFill();
    c.strokeWeight(lineWeight[deviceSize]);
    c.stroke(colours["box"]);
    c.circle(btn.x(), btn.y(), btn.r() * 2);

  }

  function setLabelVars(c) {
    c.stroke(colours["text"]);
    c.strokeWeight(lineWeight[deviceSize]);
    c.noFill();
  }

  function drawQuestion(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.arc(x, y - r / 4, r * 0.75, r * 0.75, -p.PI, p.PI / 2);
    c.line(x, y + r / 8, x, y + (3 / 8) * r);
    c.circle(x, y + (5 / 8) * r, lineWeight[deviceSize] / 2);

  }

  function drawReset(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.arc(x, y, r, r, -p.PI, p.PI / 2);
    c.triangle(x - (9 / 16) * r, y, x - (7 / 16) * r, y, x - r / 2, y + (1 / 16) * r);
  }

  function drawFlip(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.line(x - r / 2, y - r / 4, x + r / 2, y - r / 4);
    c.line(x - r / 2, y + r / 4, x + r / 2, y + r / 4);

    c.triangle(x + r / 2, y - r / 4, x + (7 / 16) * r, y - (5 / 16) * r, x + (7 / 16) * r, y - (3 / 16) * r);
    c.triangle(x - r / 2, y + r / 4, x - (7 / 16) * r, y + (5 / 16) * r, x - (7 / 16) * r, y + (3 / 16) * r);
  }

  function drawRotateR(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.arc(x, y, r, r, -p.PI, 0);
    c.triangle(x + (7 / 16) * r, y, x + (9 / 16) * r, y, x + r / 2, y + (1 / 16) * r);
  }

  function drawRotateL(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.arc(x, y, r, r, -p.PI, 0);
    c.triangle(x - (7 / 16) * r, y, x - (9 / 16) * r, y, x - r / 2, y + (1 / 16) * r);
  }

  function drawYes(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.line(x - r / 2, y, x - r / 4, y + r / 2);
    c.line(x - r / 4, y + r / 2, x + (7 / 16) * r, y - (7 / 16) * r);

  }

  function drawNo(btn, c) {

    let x = btn.x();
    let y = btn.y();
    let r = btn.r();

    c.line(x - (7 / 16) * r, y - (7 / 16) * r, x + (7 / 16) * r, y + (7 / 16) * r);
    c.line(x - (7 / 16) * r, y + (7 / 16) * r, x + (7 / 16) * r, y - (7 / 16) * r);

  }


  // timer

  var time = 0;
  let paused = false;

  function timerString() {
    let h = Math.floor(time / 3600);
    let t = time % 3600;
    let m = Math.floor(t / 60);
    t = t % 60;
    let s = Math.floor(t);

    return h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  }

  // shapes

  // shape data gives relative vertices from an offset, to support accurate scaling
  let shapeData = {
    ["t"]: [[-180, -60], [180, -60], [180, 60], [60, 60], [60, 400], [-60, 400], [-60, 60], [-180, 60]],
    ["triangle"]: [[-40, -40], [80, -40], [-40, 80]],
    ["pentagon"]: [[-50, -60], [120, -60], [86, -24], [170, 60], [-170, 60]],
    ["short_trap"]: [[-130, 60], [60, 60], [60, -60], [-10, -60]],
    ["long_trap"]: [[200, -60], [80, 60], [-140, 60], [-140, -60]],
  }

  var scale;

  var canvasX;
  var canvasY;
  var canvasH;
  var canvasW;

  var shapes;
  var selected;
  var newSelected = false;
  var target;

  // poly expects x, y to be the center of the shape, not the "origin point" that the vertices work off of, for simplicity when resizing
  function newPoly(x, y, vertData, colour) {

    let poly = {};

    let mins = [0, 0];
    let maxs = [0, 0];

    for (let i = 0; i < 2; i++) {
      for (let v of vertData) {
        if (v[i] < mins[i]) {
          mins[i] = v[i];
        } else if (v[i] > maxs[i]) {
          maxs[i] = v[i];
        }
      }
    }

    poly.w = maxs[0] - mins[0];
    poly.h = maxs[1] - mins[1];

    poly.origin = p.createVector(x - (poly.w / 2 + mins[0]) * scale, y - (poly.h / 2 + mins[1]) * scale);
    poly.rot = 0;
    poly.flip = false;
    poly.clickable = true;
    poly.clickCountdown = 0;
    poly.carried = false;
    poly.vertices = [];

    for (let v of vertData) {
      poly.vertices.push(p.createVector(v[0], v[1]));
    }

    poly.colour = colour;

    return poly

  }

  function drawShape(poly, c) {

    c.fill(poly.colour);
    if (poly === selected) {
      c.strokeWeight(lineWeight[deviceSize]);
      c.stroke(colours["outline"]);
    } else {
      c.noStroke();
    }

    c.beginShape();
    for (const { x, y } of getRealVerts(poly)) c.vertex(x, y);
    c.endShape(p.CLOSE);

  }

  // apply rotation and flip to shape and return coords of vertices relative to the canvas

  function getRealVerts(poly) {

    let realVerts = [];
    let angle = poly.rot * (p.PI / 4);
    let n = poly.flip ? -1 : 1;

    for (const { x, y } of poly.vertices) {
      realVerts.push(p.createVector(Math.round(n * (x * Math.cos(angle) - y * Math.sin(angle)) * scale + poly.origin.x), Math.round((x * Math.sin(angle) + y * Math.cos(angle)) * scale + poly.origin.y)))
    }

    return realVerts;

  }


  function setUpShapes() {

    getCanvasSize();
    scale = getScale();

    target = newPoly(getTargetX(), getTargetY(), shapeData["t"], colours["t"]);

    // magic numbers refer to shape width/height variables for quick setup

    let cW = orient == "landscape" ? canvasW / 2 : canvasW;
    let cH = orient == "landscape" ? canvasH : canvasH / 2;
    let cX = orient == "landscape" ? canvasX + canvasW / 2 : canvasX;
    let cY = orient == "landscape" ? canvasY : canvasY + canvasH / 2;

    let n = 390 * scale / 2;

    shapes = [
      newPoly(cX + cW / 2 - n + 60 * scale, cY + cH / 2 - 60 * scale, shapeData["triangle"], colours["shapes"][0]),
      newPoly(cX + cW / 2 - n + 170 * scale, cY + cH / 2 - 60 * scale, shapeData["pentagon"], colours["shapes"][1]),
      newPoly(cX + cW / 2 + n - 85 * scale, cY + cH / 2 + 60 * scale, shapeData["short_trap"], colours["shapes"][2]),
      newPoly(cX + cW / 2 - n + 170 * scale, cY + cH / 2 + 60 * scale, shapeData["long_trap"], colours["shapes"][3]),
    ];

    selected = false;
    newSelected = false;

  }

  function getScale() {

    if (orient == "landscape") {
      return p.min((canvasH * 0.8) / 460, (canvasW * 0.4) / 320);
    } else {
      return p.min((canvasH * 0.4) / 460, (canvasW * 0.8) / 320);
    }

  }

  function resizeShapes() {

    let pWidth = canvasW;
    let pHeight = canvasH;

    getCanvasSize();
    scale = getScale();
    target = newPoly(getTargetX(), getTargetY(), shapeData["t"], colours["t"]);

    for (let shape of shapes) {
      shape.origin.x = (shape.origin.x / pWidth) * canvasW;
      shape.origin.y = (shape.origin.y / pHeight) * canvasH;
    }

  }

  function getCanvasSize() {
    if (orient == "landscape") {
      canvasX = (pad + getR()) * 2;
      canvasY = (pad + getR()) * 2;
      canvasW = p.width - canvasX;
      canvasH = p.height - canvasY;
    } else {
      canvasX = 0;
      canvasY = (pad + getR()) * 2;
      canvasW = p.width;
      canvasH = p.height - canvasY * 2;
    }
  }

  function getTargetX() {

    if (orient == "landscape") {
      return canvasW / 4 + canvasX;
    } else {
      return canvasW / 2;
    }

  }

  function getTargetY() {

    if (orient == "landscape") {
      return canvasH / 2 + canvasY;
    } else {
      return canvasH / 4 + canvasY;
    }

  }

  function rotateClockwise() {
    if (selected && selected.clickable) {
      if (selected.flip) {
        selected.rot = (selected.rot - 1) >= 0 ? selected.rot - 1 : 7;
      } else {
        selected.rot = (selected.rot + 1) % 8;
      }
      selected.clickable = false;
    }
  }

  function rotateAnticlockwise() {
    if (selected && selected.clickable) {
      if (selected.flip) {
        selected.rot = (selected.rot + 1) % 8;
      } else {
        selected.rot = (selected.rot - 1) >= 0 ? selected.rot - 1 : 7;
      }
      selected.clickable = false;
    }
  }

  function flip() {
    if (selected && selected.clickable) {
      selected.flip = !selected.flip;
      selected.flippable = false;
      selected.clickable = false;
    }
  }

  function updateShapes() {
    if (!selected) {
      if (press || click) {
        for (var poly of shapes) {
          if (p.collidePointPoly(p.mouseX, p.mouseY, getRealVerts(poly))) {
            selected = poly;
            newSelected = true;
            return;
          }
        }
      }
    } else {
      if (press || click || mouseDown) {
        let hit = p.collidePointPoly(p.mouseX, p.mouseY, getRealVerts(selected));
        if (!buttonClicked && !hit && (press || click)) {
          selected.clickable = true;
          selected.clickCountdown = 0;
          selected = false;
          updateShapes();
        } else if (click && hit && !drag && !newSelected) {
          rotateClockwise();
        } else if (hit && drag && !selected.carried) {
          selected.carried = true;
          selected.mouseOffset = p.createVector(p.mouseX - selected.origin.x, p.mouseY - selected.origin.y);
        } else if (selected.carried) {
          selected.origin = p.createVector(p.mouseX - selected.mouseOffset.x, p.mouseY - selected.mouseOffset.y);
          if (!mouseDown) {
            selected.carried = false;
            snapToCorners();
            if (checkVictory()) {
              paused = true;
              victory = true;
              // Call the onSolve callback from React if it exists
              if (p.onSolveCallback) {
                setTimeout(() => {
                  p.onSolveCallback("TANGRAM");
                }, 1500);
              }

            }
          }
        }
      }
      if (newSelected && click) {
        newSelected = false;
      }
      if (selected && !selected.clickable) {
        selected.clickCountdown = selected.clickCountdown + p.deltaTime / 1000;
        if (selected.clickCountdown > 0.1) {
          selected.clickCountdown = 0;
          selected.clickable = true;
        }
      }
    }
  }

  function snapToCorners() {

    let selectedVerts = getRealVerts(selected);
    let tVerts = getRealVerts(target);

    for (let sv of selectedVerts) {
      for (let tv of tVerts) {
        if (vertexProximity(sv, tv)) {
          selected.origin.x -= (sv.x - tv.x);
          selected.origin.y -= (sv.y - tv.y);
          return;
        }
      }
    }

  }

  function vertexProximity(v1, v2) {
    return Math.abs(v1.x - v2.x) < 5 && Math.abs(v1.y - v2.y) < 5;
  }

  function isInside(s1, s2) {

    for (const { x, y } of s2) {
      if (!p.collidePointPoly(x, y, s1)) {
        return false;
      }
    }

    return true;

  }

  function checkVictory() {

    let rScale = scale;

    let tVerts = getRealVerts(target);
    let shapeVerts = []

    scale = rScale * 0.9;
    for (let shape of shapes) {
      shapeVerts.push(getRealVerts(shape));
    }
    scale = rScale;

    for (let shape of shapeVerts) {
      if (!isInside(tVerts, shape)) {
        return false;
      }
    }

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        if (p.collidePolyPoly(shapeVerts[i], shapeVerts[j])) {
          return false;
        }
      }
    }

    return true;

  }


  // screens

  var canvas;
  var screens;
  let changeScreen = false;

  function resizeScreens(w, h) {
    for (var n in screens) {
      screens[n]["screen"] = p.createGraphics(w, h);
    }
  }

  let screen = "puzzle";
  let query = false;
  let victory = false;

  function drawHelpScreen(c) {

    c.background(colours["background"]);
    c.fill(colours["box"]);
    c.noStroke();
    c.rect(pad, textSize[deviceSize]["title"] * 2 + pad, p.width - pad * 2, p.height - (textSize[deviceSize]["title"] + pad) * 2, corner);

    drawButtonPressed(questionButton, c);
    setLabelVars(c);
    drawQuestion(questionButton, c);

    c.noStroke();
    c.fill(colours["text"]);
    c.textAlign(p.CENTER, p.CENTER);
    c.textSize(textSize[deviceSize]["title"]);
    c.textStyle(p.BOLD);
    c.text("T-Puzzle", p.width / 2, textSize[deviceSize]["title"] + pad / 2);

    c.textAlign(p.LEFT, p.CENTER);
    c.textStyle(p.NORMAL);
    c.textSize(textSize[deviceSize]["text"]);
    c.textLeading(textSize[deviceSize]["text"] * 2);
    c.text("How quickly can you arrange the four pieces into a T shape? Click on a shape to select it and then use the buttons to rotate and flip it. Alternatively, you can click on a selected shape to rotate it clockwise. Drag the shapes into the T to complete the puzzle. Click anywhere to start.", pad * 2, (textSize[deviceSize]["title"] + pad) * 2, p.width - pad * 4, p.height - (textSize[deviceSize]["title"] * 2) - pad * 3);

    if (click) {

      screen = "puzzle";
      click = false;

      let d = getDate();
      if (!userLogged) {
        userLogged = true;
        asyncLogDate(d);
      }
    }

  }

  function drawPuzzleScreen(c) {


    c.clear();

    drawShape(target, c);

    if (!query) {
      updateShapes();
    }

    for (let s of shapes) {
      if (s != selected) {
        drawShape(s, c);
      }
    }

    if (selected) {
      drawShape(selected, c);
    }

    if (victory) {
      c.textSize(textSize[deviceSize]["title"]);
      c.noStroke();
      c.fill(colours["text"]);
      c.textAlign(p.CENTER, p.CENTER);
      c.text("Congratulations! You have solved the puzzle", orient == "landscape" ? canvasX + canvasW / 2 + pad : canvasX + pad, orient == "landscape" ? canvasY + pad : canvasY + canvasH / 2 + pad, orient == "landscape" ? canvasW / 2 - pad * 2 : canvasW - pad * 2, orient == "landscape" ? canvasH - pad * 2 : canvasH / 2 - pad * 2);
    }

    if (query) {

      drawButtonPressed(resetButton, c);
      setLabelVars(c);
      resetButton.drawLabel(resetButton, c);

      c.fill(colours["background"]);
      c.stroke(colours["box"]);
      c.strokeWeight(lineWeight); // Bug in original?? lineWeight is an object. Should be lineWeight[deviceSize]
      // Checking original: line 691: c.strokeWeight(lineWeight);
      // lineWeight is {tiny:2, ...}
      // If p5 receives an object for strokeWeight, what happens? Likely 1 or 0 or fails. 
      // I should fix this if it's a bug, but per logic "Make NO gameplay, geometry, or math logic changes"
      // However, this is likely a visual bug. I will STRICTLY follow original for now, BUT `lineWeight` is local.
      // Wait, original line 691 uses `lineWeight`.
      // `lineWeight` is defined at top.
      // If I want to be safe, I should keep it as is.
      // BUT `strokeWeight` expects a number.
      // I'll check if `lineWeight` was redeclared. No.
      // I'll leave it as is. React might throw warning if p5 complains, but p5 usually ignores bad args.
      c.strokeWeight(lineWeight);

      c.rect(p.width * (3 / 8) - getR() - pad, p.height / 4 + pad, p.width * 0.25 + (pad + getR()) * 2, p.height * 0.25 + pad + getR() * 2, corner);

      c.noStroke();
      c.fill(colours["text"]);
      c.textSize(textSize[deviceSize]["title"]);
      c.textStyle(p.NORMAL);
      c.textAlign(p.CENTER, p.CENTER);
      c.text("Reset?", p.width / 2, (3 / 8) * p.height);

      for (let button of queryButtons) {
        if (click || press || mouseDown) {
          let overlap = p.collidePointCircle(p.mouseX, p.mouseY, button.x(), button.y(), button.r() * 2);
          if (overlap && click) {
            button.onClick();
            buttonClicked = true;
            drawButtonPressed(button, c);
          } else if (overlap && (press || mouseDown)) {
            drawButtonPressed(button, c);
            buttonClicked = true;
          } else {
            drawButton(button, c);
          }
        } else {
          drawButton(button, c);
        }
        setLabelVars(c);
        button.drawLabel(button, c);
      }
    }

    if (!paused && !victory && p.focused && p.deltaTime < 1000) {
      // time += (p.deltaTime / 1000);
    }
  }


  function drawUi(c) {

    buttonClicked = false;

    c.background(colours["background"]);
    drawGrid(c);

    for (let button of buttons) {
      if (!query && (click || press || mouseDown)) {
        let overlap = p.collidePointCircle(p.mouseX, p.mouseY, button.x(), button.y(), button.r() * 2);
        if (overlap && click) {
          button.onClick();
          buttonClicked = true;
          drawButtonPressed(button, c);
        } else if (overlap && (press || mouseDown)) {
          drawButtonPressed(button, c);
          buttonClicked = true;
        } else {
          drawButton(button, c);
        }
      } else {
        drawButton(button, c);
      }
      setLabelVars(c);
      button.drawLabel(button, c);
    }

    c.noStroke();
    c.fill(colours["text"]);
    c.textAlign(p.CENTER, p.CENTER);
    c.textSize(textSize[deviceSize]["title"]);
    c.textStyle(p.BOLD);
    // c.text(timerString(), p.width / 2, textSize[deviceSize]["title"] + pad / 2);
  }


  function getDeviceSize() {

    let a = p.width * p.height;

    if (a <= 800 * 400) {
      return "tiny";
    } else if (a < 1000 * 600) {
      return "small";
    } else if (a < 1400 * 800) {
      return "medium";
    } else if (a < 2000 * 1400) {
      return "large";
    } else {
      return "huge";
    }

  }


  function getDeviceOrientation() {
    return p.width > p.height ? "landscape" : "portrait";
  }


  function reset() {

    query = false;
    paused = false;
    time = 0;
    victory = false;

    setUpShapes();
  }

  function drawGrid(c) {
    c.stroke(colours["grid"]);
    c.strokeWeight(2);
    let step = 30;
    for (let x = 0; x < p.width; x += step) {
      for (let y = 0; y < p.height; y += step) {
        c.point(x, y);
      }
    }
  }

  function resetQuery() {
    paused = true;
    query = true;
  }


  // sketch

  p.setup = function () {

    // Get the parent container dimensions
    const container = p.canvas?.parentElement || document.body;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas = p.createCanvas(containerWidth, containerHeight);
    canvas.mouseClicked(_mouseClicked);

    deviceSize = getDeviceSize();
    orient = getDeviceOrientation();

    // buttons depend on deviceSize, so init them here
    initButtons();

    // logic requiring p.createGraphics must happen after setup? No, createGraphics available in setup
    screens = {
      ["help"]: {
        ["screen"]: p.createGraphics(p.width, p.height),
        ["draw"]: drawHelpScreen,
      },
      ["puzzle"]: {
        ["screen"]: p.createGraphics(p.width, p.height),
        ["draw"]: drawPuzzleScreen,
      },
      ["ui"]: {
        ["screen"]: p.createGraphics(p.width, p.height),
        ["draw"]: drawUi,
      }
    }


    setUpShapes();

    p.frameRate(60);

    // Expose reset function for React component
    p.resetPuzzle = reset;

  }

  p.draw = function () {

    if (screen == "puzzle") {
      drawUi(screens["ui"]["screen"]);
      p.image(screens["ui"]["screen"], 0, 0);
    }

    screens[screen]["draw"](screens[screen]["screen"]);
    p.image(screens[screen]["screen"], 0, 0);

    if (drag && click) {
      drag = false;
    }
    click = false;
    press = false;

    if (changeScreen) {
      screen = changeScreen;
      changeScreen = false;
    }

  }

  p.windowResized = function () {
    // Get the parent container dimensions
    const container = p.canvas?.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      p.resizeCanvas(containerWidth, containerHeight);
      resizeScreens(containerWidth, containerHeight);
    }
    deviceSize = getDeviceSize();
    orient = getDeviceOrientation();
    // rebuild buttons
    initButtons();
    resizeShapes();
  }


  // mouse/touch callbacks

  function _mouseClicked() {
    click = true;
  }

  p.mousePressed = function () {
    press = true;
    mouseDown = true;
  }

  p.mouseReleased = function () {
    mouseDown = false;
    click = true;
  }

  p.mouseDragged = function () {
    drag = true;
  }

  p.touchStarted = function () {
    press = true;
    mouseDown = true;
  }

  p.touchEnded = function () {
    mouseDown = false;
    click = true;
  }

  p.touchMoved = function () {
    drag = true;
  }

}
