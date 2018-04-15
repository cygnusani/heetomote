import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { NewEditCarPage } from '../new-edit-car/new-edit-car';
import { DbProvider } from '../../providers/db/db';
import { HomePage } from '../home/home';
import { AppProvider } from '../../providers/app/app';
import { SmssProvider } from '../../providers/smss/smss';
import { Car } from '../../model/car';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage implements OnInit {

  car: Car

  constructor(private app: AppProvider, private smss: SmssProvider, private db: DbProvider, private viewCtrl: ViewController, public navCtrl: NavController, private navParams: NavParams) {
  }

  ngOnInit() {
    this.car = this.navParams.get('car')
  }

  getSettings() {
    this.app.toast('Requesting settings ...', 2500, 'top')
    this.smss.getSettings(this.car.carNr)
    this.viewCtrl.dismiss({
      action: ''
    })
  }

  newCar() {
    this.viewCtrl.dismiss({
      action: 'new'
    })
  }

  editCar() {
    this.viewCtrl.dismiss({
      action: 'edit'
    })
  }

  deleteCar() {
    this.viewCtrl.dismiss({
      action: 'del'
    })
  }
}
