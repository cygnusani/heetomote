import { SMS } from '@ionic-native/sms';
import { Injectable } from '@angular/core';
import { AppProvider } from '../app/app';

@Injectable()
export class SmssProvider {

  status = 2
  start = 3
  stop = 4
  settings = 9

  constructor(private app: AppProvider, private sms: SMS) {
  }

  startHeater(carNumber: any) {
    this.sendMsg(this.start.toString(), carNumber)
  }

  stopHeater(carNumber: any) {
    this.sendMsg(this.stop.toString(), carNumber)
  }

  getCarStatus(carNumber: any) {
    this.sendMsg(this.status.toString(), carNumber)
  }

  getSettings(carNumber: any) {
    this.sendMsg(this.settings.toString(), carNumber)
  }

  private sendMsg(message: string, nr: string) {
    this.sms.send(nr, message)
  }
}
