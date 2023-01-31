window.onload = function () {
  windowListener();
};

function windowListener() {
  if ("DeviceOrientationEvent" in window) {
    window.addEventListener("deviceorientation", function (event) {
      let beta = event.beta;
      let gamma = event.gamma;
      renderText(`Tilt output: ${beta}, ${gamma}`);
    });
  } else {
    renderText(`DeviceOrientationEvent is not supported`);
  }
}

function renderText(text) {
  let output = document.getElementById("output");
  output.innerHTML = text;
}
