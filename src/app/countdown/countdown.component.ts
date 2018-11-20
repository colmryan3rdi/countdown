import { Component, OnInit, Input } from '@angular/core';
import { NotificationLogService } from '../notificationlog.service';
import { interval } from 'rxjs';
import * as addSeconds  from 'date-fns/add_seconds';
import * as format from 'date-fns/format'

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

 
  private timeInput;
  private timerOn: boolean;
  private timerObservable: any;
  private timeRemaining;
  private notifications: string [];
  constructor(private notificationLog: NotificationLogService) { }


  ngOnInit() {
    this.timeInput = '00:02:00';
    this.timerOn = false; 
    this.notifications = [];
  }

  onClickStart() {
    this.notifications = [];
    this.timerOn=true;
    this.timerObservable = interval(100).subscribe ((n)=> {
      let timerValue = new Date("01/01/0000" + " " + this.timeInput);

      timerValue = addSeconds(timerValue,-n);
      this.timeRemaining = format(timerValue,'HH:mm:ss');
      console.log(timerValue, this.timeRemaining + "//" + n);
      if(n % 60 == 0 && n > 0) {
          if (n/60 == 1){
            this.notifications.push(n/60 + " minute has passed.");
          }
          else{
            this.notifications.push(n/60 + " minutes have passed.");
          }
        }
      if(this.timeRemaining == '00:00:00'){
        this.notifications.push("Now we are done");
        this.onClickStop();
      }
    });
  }
  onClickStop() {
    this.timerOn=false;
    this.timerObservable.unsubscribe();
  }
}
