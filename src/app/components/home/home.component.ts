import { Component, OnInit } from '@angular/core';
import { SailgpService } from '../../services/sailgp.service';
import { filter } from 'rxjs/operators';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  raceEvents: any;
  selectedRaceEvent: any;
  raceTeams: any = [];
  races: any;
  legData: any = [];
  topSpeedData: any = [];
  eventspeedData: any = [];
  selectedrace: any;
  dataforrefresh: any;
  refrshIntervalId: any;
  refrshIntervalTopSpeed: any;
  selectedevent: any = [];
  selectedeventPrevious: any = 'New York 2019';
  constructor(private sailgpservice: SailgpService) { }

  ngOnInit() {

    this.sailgpservice.getallseries()
      .subscribe(response => {

        this.raceEvents = response.series[0].season[0].raceSets;
        this.selectedRaceEvent = this.raceEvents[1];
        this.races = this.selectedRaceEvent.races.filter((race) => !race.name.includes('Practice1'))
        //console.log(this.raceEvents, this.races)
        this.selectedrace = this.races.filter((racingstatus) => racingstatus.status == 'Racing')[0];
        if (this.selectedrace != undefined) {
          this.getRaceDetails(this.selectedrace);
        }
        console.log(this.selectedrace)


      });
    this.getTopSpeedData();
    this.refrshIntervalTopSpeed = setInterval(() => {
      this.getTopSpeedData();
    }, 100000);

  }
  getTopSpeedData() {
    this.sailgpservice.getTopSpeed()
      .subscribe(response => {
        this.topSpeedData = response;
        this.topSpeedData.alltimeTopSpeeds = this.topSpeedData.alltimeTopSpeeds.sort(this.getSortOrder("maxBoatSpeed")); //Pass the attribute to be sorted on  
        this.topSpeedData.currentTopSpeeds = this.topSpeedData.currentTopSpeeds.sort(this.getSortOrder("maxBoatSpeed")); //Pass the attribute to be sorted on  

        console.log(this.topSpeedData)
        let data1 = this.topSpeedData.eventTopSpeeds;
        this.selectedevent = (data1.filter(eventteam =>
          eventteam.name == this.selectedeventPrevious
        )[0].boats).sort(this.getSortOrder("maxBoatSpeed"));
      });
  }
  ngOnDestroy() {
    clearInterval(this.refrshIntervalId);
    clearInterval(this.refrshIntervalTopSpeed);
  }
  getRaceEventDetails(raceEvent) {
    this.raceTeams = [];
    clearInterval(this.refrshIntervalId)
    //   console.log('vjjj', raceEvent)
    this.races = [];
    setTimeout(() => {

      this.races = raceEvent.races.filter((race) => !race.name.includes('Practice12'))

    }, 1000);
    console.log('race id selected ', raceEvent)

  }
  getRaceDetails(race) {
    clearInterval(this.refrshIntervalId)

    console.log('getRaceDetails ', race);
    this.getServerLegData(race)
    this.refrshIntervalId = setInterval(() => {
      this.getServerLegData(race)
    }, 100000);
  }


  getServerLegData(race) {

    //  console.log('getRaceDetails ', race)
    let racecompetetors = race.competitors;
    this.sailgpservice.getRaceById(race.id)
      .subscribe(response => {
        //   console.log(response);
        this.raceTeams = response.competitors;
        // console.log(this.raceTeams)
        //  console.log("Team numbers" + this.raceTeams.length)
        //  console.log(this.raceTeams)

        this.raceTeams.forEach((obj, index) => {
          racecompetetors.forEach((competetorObj, competetorindex) => {
            //  console.log(competetorObj.country, obj.country)
            if (obj.country == competetorObj.country) {

              this.raceTeams[index].crewMembers = this.fullnameCrew(competetorObj.crew);
            }
          })
          //  console.log(obj); // 9, 2, 5
          //   console.log(index); // 0, 1, 2
          var res = [];
          Object.keys(obj.stats).forEach(k => {
            //  console.log(k)
            //   console.log(obj.stats[k]);
            if (k != 'race') {
              let myArray = k.split(/([0-9]+)/);
              let legvalue = myArray[0] + ' ' + myArray[1]
              res.push({ "name": legvalue, "value": obj.stats[k] })
            }
          });
          this.raceTeams[index].formatedstats = res;


        });
        var arrTacks = [];
        var arrGybes = [];
        var arrmaxSoG = [];
        var arrmaxBoatSpeed = [];
        var arrduration = [];
        var arrfoilTime = [];
        var arrdistanceSailed = [];
        var arrmaneuvers = [];
        this.raceTeams.forEach((teamitem, index) => {
          // console.log(teamitem); 
          teamitem.formatedstats.forEach((item, index) => {
            //console.log(item.value); 

            arrTacks.push(item.value["numberOfTacks"]);
            arrGybes.push(item.value["numberOfGybes"]);
            arrmaxSoG.push(item.value["maxSoG"]);
            arrmaxBoatSpeed.push(item.value["maxBoatSpeed"]);
            arrduration.push(item.value["duration"]);
            arrfoilTime.push(item.value["foilTime"]);
            arrdistanceSailed.push(item.value["distanceSailed"]);
            arrmaneuvers.push(item.value["numberOfTacks"] + item.value["numberOfGybes"]);
            if (index == teamitem.formatedstats.length - 1) {
              teamitem.maxTacks = Math.max.apply(Math, arrTacks)
              teamitem.maxGybes = Math.max.apply(Math, arrGybes)
              teamitem.maxmaneuvers = Math.max.apply(Math, arrmaneuvers);
              teamitem.maxSog = Math.max.apply(Math, arrmaxSoG)
              teamitem.maxBoatSpeed = Math.max.apply(Math, arrmaxBoatSpeed)
              teamitem.maxDuration = Math.max.apply(Math, arrduration)
              teamitem.maxfoilTime = Math.max.apply(Math, arrfoilTime)
              teamitem.maxdistanceSailed = Math.max.apply(Math, arrdistanceSailed)
            }

            //console.log("numberOfTacks - higest"+this.getMax(item.value, "numberOfTacks"));
          });
          arrTacks = [];
          arrGybes = [];
          arrmaxSoG = [];
          arrmaxBoatSpeed = [];
          arrduration = [];
          arrfoilTime = [];
          arrdistanceSailed = [];
          arrmaneuvers = []
        });
        //to get maximum count





        // console.log(this.raceTeams)
        /*this.raceTeams.forEach(childObj,index) => {
          //console.log(childObj)
          //console.log(childObj.stats)
          console.log(childObj.stats);
          var res = [];
          Object.keys(childObj.stats).forEach(k => {
            console.log(k)
            console.log(childObj.stats[k]);
            res.push({[k]:childObj.stats[k]})
          });
      
          console.log(res);
          
        }*/
      });
  }
  formatDate(date) {
    return this.sailgpservice.dateformatMMMDDYYYYTIME(date);
  }

  fullnameCrew(crew) {
    crew.forEach((element, index) => {
      crew[index].fullName = element.firstName + ' ' + element.lastName;
      //  console.log(crew[index].fullName);
    });
    return crew;
  }

  getteamname(country) {

    if (country == "USA") {
      return "The United States"
    }
    if (country == "AUS") {
      return "Australia"
    }
    if (country == "JPN") {
      return "Japan"
    }
    if (country == "CHN") {
      return "China"
    }
    if (country == "GBR") {
      return "Great Britain"
    }
    if (country == "FRA") {
      return "France"
    }
    if (country == "ESP") {
      return "Spain"
    }
    if (country == "DEN") {
      return "Denmark"
    }

    return '';
  }


  getFormatedLegduration(duration) {

    let hh, mm, ss;
    let sec_num = parseFloat(duration)

    let hours = Math.floor(sec_num / 3600);
    hh = hours.toString()
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    mm = minutes.toString();
    let seconds = (sec_num - (hours * 3600) - (minutes * 60));

    seconds = Math.round(seconds)
    ss = seconds.toString();
    if (hours < 10) {
      hh = "0" + hours;
    }
    if (minutes < 10) { mm = "0" + minutes; }
    if (seconds < 10) { ss = "0" + seconds; }
    return hh + ':' + mm + ':' + ss;

  }

  sortEventTopspped(eventdata) {
    this.selectedeventPrevious = eventdata.source.selected._element.nativeElement.innerText.trim();
    this.selectedevent = eventdata.value.sort(this.getSortOrder("maxBoatSpeed"));

  }

  getSortOrder(prop) {

    return (a, b) => {

      if (a[prop] < b[prop]) {

        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    }
  }
  capitalize(text){
    return text.toUpperCase();
  }


}