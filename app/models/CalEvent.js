const {HOME} = require('../constants/directories');
const path = require('path');

const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join(HOME, 'database.sqlite')
	}
});

export class MigrationSource {
  constructor(){};
  // Must return a Promise containing a list of migrations.
  // Migrations can be whatever you want, they will be passed as
  // arguments to getMigrationName and getMigration
  getMigrations() {
    // In this example we are just returning migration names
    return Promise.resolve(['migration1'])
  }

  getMigrationName(migration) {
    return migration;
  }

  getMigration(migration){
    switch(migration) {
      case 'migration1':
        return {
          up(knex)   {
            return knex.schema.createTable('cal_event', function(t) {
                  t.increments('id').unsigned().primary();
                  t.text('value').notNullable();
                  t.text('date').notNullable();
              });
          },
          down(knex) {
            return knex.schema.dropTable('cal_event');
          }
        };
    }
  }
}

export class CalEvent{
	constructor(db=knex){
		this.db = db;
	};

	static migrate(){
		knex.migrate.latest({migrationSource: new MigrationSource()});
	}

	_checkValid(date){
		if(date.toString().match(/^\d*-\d\d-\d\d$/))
			if(parseInt(date.toString().split('-')[1]) <= 12)
				if(parseInt(date.toString().split('-')[2]) <= 31)
					return true;

		return false;
	}

  queryByDate(args){
		return new Promise((resolve, reject) => {
			if(!this._checkValid(args.date.toString()))
				reject(throw new Error('Invalid date format.'));
			this.db.select(["id", "value", "date"]).from("cal_event").where('date', '=', args.date)
			.then((rows) => {
				resolve(rows);
		  })
			.catch((err) => {
				reject(err);
			});
		});
	}

	queryByMonthYear(args){
		return new Promise((resolve, reject) => {
			if(!this._checkValid(args.date.toString()))
				reject(throw new Error('Invalid date format.'));
			const date = args.date.match(/\d*-\d*-/)[0].concat('%');
			this.db.select([this.db.raw('COUNT(date) as count'), "date"])
		   .from("cal_event").where('date', 'like', date).groupBy('date').then((rows) => {
			 	 resolve(rows);
		   }).catch((err) => {
				 reject(err);
			 });
		});
	}

	addEntry(args){
		let response = {};
		let entries = [];

		if(args.length)
			entries = args;
		else
			entries = [args];

		return new Promise((resolve, reject) => {
			entries.map((it) => {
				if(!this._checkValid(it.date.toString()) || !it.value)
					reject(throw new Error('Invalid entry format'));
			})
			this.db.insert(entries).into('cal_event').then((args)=>{
				response.success = true;
				response.id = args[0];
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	delEntry(args){
		return new Promise((resolve, reject) => {
			this.db.from("cal_event").where({id: args.id}).del().then((args)=>{
				resolve(args);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}

	updateEntry(args){
		return new Promise((resolve, reject) => {
			this.db.from("cal_event").where({id: args.id}).update({'value': args.value}).then((args)=>{
				resolve(args);
			})
			.catch((err) => {
				reject(err);
			});
		});
	}
}


export default {CalEvent, MigrationSource};
