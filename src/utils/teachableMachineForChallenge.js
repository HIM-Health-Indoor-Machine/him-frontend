const URL = '/model/';
let model, webcam, labelContainer, maxPredictions, counter = 0, lastLabel = "";
let animationFrameId = null;

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

    animationFrameId = window.requestAnimationFrame(loop);

    labelContainer = document.getElementById("label-container");
    if (labelContainer) {
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } else {
        console.error("'label-container' 요소가 존재하지 않습니다.");
    }
}

async function loop() {
    if (!model || !labelContainer || animationFrameId === null) {
        console.warn("모델이 해제되어 루프가 중단되었습니다.");
        return;
    }

    if (webcam) {
        webcam.update();
        await predict();
        animationFrameId = window.requestAnimationFrame(loop);
    }
}

async function predict() {
    if (!model || !labelContainer) {
        console.warn("모델이나 라벨 컨테이너가 존재하지 않습니다. 예측이 중단됩니다.");
        return;
    }

    const prediction = await model.predict(webcam.canvas);
    let currentLabel = "";

    if (!labelContainer || !labelContainer.childNodes) {
        console.error("'label-container' 요소나 자식 노드가 존재하지 않습니다.");
        return;
    }

    for (let i = 0; i < maxPredictions; i++) {
        if (!labelContainer.childNodes[i]) {
            console.warn(`'labelContainer.childNodes[${i}]'가 존재하지 않습니다.`);
            continue;
        }

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
    webcam.stop();
    console.log("웹캠 스트림 중지");

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
    console.log("카운터 초기화 완료");

    console.log("Teachable Machine 세션이 종료되었습니다.");
}

export { getCounter, init, stop };
