const URL = '/model/';
let model, webcam, labelContainer, maxPredictions, counter = 0, lastLabel = "";
let animationFrameId = null;
let mode;

async function getCounter() {
    return counter;
}

async function init(typeParam, modeParam) {

    mode = modeParam;

    let modelURL = URL;
    let metadataURL = URL;

    if (typeParam === 'PUSHUP') {
        modelURL += "pushup/model.json";
        metadataURL += "pushup/metadata.json";
    } else if (typeParam === 'SQUAT') {
        modelURL += "squat/model.json";
        metadataURL += "squat/metadata.json";
    }

    try {
        model = await tmPose.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("모델 로드 성공:", model);
    } catch (error) {
        console.error("모델 로드 중 오류 발생:", error);
        return;
    }

    const flip = true;
    const webcamDimensions = modeParam === "GAME"
        ? { width: 400, height: 360 }
        : { width: 1000, height: 900 };

    webcam = new tmPose.Webcam(webcamDimensions.width, webcamDimensions.height, flip);

    try {
        await webcam.setup();
        await webcam.play();

        const webcamContainer = document.getElementById("webcam-container");
        if (webcamContainer) {
            webcamContainer.innerHTML = "";
            webcamContainer.appendChild(webcam.canvas);

            if (modeParam === "CHALLENGE") {
                webcam.canvas.style.width = '100vw';
                webcam.canvas.style.height = '100vh';
                webcam.canvas.style.objectFit = 'contain';
            }
        } else {
            console.error("'webcam-container' 요소가 존재하지 않습니다.");
            return;
        }
    } catch (error) {
        console.error("웹캠 설정 실패:", error);
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
    if (!model || animationFrameId === null) {
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
    if (!model) {
        console.warn("모델이 초기화되지 않았습니다. 예측이 중단됩니다.");
        return;
    }

    const { posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    if (prediction[0].probability > 0.99) {
        if (lastLabel === 'pushdown') {
            counter++;

            if (mode === "CHALLENGE") {
                const counterElement = document.getElementById("counter");
                if (counterElement) {
                    counterElement.innerText = counter;
                } else {
                    console.warn("'#counter' 요소가 DOM에 존재하지 않습니다.");
                }
            }
        }
        lastLabel = 'pushup';
    } else if (prediction[1].probability > 0.99) {
        lastLabel = 'pushdown';
    }
}

function stop() {
    if (webcam) {
        if (webcam.stream) {
            try {
                webcam.stream.getTracks().forEach((track) => track.stop());
                console.log("웹캠 스트림 트랙 중지 완료");
            } catch (error) {
                console.warn("스트림 트랙 중지 중 오류:", error);
            }
        } else {
            console.warn("webcam.stream이 null 상태입니다.");
        }

        try {
            webcam.stop();
            console.log("웹캠 중지 성공");
        } catch (error) {
            console.error("웹캠 중지 실패:", error);
        }
        webcam = null;
    }

    if (animationFrameId !== null) {
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
