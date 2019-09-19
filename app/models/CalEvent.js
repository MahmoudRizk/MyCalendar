const path = require('path');
const homedir = require('os').homedir();
const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join(homedir, 'database.sqlite')
	}
});

export class CalEvent{
	constructor(){};

	async queryByDate(date){
		var data = [];
	  const result = knex.select(["id", "name", "date"]).from("test").where('date', '=', date);
	  await result.then((rows) => {
	    data = rows;
	  })
	  return data;
	}

	async addEntry(args){
		var success;
		await knex("test").insert([{name: args.entry, date: args.date}]).then(()=>{
			success = true;
		})
		.catch(()=>{
			success = false;
		});
		return success;
	}

	async delEntry(args){
		var success;
		await knex("test").where({id: args.id}).del().then(()=>{
			success = true;
		})
		.catch(()=>{
			success = false;
		});
		return success;
	}

	async updateEntry(args){
		var success;
		await knex("test").where({id: args.id}).update({'name': args.entry}).then(()=>{
			success = true;
		})
		.catch(()=>{
			success = false;
		});
		return success;
	}

}


export default CalEvent;
