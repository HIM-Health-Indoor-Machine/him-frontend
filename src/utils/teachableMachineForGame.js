const URL = '/model/';
let model, webcam, labelContainer, maxPredictions, counter = 0, lastLabel = "";
let animationFrameId;

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
        
        const counterElement = document.getElementById("counter");
        if (counterElement) {
            counterElement.innerText = counter;
        } else {
            console.warn("'#counter' 요소가 DOM에 존재하지 않습니다.");
        }
    }

    lastLabel = currentLabel;
}

function stop() {
    if (webcam && webcam.stream && webcam.stream.getTracks) {
        webcam.stream.getTracks().forEach(track => track.stop());
        console.log("웹캠 스트림 중지");
    } else {
        console.warn("웹캠이 초기화되지 않았거나 이미 중지되었습니다.");
    }

    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        console.log("애니메이션 루프 중지");
    }

    if (model) {
        model = null;
        console.log("모델 해제 완료");
    }

    if (labelContainer) {
        labelContainer.innerHTML = "";
        console.log("라벨 컨테이너 초기화");
    }

    counter = 0;
    lastLabel = "";
    console.log("Teachable Machine 세션이 종료되었습니다.");
}


export { getCounter, init, stop };
