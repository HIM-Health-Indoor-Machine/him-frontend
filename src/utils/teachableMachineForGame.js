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
    webcam = new tmImage.Webcam(400, 300, flip);
    try {
        await webcam.setup();
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);
    } catch (error) {
        console.error("웹캠 설정 실패: ", error);
    }

    window.requestAnimationFrame(loop);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let currentLabel = "";

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        if (prediction[i].probability.toFixed(2) > 0.7) {
            currentLabel = prediction[i].className;
        }
    }

    if (lastLabel === "pushdown" && currentLabel === "pushup") {
        counter++;
        document.getElementById("counter").innerText = counter;
    }

    lastLabel = currentLabel;
}

export { getCounter, init };
