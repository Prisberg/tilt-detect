// NOTE: game must be hosted on HTTPS site to access DeviceMotion and requestPermission in iOS.

window.onload = function () {
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
            // Add a listener to get smartphone orientation in the beta-gamma axis
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
  let updateRate = 1 / 500; // Sensor refresh rate

  window.addEventListener("deviceorientation", (event) => {
    // gamma
    gamma = Math.round(event.gamma);
    console.log(event);

    // Update velocity according to how tilted the phone is
    // Since phones are narrower than they are long, double the increase to the x velocity
    velocityX = velocityX + gamma * updateRate * 3;
    logParagraph.innerHTML = `velocityX output: ${velocityX}`;

    // Update position and clip it to bounds
    if (gamma > 5 || gamma < -5) {
      // Update velocity if gamma is 10 degrees out of the 0 range
      posX = posX + velocityX * 0.3;
    } else {
      velocityX = 0;
    }
    if (posX > 100 || posX < 0) {
      posX = Math.max(0, Math.min(100, posX)); // Clip posX between 0-100
      velocityX = 0;
    }

    dot = document.getElementById("indicatorDot");
    dot.setAttribute("style", "left:" + posX + "%;");
  });
}
