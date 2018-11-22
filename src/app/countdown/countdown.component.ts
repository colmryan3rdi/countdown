import { Component, OnInit, Input } from '@angular/core';
import { NotificationLogService } from '../notificationlog.service';
import { interval, fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as addSeconds  from 'date-fns/add_seconds';
import * as format from 'date-fns/format'
import { CountDownNotification } from '../countdownnotification';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

export function ValidateTime(control: AbstractControl) {
  
  console.log(control.value);

  if (Date.parse("01/01/2000" + " " + control.value) < Date.parse("01/01/2000 00:02:00") ) {
    return { lessThan2: true };
  }
  return false;
}

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  private theForm: FormGroup;
  private timeInput;
  private timerOn: boolean;
  private timerObserver: any;
  private timeRemaining;
  private notifications: string [];
  private serverlogdump: CountDownNotification [];
  
  constructor(private notificationLog: NotificationLogService, private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.timerOn = false; 
    this.notifications = [];
  
    this.theForm = this.formBuilder.group({
      timeInput: ['00:02:00', [Validators.required, ValidateTime]]
    });
  }

  onClickStart() {
    this.notificationLog.deleteLoggedNotifications()
    .subscribe(result => {
      console.log("removed previous notifications from server: " );
  

    this.notifications = [];
    this.serverlogdump = null;
    this.timerOn=true;
    const timerSource = interval(100);
    this.timeInput = this.theForm.controls['timeInput'].value;
    let timerValue = new Date("01/01/0000" + " " + this.timeInput);
    this.timeRemaining = format(timerValue,'HH:mm:ss');


    let limitInterval$ = timerSource.pipe(takeWhile(() => this.timeRemaining != '00:00:00'));
    
    this.timerObserver= limitInterval$.subscribe ((n)=>{     
      let notificationText = '';
      timerValue = new Date("01/01/0000" + " " + this.timeInput);
      timerValue = addSeconds(timerValue,-n);
      this.timeRemaining = format(timerValue,'HH:mm:ss');
      if(n % 60 == 0 && n > 0) {
          if (n/60 == 1){
            notificationText = n/60 + " minute has passed.";
          }
          else{
            notificationText = n/60 + " minutes have passed.";
          }
          let addObserver$ = this.notificationLog.addNotification(new CountDownNotification (null,notificationText));
          addObserver$.subscribe(result => {  this.notifications.push(result.notification) });
      }    
    },
    (err) => {    },
    () => { this.countdownComplete();}
    );
  }
)}


countdownComplete = () => {
  //Some slight issue here in that the notification logging operation could still be pending when we hit here....
  //...would take some more effort to ensure all pending operations are completed before making this call.
  this.timerOn=false;
  this.timerObserver.unsubscribe();
  this.notificationLog.getLoggedNotifications()
      .subscribe(result => {
        this.serverlogdump = result;
      })
  }

  onClickStop() {
    this.timerOn=false;
    this.timerObserver.unsubscribe();
  }
}
