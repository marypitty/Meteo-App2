import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) {}

  getData(city: any) {
    return this.http.get(
      `https://api.codetabs.com/v1/proxy/?quest=https://www.metaweather.com/api/location/search/?query=${city}`
    );
  }

  getData2(woeid: any, year: any, month: any, day: any) {
    return  this.http.get(
      `https://api.codetabs.com/v1/proxy/?quest=https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}/`
    );

  }
}
