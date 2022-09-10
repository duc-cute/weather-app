'use strict'
const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const place=$('.city__position .city__name');
const city=$('.weather__title-heading span');
const temperatureTitleMax=$('.temperature__value-max ');
const temperatureTitleMin=$('.temperature__value-min ');
const weatherShortDes=$('.weather__title-short-des');
const pressure=$('.weather__title-more-des .pressure span');
const visibility=$('.weather__title-more-des .visibility span');
const humidity=$('.weather__title-more-des .humidity span');
const nameWeatherTitle=$('.weather__title-heading .name__weather-short');
const speedWind=$('.weather__title-wind .wind__speed-now');
const titleDes=$('.weather__status-body .weather__title-des');
const cityStatus=$('.city__status');
const cityTemp=$('.city__temperature-value');
const cloudsPercent=$('.clouds__range-sliderValue span');
const inputClouds=$('.input-percent #clouds__rate');
const percentBar=$('.percent-bar');
const sunset=$('.content__time-value .content__time-value-end');
const sunrise=$('.content__time-value .content__time-value-start');
const inputTimeSun=$('#time-sun');
const inputBg=$('.content__time-sun-bg');
const sun=$('.content__time-sun > i');
const predictionDay=$$('.weather__prediction-day');
const weatherNextCity=$('.weather__tomorrow-city')
const weatherNextTemp=$('.weather__tomorrow-temperature');
const weatherNextDes=$('.weather__tomorrow-des');
const searchInput=$('#search');
const app= {
    months : [
        {1: 'January'},
        {2: 'February'},
        {3: 'March'},
        {4: 'April'},
        {5: 'May'},
        {6: 'June'},
        {7: 'July'},
        {8: 'August'},
        {9: 'September'},
        {10: 'October'},
        {11: 'November'},
        {12: 'December'}
    ],
   
    render:function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let lon=position.coords.longitude
                let lat=position.coords.latitude
                let apiCurrent=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=acf3af863acf99df0d6e052b4af19254`
                fetch(apiCurrent) 
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        this.weatherReport(data);
                        

                    })
            })
        }
    },
    weatherReport : function(data) {
            var urlWeatherReport=`https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=acf3af863acf99df0d6e052b4af19254`
            
            fetch(urlWeatherReport)
            .then(res => {
                return res.json()
            })
            .then(dayForecastData => {
                    //Place
                    const cityName=data.name.replace('Tinh ','');
                    place.innerText=`${cityName}, ${data.sys.country}`
                    city.innerText=`${cityName}`
                    //Temperature
                    temperatureTitleMax.innerHTML=`${Math.round(data.main.temp_max - 272.15)}<sup>o</sup>C`
                    temperatureTitleMin.innerHTML=`${Math.round(data.main.temp_min - 272.15)}<sup>o</sup>C`
                    weatherShortDes.innerText=`${data.weather[0].description}`
                    //More des
                    pressure.innerText=`${data.main.pressure} hPa`
                    visibility.innerText=`${Math.round(data.visibility / 1000)} km`
                    humidity.innerText=`${data.main.humidity} %`
                    nameWeatherTitle.innerText=`${data.weather[0].main}`
                    speedWind.innerText=`${Math.floor(data.wind.speed * 36) / 10}km`
                    titleDes.innerText=`${data.weather[0].description}`
                    cityStatus.innerText=`${data.weather[0].main}`
                    cityTemp.innerHTML=`${Math.round(data.main.temp - 272.15)}<sup>o</sup>C`
                    //input clouds
                    cloudsPercent.innerText=`${data.clouds.all}%`
                    cloudsPercent.style.left=`${data.clouds.all}%`
                    percentBar.style.width=`${data.clouds.all}%`
    
                    //Tomorrow weather
                    weatherNextCity.innerText=`${cityName}`
    
                    //Time Sun
                    function sunRise() {
                        let dateSunrise = new Date((data.sys.sunrise)*1000);
                        var hours=dateSunrise.getHours() < 10 ? '0'+dateSunrise.getHours() : dateSunrise.getHours();
                        var minutes=dateSunrise.getMinutes() <10 ? '0'+dateSunrise.getMinutes() : dateSunrise.getMinutes();
                        var hoursSunriseChange=hours > 12 ? `${hours-12}` : hours;
                        sunrise.innerText=`${hoursSunriseChange}:${minutes} am`
                    }
                    function sunSet() {
                        let dateSunset = new Date((data.sys.sunset)*1000);
                        var hours=dateSunset.getHours() < 10 ? '0'+dateSunset.getHours() : dateSunset.getHours();
                        var minutes=dateSunset.getMinutes() <10 ? '0'+dateSunset.getMinutes() : dateSunset.getMinutes();
                        var hoursSunsetChange=hours > 12 ? `${hours-12}` : hours;
                        sunset.innerText=`${hoursSunsetChange}:${minutes} pm`
                    }
                    sunRise()
                    sunSet()
                    //Input Sun
                    function inputSun() {
                        let dataSunrise=data.sys.sunrise
                        let dataSunset=data.sys.sunset
                        let dataCurrent=data.dt
                        let currentSlider
                        let valueInput=Math.round((dataCurrent - dataSunrise)/(dataSunset-dataSunrise)*100)
                        if(valueInput >= 0) {
                            inputBg.style.width=`${valueInput}%`
                            let currentSun=11 + (dataCurrent - dataSunrise)/(dataSunset-dataSunrise)*72.675;
                            if(currentSun< 14) {
                                sun.style.left='14%'
                            }else if(currentSun > 84) {
                                sun.style.left='84%'
                            }else {
                                sun.style.left=`${currentSun}%`
                            }
    
                            currentSlider=13.66 + (dataCurrent - dataSunrise)/(dataSunset-dataSunrise)*72.675;
                            if(currentSlider < 13.66) {
                                inputTimeSun.value='13.3'
                            }else if(currentSlider > 86) {
                                inputTimeSun.value='86.7'
                            }else {
                                inputTimeSun.value=`${currentSlider}`
                            }

                            console.log(dataCurrent - dataSunrise,dataSunset-dataSunrise)

                        
                        }else {
                            inputTimeSun.value='86.7'
                            inputBg.style.width='100%'
                        }
    
                    }
                    inputSun()
                    this.dayForecast(dayForecastData);

                    //Chart
                    const list1=[]
                    const list2=[]
                    for(var i=0;i<=6;i+=2) {
                        var temp=Math.round(dayForecastData.list[i].main.temp - 272.15)
                        list1.push(temp)
                        console.log(dayForecastData.list[i].dt_txt,'list1')
                    }
                    for(var i=1;i<=7;i+=2) {
                        var temp=Math.round(dayForecastData.list[i].main.temp - 272.15)
                        list2.push(temp)
                    }
                    console.log(list1)
                
                    const labels = [
                        'Morning',
                        'Afternoon',
                        'Evening',
                        'Night',
                    ]
                    
                    const datas = {
                        labels: labels,
                        datasets: [{
                          label: 'My First dataset',
                          data: list1,
                          pointBackgroundColor:'#ff8d24',
                          pointHoverBackgroundColor:'red',
                          tension:0.5,
                          borderColor: '#ff8d24',
                      
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: '#ccc',
                          data: list2,
                          pointBackgroundColor:'transparent',
                          pointHoverBackgroundColor:'ccc',
                          tension:0.3,
                          borderColor: '#ccc',
                          borderWidth:1,
                          pointBorderWidth:0,
                        }
                      ]
                    }
                    const config = {
                        type: 'line',
                        data: datas,
                        options: {
                            plugins: {
                                legend: {
                                    display:false,
                                    position:'right',
                                }
                            },
                            responsive: false,
                            scales: {
                                y: {
                                    beginAtZero:true,
                                },
                            },
                            layout: {
                                // padding: {
                                //     right: 80,
                                //     bottom:80
                                // }
                            }
                        }
                    }
                    Chart.defaults.color='#333'
                    Chart.defaults.borderColor='#fff'
                    Chart.defaults.font.family='Arial'
                    Chart.defaults.font.size='18'
                    
                    
                    $('#myChart').remove();
                    $('.content__chart-myChart').innerHTML='<canvas id="myChart"></canvas>'
                    var ctx = document.getElementById("myChart").getContext("2d");
                    const myChartWeather = new Chart(ctx,config);
            })
        
    },

    handleDayForecast:function(data,i,index) {
        const icons={
             Clouds:`<i class="fa-solid fa-clouds icon-clouds"></i>`,
             Rain:`<i class="fa-solid fa-cloud-rain icon-rain"></i>`,
             Clear:`<i class="fa-solid fa-sun-cloud icon-sun"></i>`
        }
        
        const iconName =data.list[i].weather[0].main;
        
        // console.log(icons[iconName])
        let date=new Date(data.list[i].dt*1000);
            const month=this.months[date.getMonth()][date.getMonth()+1];
            const day=date.getDate();
            const tempMax=`${Math.round(data.list[i].main.temp_max-272,15)}<sup>o</sup>C`
            const tempMin=`${Math.round(data.list[i].main.temp_min-272,15)}<sup>o</sup>C`
            var predictionDayArr=Array.from(predictionDay)
            predictionDayArr[index].querySelector('.weather__prediction-date').innerText=`${month} ${day}`
            predictionDayArr[index].querySelector('.weather__prediction-des span').innerText=data.list[i].weather[0].main
            predictionDayArr[index].querySelector('.weather__prediction-icon').innerHTML=icons[iconName];
            predictionDayArr[index].querySelector('.weather__prediction-temperature').innerHTML=`${tempMax} /${tempMin}`;
    },
    dayForecast:function(data) {
        var index=0;
            weatherNextDes.innerText=data.list[7].weather[0].description
            weatherNextTemp.innerHTML=`${Math.round(data.list[0].main.temp - 272,15)}<sup>o</sup>C `
        for(var i=7;i<16;i+=8) {
            this.handleDayForecast(data,i,index);
            index++;
        }
        
    },
    renderBySearch:function() {
        var placeInput=searchInput.value
        if(placeInput) {
            var urlSearch=`https://api.openweathermap.org/data/2.5/weather?q=${placeInput}&appid=acf3af863acf99df0d6e052b4af19254`
            fetch(urlSearch) 
               .then(res => {
                   return res.json()
               })
               .then(data => {
                    this.weatherReport(data)
               })
        }
    },
    handleInput :function() {
        //Input onblur
        searchInput.onblur = () => {
            this.renderBySearch()
            searchInput.value=''
        }
        searchInput.addEventListener('keyup',e => {
            if(e.keyCode === 13) {
            this.renderBySearch()
                searchInput.value='';

            }
        })
    },

    start:function() {
        this.render();
        this.handleInput()
    },
    
}
app.start();