const {HOME} = require('../constants/directories');
const path = require('path');

const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join(HOME, 'database.sqlite')
	}
});

class MigrationSource {
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

  getMigration(migration) {
    switch(migration) {
      case 'migration1':
        return {
          up(knex)   {
            return knex.schema.createTable('cal_event', function(t) {
                  t.increments('id').unsigned().primary();
                  t.text('name').nullable();
                  t.text('date').nullable();
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
	constructor(){};

	static migrate(){
		knex.migrate.latest({migrationSource: new MigrationSource()});
	}

	async queryByDate(date){
		var data = [];
	  const result = knex.select(["id", "name", "date"]).from("cal_event").where('date', '=', date);
	  await result.then((rows) => {
	    data = rows;
	  })
	  return data;
	}

	async queryByMonthYear(date){
		var data = [];
		date = date.split("/");
		date = date[0]+"/"+date[1]+"/%";
		const result = knex.select([knex.raw('COUNT(date) as count'), "date"])
											  .from("cal_event")
												.where('date', 'like', date)
												.groupBy('date');
	  await result.then((rows) => {
	    data = rows;
	  })
		console.log("------>", date);
		console.log(data);
		return data;

	}

	async addEntry(args){
		var response = {};
		await knex("cal_event").insert([{name: args.entry, date: args.date}]).then((args)=>{
			response.success = true;
			response.id = args[0];
		})
		.catch(()=>{
			response.success = false;
			response.id = "";
		});
		return response;
	}

	async delEntry(args){
		var success;
		await knex("cal_event").where({id: args.id}).del().then(()=>{
			success = true;
		})
		.catch(()=>{
			success = false;
		});
		return success;
	}

	async updateEntry(args){
		var success;
		await knex("cal_event").where({id: args.id}).update({'name': args.entry}).then(()=>{
			success = true;
		})
		.catch(()=>{
			success = false;
		});
		return success;
	}

}


export default CalEvent;
