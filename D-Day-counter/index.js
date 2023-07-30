const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
const savedDate = localStorage.getItem('saved-date');
const intervalIdArr = [];



const dateForMaker = function () {
    const inputYear = document.querySelector('#target-year-input').value;
    const inputMonth = document.querySelector('#target-month-input').value;
    const inputDay = document.querySelector('#target-day-input').value;

    const dateFormat = `${inputYear}-${inputMonth}-${inputDay}`;

    return dateFormat;
}

const counterMaker = function (data) {
    if(data !== savedDate) {
        localStorage.setItem('saved-date', data);
    }
    const nowDate = new Date();
    // setHours(0, 0, 0, 0) : 자정을 기준으로 시간 가져오기
    const targetDate = new Date(data).setHours(0, 0, 0, 0);
    const remaining = (targetDate - nowDate) / 1000;

    if( remaining <= 0 ) {
        container.style.display = 'none';
        messageContainer.innerHTML = '<h3>타이머가 종료되었습니다<h3>';
        messageContainer.style.display = 'flex';
        setClearInterval();
        return;
    } else if( isNaN( remaining ) ) {
        container.style.display = 'none';
        messageContainer.innerHTML = '<h3>잘못된 날짜입니다<h3>';
        messageContainer.style.display = 'flex';
        setClearInterval();
        return;
    }

    const remainingObj = {
        remainingDate: Math.floor( remaining / 3600 / 24 ),
        remainingHours: Math.floor( remaining / 3600 ) % 24,
        remainingMin: Math.floor( remaining / 60 ) % 60,
        remainingSec: Math.floor( remaining ) % 60
    };

    const documentArr = ['days', 'hours', 'min', 'sec'];
    const timeKeys = Object.keys(remainingObj);

    const format = function (time) {
        if(time < 10) {
            return '0' + time;
        } else {
            return time;
        }
    };

    let arrIndex = 0;
    for(let tag of documentArr) {
        const remainingTime = format(remainingObj[timeKeys[arrIndex]]);
        document.getElementById(tag).innerHTML = remainingTime;
        arrIndex++;
    }

}

const starter = function(targetDateInput) {
    if(!targetDateInput) {
        targetDateInput = dateForMaker();
    }
    
    container.style.display = 'flex';
    messageContainer.style.display = 'none';
    setClearInterval();
    counterMaker(targetDateInput);
    const intervalId = setInterval(() => {
        counterMaker(targetDateInput);
    }, 1000);
    intervalIdArr.push(intervalId);
}

const setClearInterval = function () {
    localStorage.removeItem('saved-date');
    for(let i = 0; i < intervalIdArr.length; i++) {
        clearInterval(intervalIdArr[i]);
    }
}

const resetTimer = function () {
    container.style.display = 'none';
    messageContainer.innerHTML = '<h3>D-Day를 입력해 주세요<h3>';
    messageContainer.style.display = 'flex';
    setClearInterval();
}

if(savedDate) {
    starter(savedDate);
} else {
    container.style.display = 'none';
    messageContainer.innerHTML = '<h3>D-Day를 입력해 주세요<h3>';
}