import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Car } from '../../model/car';
import { DbProvider } from '../../providers/db/db';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppProvider } from '../../providers/app/app';

@IonicPage()
@Component({
  selector: 'page-new-edit-car',
  templateUrl: 'new-edit-car.html',
})
export class NewEditCarPage implements OnInit {
  carForm: FormGroup

  title = ''

  cars: Car[] = []
  car = new Car()

  constructor(private app: AppProvider, private nav: NavController, private navPar: NavParams, private db: DbProvider, private formBuilder: FormBuilder) {
    this.carForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern("^[a-zA-Z0-9 ._-]+$")])],
      carNr: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern("^[+0-9]+$")])]
    })
  }

  ngOnInit() {
    this.db.getAll().then(res => {
      this.cars = res
      console.log(this.cars.length)

      if (this.navPar.get('car')) {
        this.title = 'Edit car'

        var car = this.navPar.get('car')

        this.car.id = car.id
        this.car.name = car.name
        this.car.carNr = car.carNr
      } else {
        this.title = 'New car'

      }
    })
  }

  save() {
    // Check is there already isn't a car with entered name and/or number
    for (let i = 0; i < this.cars.length; i++) {
      const car = this.cars[i];
      if (car.id != this.car.id) {
        if (car.name == this.car.name || car.carNr == this.car.carNr) {
          this.app.toast('This car name and/or number is already in use', 2500, 'top')
          return
        }
      }
    }

    this.nav.push(HomePage, {
      car: this.car
    })
  }
}
