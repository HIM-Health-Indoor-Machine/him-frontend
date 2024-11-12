const URL = '/model/';
let model, webcam, labelContainer, maxPredictions, counter = 0, lastLabel = "";

async function getCounter() {
    return counter;
}

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 모델 로드
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    // 웹캠을 전체 화면으로 설정
    webcam = new tmImage.Webcam(window.innerWidth, window.innerHeight, flip);
    try {
        await webcam.setup(); // 웹캠 접근 허용 요청
        await webcam.play();
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        webcam.canvas.style.width = '100%'
        webcam.canvas.style.height = '100%'
    } catch (error) {
        console.error("웹캠 설정 실패: ", error);
    }

    window.requestAnimationFrame(loop); // 루프 시작


    // 예측 결과 표시할 공간
    labelContainer = document.getElementById("label-container");
    if (labelContainer) {
        labelContainer.innerHTML = ""; // label-container 비우기
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
    let currentLabel = ""; // 현재 상태

    // 푸쉬업과 푸쉬다운 상태를 감지
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (labelContainer && labelContainer.childNodes[i]) {
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        if (prediction[i].probability.toFixed(2) > 0.7) {
            currentLabel = prediction[i].className; // 확률이 70% 이상인 상태를 현재 상태로 설정
        }
    }

    // 상태 변화 감지 로직 (pushdown -> pushup)
    if (lastLabel === "pushdown" && currentLabel === "pushup") {
        counter++; // 카운트 증가

        const counterElement = document.getElementById("counter");
        if (counterElement) {
            counterElement.innerText = counter; // 화면에 카운트 업데이트
        }
    }

    lastLabel = currentLabel; // 마지막 상태 업데이트
}

export { getCounter, init };
