class locationDetermination {

    location() {
        navigator.geolocation.getCurrentPosition((position) => {
            const geo__data = { 'lat': position.coords.latitude, 'lon': position.coords.longitude }

            const widgetWeather = new weatherToday(geo__data)
            const widgetForecast = new weatherForecast(geo__data)

            widgetWeather.dataRequest()
            widgetForecast.dataRequest()
        })
    }
}

const geodata = new locationDetermination
geodata.location()

class weatherToday {
    constructor(geo__data) {
        this.geo__data = geo__data
    }

    dataRequest() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.geo__data.lat}&lon=${this.geo__data.lon}&appid=9e85d06dde03d4255aca963f93c72a16&lang=ru&units=metric`)
            .then((resp) => { return resp.json() })
            .then((data) => {
                console.log('data:', data)

                const block__weather = document.querySelector('.block__weather')
                block__weather.innerHTML = `<div class="weather__city">${data.name}</div>
                <div class="block__row weather__basic">
                    <div class="weather__icon"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></div>
                    <div class="weather__temp">${data.main.temp.toFixed()}°C</div>
                </div>
                <div class="weather__conditions">${data.weather[0].description}</div>
                <div class="weather__date">${new Date().getDate()}.${(1 + new Date().getMonth())}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}</div>
                <table>
                    <tr>
                        <td>Ветер</td>
                        <td class="wind">${data.wind.speed} м/с</td>
                    </tr>
                    <tr>
                        <td>Облачность</td>
                        <td class="cloudiness">${data.clouds.all} %</td>
                    </tr>
                    <tr>
                        <td>Давление</td>
                        <td class="pressure">${((data.main.pressure / 133 * 100).toFixed())} мм рт ст</td>
                    </tr>
                    <tr>
                        <td>Влажность</td>
                        <td class="humidity">${data.main.humidity} %</td>
                    </tr>
                    <tr>
                        <td>Рассвет</td>
                        <td class="sunrise">${new Date(+data.sys.sunrise * 1000).getHours()}:${new Date(+data.sys.sunrise * 1000).getMinutes()}</td>
                    </tr>
                    <tr>
                        <td>Закат</td>
                        <td class="sunset">${new Date(+data.sys.sunset * 1000).getHours()}:${new Date(+data.sys.sunset * 1000).getMinutes()}</td>
                    </tr>
                    <tr>
                        <td>Координаты</td>
                        <td class="coords">${data.coord.lat}<br>${data.coord.lon}</td>
                    </tr>
                </table>`
            })

            .catch(() => {
                console.log('Ошибка при запросе данных погоды на сегодня')
            })
    }
}

class weatherForecast {

    constructor(geo__data) {
        this.geo__data = geo__data
    }
    dataRequest() {

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.geo__data.lat}&lon=${this.geo__data.lon}&appid=9e85d06dde03d4255aca963f93c72a16&lang=ru&units=metric`)
            .then((resp) => { return resp.json() })
            .then((data__forecast) => {
                console.log('data__forecast:', data__forecast)

                const block__weather__forecast = document.querySelector('.block__weather__forecast')
                block__weather__forecast.querySelector('.forecast__title').innerHTML = `Погода в городе ${data__forecast.city.name} на 5 дней`
                block__weather__forecast.querySelector('.forecast__date').innerHTML = `${data__forecast.list[0].dt_txt.match(/\b\d\d\d\d-\d\d-\d\d\b/g)} сегодня`

                for (let i = 0; i < data__forecast.list.length; i++) {
                    if (block__weather__forecast.querySelectorAll('.block__forecast').length < data__forecast.list.length) {
                        block__weather__forecast.innerHTML += `<div class="block__forecast"><div class="forecast__block__row">
                        <div class="block__row forecast__time">${data__forecast.list[i].dt_txt.match(/\b\d\d:\d\d\b/g)}</div>
                        <div class="block__row forecast__icon"><img src="https://openweathermap.org/img/wn/${data__forecast.list[i].weather[0].icon}@2x.png"></div>
                    </div>
                    <div class="forecast__block__row">
                        <div class="forecast__temp">${data__forecast.list[i].main.temp.toFixed(1)} °C</div>
                        <div class="forecast__conditions">${data__forecast.list[i].weather[0].description}</div>
                        <div class="forecast__wind">ветер ${data__forecast.list[i].wind.speed} м/с</div>
                        <div class="forecast__clouds">облачность ${data__forecast.list[i].clouds.all} %</div>
                        <div class="forecast__pressure">${(data__forecast.list[i].main.pressure / 133 * 100).toFixed()} мм рт ст</div></div>`

                        block__weather__forecast.querySelectorAll('.block__forecast')[i].after(block__weather__forecast.querySelectorAll('.block__forecast')[i])

                        if (block__weather__forecast.querySelectorAll('.forecast__time')[i].innerHTML.match(/\b\d\d:\d\d\b/g) == '21:00') {
                            block__weather__forecast.innerHTML += `<div class="forecast__date">${data__forecast.list[i + 1].dt_txt.match(/\b\d\d\d\d-\d\d-\d\d\b/g)}</div>`
                        }
                    }
                }
            })

            .catch(() => {
                console.log('Ошибка при запросе данных погоды на 5 дней')
            })
    }
}