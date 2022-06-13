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
    const { name = 'Unknown', region = 'Unknown', country = 'Unknown' } = location;
    msgLocation.innerHTML = name + ', ' + region + ', ' + country;
}

function loadCurrent( current ) {
    const { temperature = 0, feelslike = 0, weather_descriptions = [] } = current; 
    msgCurrent.innerHTML = 'Status: ' +
    weather_descriptions.join(', ') +
    '. Temperature: ' +
    temperature +
    '. Feels Like: ' +
    feelslike;
}

formButton.addEventListener('click', event => {
    event.preventDefault();

    msgError.innerHTML = '';
    msgInfo.innerHTML = '';

    msgLocation.innerHTML = '';
    msgCurrent.innerHTML = '';

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