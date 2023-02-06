// NOTE: game must be hosted on HTTPS site to access DeviceMotion and requestPermission in iOS.

window.onload = function () {
  fpsMeter();
  const button = document.getElementById("button");
  button.addEventListener("click", getPermission);
};

let logParagraph = document.getElementById("log");

function getPermission() {
  if ("DeviceMotionEvent" in window) {
    logParagraph.innerHTML = "running getPermission";
    console.log("running getPermission");

    // requestPermission does not exist on android or pc browsers
    if ("requestPermission" in DeviceMotionEvent) {
      logParagraph.innerHTML = "getPermission exists";
      console.log("getPermission exists");
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            // Add a listener to get device orientation in the gamma axis
            gyroListener();
          }
        })
        .catch((error) => {
          console.log(error);
          logParagraph.innerHTML = error;
        });
    } else {
      console.log("requestPermission in DeviceMotionEvent does not exist..");
      logParagraph.innerHTML =
        "requestPermission in DeviceMotionEvent does not exist..";
      gyroListener();
    }
  } else {
    logParagraph.innerHTML = "DeviceMotionEvent in window does not exist..";
    console.log("DeviceMotionEvent in window does not exist..");
  }
}

function gyroListener() {
  let posX = 50; // Position x
  let velocityX = 0.0; // Velocity x
  let updateRate = 1 / 120; // Sensor refresh rate
  const dot = document.getElementById("indicatorDot");

  window.addEventListener("deviceorientation", (event) => {
    console.log(event);
    // gamma = Degrees per second around the y axis
    gamma = event.gamma;

    // Update position if gamma is 10 degrees out of the 0 range
    if (gamma > 5 || gamma < -5) {
      velocityX = velocityX + gamma * updateRate;
      logParagraph.innerHTML = `velocityX output: ${velocityX}`;

      // Update position and clip it to bounds
      posX = posX + velocityX * 0.5;
    } else {
      velocityX = 0;
    }
    if (posX > 100 || posX < 0) {
      // Clip posX between 0-100
      posX = Math.max(0, Math.min(100, posX));
      velocityX = 0;
    }

    dot.setAttribute("style", `left: ${posX}%;`);
  });
}

function fpsMeter() {
  let fpsParagraph = document.getElementById("fps");
  let prevTime = Date.now(),
    frames = 0;

  requestAnimationFrame(function loop() {
    const time = Date.now();
    frames++;
    if (time > prevTime + 1000) {
      let fps = Math.round((frames * 1000) / (time - prevTime));
      prevTime = time;
      frames = 0;

      fpsParagraph.innerHTML = `FPS: ${fps}`;
    }

    requestAnimationFrame(loop);
  });
}
