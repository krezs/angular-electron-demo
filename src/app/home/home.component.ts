import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { IpcService } from '../services/ipc.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  count = 0;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription: Subscription | undefined;
  ipLIst: any;
  ipAddress: string = 'not found';


  constructor(private ipcService: IpcService) { }

  ngOnInit(): void {
    this.listenReply();
    this.ipcService.send('ip-request');
    // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });
  }

  ngAfterViewInit() {
    // this.listenReply();

  }


  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.ipcService.removeAllListeners('reply');
  }


  listenReply(): void {
    if (!this.ipcService.isElectron()) {
      return;
    }
    console.log(this.ipcService);
    this.ipcService.on('reply').subscribe(reply => {
      //console.log(reply);
      this.ipAddress = reply;
    });


  }

  addNum() {
    this.count++;
  }

  reset() {
    this.count = 0;
  }


}
