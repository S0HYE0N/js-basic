const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const savedTodoList = JSON.parse(localStorage.getItem('save-items'));
const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));

const createTodo = function (storageData) {
    let todoContents = todoInput.value;
    if(storageData) {
        todoContents = storageData.contents;
    }

    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');

    newBtn.addEventListener('click', () => {
        newLi.classList.toggle('complete');
        saveItemsFn();
    });

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        saveItemsFn();
    });


    if(storageData?.complete) {
        newLi.classList.add('complete');
    }

    newSpan.textContent = todoContents;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan);
    todoList.appendChild(newLi);

    todoInput.value = "";

    saveItemsFn();
}

const keyCodeCheck = function () {
    if(window.event.keyCode === 13 && todoInput.value.trim() !== '') {
        createTodo();
    }
}

const deleteAll = function () {
    const liList = document.querySelectorAll('li');
    for(let i = 0; i < liList.length; i++) {
        liList[i].remove();
    }

    saveItemsFn();
}

const saveItemsFn = function () {
    let saveItems = [];

    for(let i = 0; i < todoList.children.length; i++) {
        const todoObj = {
            contents: todoList.children[i].querySelector('span').textContent,
            complete: todoList.children[i].classList.contains('complete')
        }
        saveItems.push(todoObj);
    }

    (saveItems.length === 0)
        ? localStorage.removeItem('save-items')
        : localStorage.setItem('save-items', JSON.stringify(saveItems))
}

if(savedTodoList) {
    for(let i = 0; i < savedTodoList.length; i++) {
        createTodo(savedTodoList[i]);
    }
}

const weatherDataActive = function ({ location, weather }) {
    const weatherMainList = [
        'Clear',
        'Clouds',
        'Drizzle',
        'Rain',
        'Snow',
        'Thunderstorm'
    ];
    weather = weatherMainList.includes(weather) ? weather : 'Fog';
    const locationNameTag = document.querySelector('#location-name-tag');

    locationNameTag.textContent = location;
    document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

    // 최초 로드라서 saved-weather가 로컬스토리지에 없거나, 저장된 location이나 weather이 다르면 로컬스토리지에 새로운 데이터 저장
    if(
        !savedWeatherData || 
        savedWeatherData.location !== location || 
        savedWeatherData.weather !== weather
    ) {
        localStorage.setItem('saved-weather', JSON.stringify({ location, weather }));
    }
}

const weatherSearch = function ({ latitude, longitude }) {
    const openWeatherRes = fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=58d38462985a687dfa88bc42137c8fd2`
    ).then((res) => {
        return res.json();
    }).then((json) => {
        const weatherData = {
            location: json.name,
            weather: json.weather[0].main
        }
        weatherDataActive(weatherData);
    }).catch((err) => {
        // 요청이 제대로 이뤄지지 않았을 경우 이유를 출력
        console.error(err)
    });
}

const accessToGeo = function ({ coords }) {
    const { latitude, longitude } = coords;

    // shorthand properties : 객체의 key와 value 명이 같을 경우 축약해서 사용 가능
    const positionObj = {
        latitude,
        longitude
    };

    weatherSearch(positionObj);
}

const askForLocation = function () {
    navigator.geolocation.getCurrentPosition(accessToGeo, (error) => {
        console.log(error)
    })
};

askForLocation();

if(savedWeatherData) {
    weatherDataActive(savedWeatherData);
}