// NOTE: game must be hosted on HTTPS site to access DeviceOrientationEvent.

window.onload = function () {
  // windowListener();
  const button = document.getElementById("button");
  console.log(button);
  button.addEventListener("click", getAccel);
};

// function windowListener() {
//   if ("DeviceOrientationEvent" in window) {
//     DeviceOrientationEvent.requestPermission().then((response) => {
//       if (response === "granted") {
//         window.addEventListener("deviceOrientationEvent", function (event) {
//           let beta = event.beta;
//           let gamma = event.gamma;
//           renderText(`Tilt output: ${beta}, ${gamma}`);
//         });
//       }
//     });
//   } else {
//     renderText(`DeviceOrientationEvent is not supported`);
//   }
// }

// function renderText(text) {
//   let output = document.getElementById("output");
//   output.innerHTML = text;
// }

const logParagraph = document.getElementById("log");
let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 60; // Sensor refresh rate

function getAccel() {
  if ("DeviceMotionEvent" in window) {
    logParagraph.innerHTML("click");

    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          // Add a listener to get smartphone orientation
          // in the alpha-beta-gamma axes (units in degrees)
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
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    logParagraph.innerHTML("DeviceMotionEvent in window does not exist..");
  }
}
