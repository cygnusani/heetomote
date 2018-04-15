import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ActionSheetController, PopoverController, NavParams, IonicPage, NavController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Car } from '../../model/car';
import { OptionsPage } from '../options/options';
import { SmssProvider } from '../../providers/smss/smss';
import { AppProvider } from '../../providers/app/app';
import { DbProvider } from '../../providers/db/db';
import { NewEditCarPage } from '../new-edit-car/new-edit-car';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides

  states = ['Heating stopped', 'Heating active', 'Error']

  cars: Car[] = []

  constructor(private app: AppProvider, private smss: SmssProvider, private db: DbProvider, private navCtrl: NavController, private navParams: NavParams, private actionSheetCtrl: ActionSheetController, private popoverCtrl: PopoverController, public alertCtrl: AlertController) {
  }


  ionViewWillEnter() {
    if (this.navParams.get('car')) {
      // Temporary save
      var car = this.navParams.get('car')
      // If was a new car
      if (car.id == -1) {
        this.insertCar(car).then(() => {
          this.getCars()
        })
        // Updated car
      } else {
        this.updateCar(car).then(() => {
          this.getCars()
        })
      }
    } else {
      this.getCars()
    }

  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
    // Fetch cars from database
    this.getCars().then(() => {
      this.navCtrl.resize()
    })
  }

  showOptions() {
    return this.cars.length > 0
  }

  mainOptions(ev) {
    // Create main options popover and send car data in
    let popover = this.popoverCtrl.create(OptionsPage, { car: this.cars[this.slides._activeIndex] })

    popover.present({
      ev: ev
    })
    // Options response
    popover.onWillDismiss(res => {
      if (res.action === 'new') {
        console.log('new')
        this.navCtrl.push(NewEditCarPage)
      } else if (res.action === 'edit') {
        console.log('edit')
        if (this.cars[this.slides._activeIndex].status == 1) {
          this.app.toast('Turn off heating for this car before proceeding', 2500, 'top')
        } else {
          this.navCtrl.push(NewEditCarPage, {
            car: this.cars[this.slides._activeIndex]
          })
        }
      } else if (res.action === 'del') {
        if (this.cars[this.slides._activeIndex].status == 1) {
          this.app.toast('Turn off heating for this car before proceeding', 2500, 'top')
        } else {
          console.log('del')
          let confirm = this.alertCtrl.create({
            message: 'Are you sure you would like to delete ' + this.cars[this.slides._activeIndex].name + '?',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  this.deleteCar(this.cars[this.slides._activeIndex]).then(res => {
                    // Delete car from local list
                    this.cars.splice(this.cars.indexOf(this.cars[this.slides._activeIndex]), 1)
                    if (this.cars.length > 0) {
                      this.slides.slideTo(0, 0)
                    }
                    this.navCtrl.resize()
                  })
                }
              },
              {
                text: 'No',
                handler: () => {
                }
              }
            ]
          });
          confirm.present();
        }
      }
    })
  }

  showCarOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      //title: 'Options',
      buttons: [
        {
          text: 'Stop heating',
          role: 'destructive',
          handler: () => {
            this.stopHeating()
          }
        },
        {
          text: 'Start heating',
          handler: () => {
            this.startHeating()
          }
        },
        {
          text: 'Request status',
          handler: () => {
            this.getStatus()
          }
        }
      ]
    })
    actionSheet.present()
  }

  startHeating() {
    if (this.cars[this.slides._activeIndex].status == 1) {
      this.app.toast('Heating is already active', 2500, 'top')
    } else {
      this.cars[this.slides._activeIndex].status = 1
      this.app.toast('Heating started', 2500, 'top')
      this.smss.startHeater(this.cars[this.slides._activeIndex].carNr)
      this.db.update(this.cars[this.slides._activeIndex]).then(() => {
        this.navCtrl.resize()
      })
    }
  }

  stopHeating() {
    if (this.cars[this.slides._activeIndex].status == 0) {
      this.app.toast('Heating is already stopped', 2500, 'top')
    } else {
      let confirm = this.alertCtrl.create({
        message: 'The heating system should be active for atleast 15 min before turned off',
        buttons: [
          {
            text: 'Turn off',
            handler: () => {
              this.cars[this.slides._activeIndex].status = 0
              this.app.toast('Heating stopped', 2500, 'top')
              this.smss.stopHeater(this.cars[this.slides._activeIndex].carNr)
              this.db.update(this.cars[this.slides._activeIndex]).then(res => {
                this.navCtrl.resize()
              })
              console.log('ok clicked');
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              console.log('stopHeating() action=Cancel');
            }
          }
        ]
      });
      confirm.present();
    }
  }

  getStatus() {
    this.app.toast('Requesting status...', 2500, 'top')
    this.smss.getCarStatus(this.cars[this.slides._activeIndex].carNr)
  }

  getSettings(car: Car) {
    this.app.toast('Requesting settings...', 2500, 'top')
    this.smss.getSettings(car.carNr)
  }

  getCars(): Promise<any> {
    return new Promise(resolve => {
      this.db.getAll().then(data => {
        if (data.length > 0) {
          this.cars = data
          this.navCtrl.resize()
        } else if (data.length == 0) {
          console.log('No cars saved')
        } else {
          this.app.toast('Failed to fetch cars :(', 2500, 'top')
        }
      })
      return resolve(1)
    })
  }

  // CRUD
  insertCar(car: Car): Promise<number> {
    return new Promise(resolve => {
      // db
      this.db.insert(car).then(res => {
        if (res != -1) {
          this.app.toast(car.name + ' saved successfuly!', 2500, 'top')
          return resolve(res)
        } else {
          this.app.toast('Failed to insert selected car :(', 2500, 'top')
          return resolve(0)
        }
      })
    })
  }

  updateCar(car: Car): Promise<number> {
    return new Promise(resolve => {
      // db
      this.db.update(car).then(res => {
        if (res == car.id) {
          this.app.toast(car.name + ' updated successfuly!', 2500, 'top')
          //this.car = car
          return resolve(car.id)
        } else {
          this.app.toast('Failed to update selected car :(', 2500, 'top')
          return resolve(-1)
        }
      })
    })
  }

  deleteCar(car: Car): Promise<number> {
    return new Promise(resolve => {
      this.db.delete(car).then(res => {
        if (res == -1) {
          this.app.toast(car.name + ' deleted successfuly!', 2500, 'top')
          return resolve(1)
        } else {
          this.app.toast('Failed to delete selected car :(', 2500, 'top')
          return resolve(0)
        }
      })
    })
  }
}
