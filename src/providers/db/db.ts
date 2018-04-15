import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Car } from '../../model/car';

@Injectable()
export class DbProvider {
  dbName = 'data.db'
  _db

  constructor(private sqlite: SQLite) {
    this._db = this.sqlite.create({
      name: this.dbName,
      location: 'default'
    })
  }

  insert(car): Promise<number> {
    return new Promise(resolve => {
      this._db.then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO cars VALUES(NULL,?,?,?)', [car.name, car.carNr, car.status])
          .then(() => {
            db.executeSql('SELECT * FROM cars WHERE name=?', [car.name])
              .then(res => {
                return resolve(res.rows.item(0).id)
              })
              .catch(e => console.log(e))
          })
          .catch(e => console.log(e))
      })
        .catch(e => console.log(e))
    })
  }

  update(car): Promise<number> {
    return new Promise(resolve => {
      this._db.then((db: SQLiteObject) => {
        db.executeSql('UPDATE cars SET name=?, carNr=?, status=? WHERE id=?', [car.name, car.carNr, car.status, car.id])
          .then(() => {
            return resolve(car.id)
          })
          .catch(e => console.log(e))
      })
        .catch(e => console.log(e))
    })
  }

  getAll(): Promise<Car[]> {
    return new Promise(resolve => {
      this._db.then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY, name TEXT, carNr TEXT, status INTEGER)', {})
          .then(e => console.log(e))
          .catch(e => console.log(e))
        db.executeSql('SELECT * FROM cars ORDER BY id ASC', {})
          .then(res => {
            var cars = []
            for (var i = 0; i < res.rows.length; i++) {
              cars.push({
                id: res.rows.item(i).id,
                name: res.rows.item(i).name,
                carNr: res.rows.item(i).carNr,
                status: res.rows.item(i).status
              })
            }
            return resolve(cars)
          })
          .catch(e => console.log(e))
      })
        .catch(e => console.log(e))
    })
  }

  delete(car): Promise<number> {
    return new Promise(resolve => {
      this._db.then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM cars WHERE id=?', [car.id]).then(() => {
          return resolve(-1)
        })
          .catch(e => console.log(e))
      })
        .catch(e => console.log(e))
    })
  }
}
