"use strict"

const calendar = document.querySelector('.calendar-table');
const nav = document.querySelector('.nav')
const input = document.querySelector('.filter-field')
const dropdown = document.querySelector('.dropdown-menu')
const filterDiv = document.querySelector('.filter')

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December']

const date = new Date();
let currentMonth = date.getMonth() + 1;
let currentYear = date.getFullYear();

const daysInMonth = (month, year) => {
  return 32 - new Date(year, month, 32).getDate();
}

function getDay(date) {
  let day = date.getDay();
  if (day === 0) day = 7;
  return day - 1;
}

nav.addEventListener('click', (event) => {
  if (event.target.classList[0] === 'arrow-right') {
    calendar.innerHTML = '';
    currentMonth++;
    createCalendar(currentYear, currentMonth);
  }
  if (event.target.classList[0] === 'arrow-left') {
    calendar.innerHTML = '';
    currentMonth--;
    createCalendar(currentYear, currentMonth);
  }
})

const createCalendar = (year, month) => {
  month--;
  const table = document.createElement('table');
  table.classList.add('calendar')
  const newTr = table.insertRow(0);
  weekdays.forEach((el, idx) => {
    const newTd = newTr.insertCell(idx);
    newTd.innerHTML = el;
    newTd.classList.add('months')
  });

  const date = new Date(year, month)
  nav.innerHTML = `<span class="arrow-left">&larr;</span>
                    ${months[month -12 * Math.floor(month/12)]} ${date.getFullYear()}
                    <span class="arrow-right">&rarr;</span>
                    `
  createTable(table, month, year, date)
  calendar.append(table)
}

const createTable = (table, month, year, date) => {
  for(let i = 1; i < 7; i++) {
    const newTr = table.insertRow(i);
    for(let j = 0; j < 7; j++) {
      const newTd = newTr.insertCell(j);
      if (date.getMonth() !== month -12 * Math.floor(month/12)) {
        newTd.style.backgroundColor = '#d9d9d9';
      }
      if ( i === 1 && j < getDay(date)) {
        newTd.innerHTML = `${daysInMonth(month - 1, year) - (getDay(date) - j) + 1}`;
        newTd.style.backgroundColor = '#d9d9d9';
      } else {
        newTd.innerHTML = `${date.getDate()}`;
        if (new Date().getDate() === date.getDate() && new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear()) {
          newTd.style.border = '3px solid red'
        }
        date.setDate(date.getDate() + 1);

      }
    }
  }
}

let pokes = 0;
let flag = 0;
input.addEventListener('keyup', () => {
  pokes++;
  if (dropdown.hasChildNodes()) {
    dropdown.innerHTML = '';
  }
  setTimeout(() => {
    flag++;
    if(pokes === flag) {

      const cities = [];
      pokes = flag = 0;
      fetch('cities.json').then(response => response.json()).then(data => {
        data['RECORDS'].forEach(el => {
          cities.push(el['owm_city_name'])
        })
        let filteredCities = [];
        if (input.value !== '') {
          filteredCities = cities.filter(el => {
            return el.startsWith(input.value)
          })
        }
        filteredCities.map(el => {
          const div = document.createElement('DIV');
          div.classList.add('list-item')

          div.addEventListener('click', (event) => clickHandle(event.target.textContent))
          div.textContent = el;

          dropdown.append(div);

        })
        if (dropdown.childNodes.length === 1) {
          clickHandle(dropdown.firstChild.textContent)
        } else if (dropdown.childNodes.length === 0) {
            dropdown.textContent = 'No results'
        } else {
          filterDiv.style.overflowY = 'scroll'
        }
      })
    }
  }, 1000)

})

const clickHandle = (cityName) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e9b588aaf98720d18db8a935d5908678`)
      .then(response => response.json()).then(data => {
      const divCard = document.createElement('DIV');
      divCard.classList.add('card');

      const spanCity = document.createElement('SPAN');
      spanCity.classList.add('city');
      spanCity.textContent = cityName;

      const spanTemp = document.createElement('SPAN');
      spanTemp.classList.add('temperature');
      spanTemp.textContent = `temperature:${Math.floor(data.main.temp - 273)}`

      const spanFeelsLike = document.createElement('SPAN');
      spanFeelsLike.classList.add('temperature');
      spanFeelsLike.textContent = `\n feels like: ${Math.floor(data.main.feels_like - 273)}`;

      const spanSky = document.createElement('SPAN');
      spanSky.style.fontSize = '17px'
      spanSky.innerHTML = `<br>${data.weather[0].description}`

      divCard.append(spanCity, spanTemp, spanFeelsLike, spanSky);
      dropdown.innerHTML = '';
      input.value = '';
      dropdown.append(divCard)
      filterDiv.style.overflow = 'visible'
    })
}

createCalendar(2020, 12);