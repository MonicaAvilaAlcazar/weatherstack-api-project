const formInput = document.getElementById('search-input');
const formButton = document.getElementById('search-button');
const msgError = document.getElementById('msg-error');
const msgInfo = document.getElementById('msg-info');
const msgLocation = document.getElementById('msg-location');
const msgCurrent = document.getElementById('msg-current');
const api = {
    url: 'http://api.weatherstack.com',
    endpoint: '/current',
    key: '5f8678eb20f4b93f535e668213188b25'
}

function loadLocation( location ) {
    const { name = 'Unknown', region = 'Unknown', country = 'Unknown', localtime = '' } = location;
    msgLocation.innerHTML = name + ', ' + region + ', ' + country + ', ' + localtime;
}

function loadCurrent( current ) {
    const { temperature = 0, feelslike = 0, humidity = 0, weather_icons = [], weather_descriptions = [] } = current;
    let myTable   = document.createElement("table");
    let myTableBody = document.createElement("tbody");
    let tRow = document.createElement('tr');

    if (weather_icons.length > 0) {
        for (let i = 0; i < weather_icons.length; i++) {
            let tData = document.createElement('td');
            let image = document.createElement('img');
            image.src = weather_icons[i];
            image.alt = 'weather icon ' + (i + 1);
            tData.appendChild(image);
            tRow.appendChild(tData);
        }
    }
    //const textString = 'Status: ' +
        //weather_descriptions.join(', ') +
        //'. Temperature: ' +
        //temperature +
        //'. Feels Like: ' +
        //feelslike +
        //'. Humidity: ' +
        //humidity;
    //const textContent = document.createTextNode(textString);
    //tRow.appendChild(document.createElement('td').appendChild(textContent));
    let weatherInfoRow = document.createElement('td');
    const arrayContent = [
        'Status: ' + weather_descriptions.join(', '),
        'Temperature: ' + temperature,
        'Feels Like: ' + feelslike,
        'Humidity: ' + humidity
    ];
    for (let i = 0; i < arrayContent.length; i++) {
        let textRow = document.createElement('tr');
        let textData = document.createElement('td');
        var textNode = document.createTextNode(arrayContent[i]);
        textData.appendChild(textNode);
        textRow.appendChild(textData);
        weatherInfoRow.appendChild(textRow);
    }

    tRow.appendChild(weatherInfoRow);
    myTableBody.appendChild(tRow);
    myTable.appendChild(myTableBody);
    msgCurrent.appendChild(myTable);
}

formButton.addEventListener('click', event => {
    event.preventDefault();

    msgError.innerHTML = '';
    msgInfo.innerHTML = '';

    msgLocation.innerHTML = '';
    while (msgCurrent.firstChild) {
        msgCurrent.removeChild(msgCurrent.firstChild);
    }

    const { value = ''} = formInput;
    if (value.length === 0) {
        msgError.innerHTML = 'Error: City value is empty';
    } else {
        msgInfo.innerHTML = 'Loading...';
        fetch(api.url + api.endpoint +
            '?access_key=' + api.key +
            '&query=' + value +
            '&units=m'
            ).then(response => {
                response.json()
                    .then(data => {
                        if (data.error) {
                            console.error(data.error.info, data.error);
                            msgInfo.innerHTML = '';
                            msgError.innerHTML = 'Error: ' + data.error.info;
                        } else {
                            console.debug(data);
                            msgInfo.innerHTML = '';
                            msgError.innerHTML = '';
                            loadLocation(data.location);
                            loadCurrent(data.current);
                        }
                    })
                    .catch(error => {
                        msgInfo.innerHTML = '';
                        msgError.innerHTML = 'Error: Sorry, the app is failing. Please try again.';
                        console.error(error)
                    })
            })
        }
    }
)