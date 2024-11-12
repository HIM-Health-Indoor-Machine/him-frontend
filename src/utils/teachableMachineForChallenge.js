const URL = '/model/';
let model, webcam, labelContainer, maxPredictions, counter = 0, lastLabel = "";

async function getCounter() {
    return counter;
}

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(window.innerWidth, window.innerHeight, flip);
    try {
        await webcam.setup();
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        webcam.canvas.style.width = '100%'
        webcam.canvas.style.height = '100%'
    } catch (error) {
        console.error("웹캠 설정 실패: ", error);
    }

    window.requestAnimationFrame(loop);

    labelContainer = document.getElementById("label-container");
    if (labelContainer) {
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    }
}

async function loop() {
    if (webcam) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let currentLabel = "";

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (labelContainer && labelContainer.childNodes[i]) {
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        if (prediction[i].probability.toFixed(2) > 0.7) {
            currentLabel = prediction[i].className;
        }
    }

    if (lastLabel === "pushdown" && currentLabel === "pushup") {
        counter++;

        const counterElement = document.getElementById("counter");
        if (counterElement) {
            counterElement.innerText = counter;
        }
    }

    lastLabel = currentLabel;
}

export { getCounter, init };
