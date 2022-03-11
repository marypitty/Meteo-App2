import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component } from '@angular/core';
import { isEmpty } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My weather App';
  input: any = '';
  woeid: any = '';
  currentTime: any = new Date().toLocaleTimeString(); // oppure toString
  loading: any = false;

  forecastContainer: any = [];

  week_days: any = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };

  constructor(private service: DataService) {}

  getInfo() {
    this.loading = true;
    this.service.getData(this.input).subscribe({
      next: (x: any) => {
        if (x.length <= 0) {
          alert('Sorry, city not found');
          this.loading = false;
        }

        let name = x[0].title;
        this.woeid = x[0].woeid;
        

        let promiseForecast = new Promise((resolve, reject) => {
          let forecast: any = [];
          for (let i = 0; i < 7; i++) {
            let currentDate = new Date().setDate(new Date().getDate() + i);
            let year = new Date(currentDate).getFullYear();
            let month = new Date(currentDate).getMonth() + 1;
            let day = new Date(currentDate).getDate();
            let weekday = new Date(currentDate).getDay();

            this.service.getData2(this.woeid, year, month, day).subscribe({
              next: (x: any) => {
                let weather_name = x[0].weather_state_name;
                let Tmax = parseInt(x[0].max_temp);
                let Tmin = parseInt(x[0].min_temp);

                let weather_icon = `https://www.metaweather.com/static/img/weather/${x[0].weather_state_abbr}.svg`;
                let resp: any = {
                  city: name,
                  day: this.week_days[weekday],
                  time: currentDate,
                  icon: weather_icon,
                  weather: weather_name,
                  Tmax: Tmax,
                  Tmin: Tmin,
                };

                forecast[i] = resp;

                let foundPos = forecast.findIndex((item: any) => !item);
                if (forecast.length >= 7 && foundPos < 0) {
                  resolve(forecast);
                }
              },
              error: (x: any) => {
                reject();
                alert('Error in uploading data');
              },
              complete: () => {
                this.loading = false;
              },
            });
          }
        });
        promiseForecast.then((success) => {
          this.forecastContainer.push(success);
        });
      },
      error: (x: any) => {
        alert('Error in uploading data');
      },
      complete: () => {},
    });
  }

  deleteItem(x: any) {
    this.forecastContainer.splice(x, 1);
  }
}
