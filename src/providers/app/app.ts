import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class AppProvider {

  constructor(private toasts: ToastController) {
  }

  toast(msg: string, time: number, pos: string) {
    let toast = this.toasts.create({
      message: msg,
      duration: time,
      position: pos,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
}
