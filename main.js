// NOTE: game must be hosted on HTTPS site to access DeviceOrientationEvent in iOS.

window.onload = function () {
  // windowListener();
  const button = document.getElementById("button");
  console.log(button);
  button.addEventListener("click", getPermission);
};

let logParagraph = document.getElementById("log");

function getPermission() {
  if ("DeviceMotionEvent" in window) {
    logParagraph.innerHTML = "click";

    if ("requestPermission" in DeviceMotionEvent) {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            // Add a listener to get smartphone orientation
            // in the alpha-beta-gamma axes (units in degrees)
            gyroListener();
          }
        })
        .catch((error) => {
          console.log(error);
          logParagraph.innerHTML = error;
        });
    } else {
      logParagraph.innerHTML =
        "requestPermission in DeviceMotionEvent does not exist..";
      gyroListener();
    }
  } else {
    logParagraph.innerHTML = "DeviceMotionEvent in window does not exist..";
  }
}

function gyroListener() {
  let px = 50; // Position x and y
  let py = 50;
  let vx = 0.0; // Velocity x and y
  let vy = 0.0;
  let updateRate = 1 / 60; // Sensor refresh rate

  window.addEventListener("deviceorientation", (event) => {
    // Expose each orientation angle in a more readable way
    rotation_degrees = event.alpha;
    frontToBack_degrees = event.beta;
    leftToRight_degrees = event.gamma;

    // Update velocity according to how tilted the phone is
    // Since phones are narrower than they are long, double the increase to the x velocity
    vx = vx + leftToRight_degrees * updateRate * 2;
    vy = vy + frontToBack_degrees * updateRate;

    // Update position and clip it to bounds
    px = px + vx * 0.5;
    if (px > 98 || px < 0) {
      px = Math.max(0, Math.min(98, px)); // Clip px between 0-98
      vx = 0;
    }

    py = py + vy * 0.5;
    if (py > 98 || py < 0) {
      py = Math.max(0, Math.min(98, py)); // Clip py between 0-98
      vy = 0;
    }

    dot = document.getElementsByClassName("indicatorDot")[0];
    dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");
  });
}
