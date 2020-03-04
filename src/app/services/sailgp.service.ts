import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SailgpService {
  sailgpURL: any;
  constructor(public http: HttpClient) {
    console.log('Sail GP Backend service --');
    //this.sailgpURL = 'https://132.145.171.146/ords/sailgp';
    
  /*  if(window.location.hostname == '129.213.148.39' || window.location.hostname == 'localhost'){
      this.sailgpURL = 'http://140.238.193.154/ords/sailgp'; //development
    }
    else if(window.location.hostname == '129.213.28.10' ){
      this.sailgpURL = 'http://129.213.49.110/ords/sailgp'; //production
    }*/
    this.sailgpURL = 'http://140.238.193.154/ords/sailgp'; //development

  }

  getallseries(): Observable<any> {
    console.log('logging in');
    return this.http.get(`${this.sailgpURL}/series`);

  }
  getTopSpeed(): Observable<any> {
    return this.http.get(`${this.sailgpURL}/raceinfo/topSpeeds`);

  }
  getRaceById(raceid): Observable<any> {
    console.log('logging in');
    return this.http.get(`${this.sailgpURL}/raceinfo/stats/raceid/${raceid}`);
  }
  dateformatMMMDDYYYYTIME(d) {
 //   console.log('top speed ', d)
    var numDate = parseInt(d);

    var date = new Date(d)
   // console.log(numDate, 'date------', date)
    var m_names = new Array("Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec");
    let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return m_names[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + " " + date.getHours() + ":" + minutes;
  }
}
