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
	  const result = knex.select(["id", "name", "date"]).from("cal_event").where('date', '=', date);
	  await result.then((rows) => {
	    data = rows;
	  })
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
