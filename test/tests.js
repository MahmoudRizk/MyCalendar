import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
const expect = chai.expect;
const sinon = require("sinon");

chai.should()
chai.use(chaiAsPromised)

import {CalEvent, MigrationSource} from '../app/models/CalEvent';

const path = require('path');
const fs = require('fs');

const TEST_PATH = __dirname;

const knex = require("knex")({
	client: "sqlite3",
	connection: {
		filename: path.join(TEST_PATH, 'database_test.sqlite')
	}
});

describe("/app", function (){
  describe("/models", function(){
    describe("/CalEvent.js", function(){

      before(function() { // Creating testing Database.
        const testEntries = JSON.parse(fs.readFileSync(path.join(TEST_PATH, 'CalEvent_testEntries.json')));
        return new Promise((resolve) => {
          knex.migrate.latest({migrationSource: new MigrationSource()}).then(() => {
            knex('cal_event').insert(testEntries.entries).then(() => {
              resolve();
            });
          });
        });
      });

      after(function() {
        fs.unlinkSync(path.join(TEST_PATH, 'database_test.sqlite'));
      });

      describe("CalEvent", function(){

        const db = knex;
        const calEvent = new CalEvent(db);

        describe("queryByDate()", function() {
          it("Case 1: Handling valid Date format 'YYYY-MM-DD'", async function(){
            await calEvent.queryByDate({date: '1840-10-01'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '2019-01-25'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '1111-11-10'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '2000-05-23'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '3000-12-20'}).should.be.fulfilled;
          });
          it("Case 2: Handling invalid Date formats", async function(){
            await calEvent.queryByDate({date: '1840-100-01'}).should.be.rejected;
            await calEvent.queryByDate({date: '2019-0-25'}).should.be.rejected;
            await calEvent.queryByDate({date: '2000-1-1'}).should.be.rejected;
            await calEvent.queryByDate({date: '2000-005-283'}).should.be.rejected;
            await calEvent.queryByDate({date: '1999-20-50'}).should.be.rejected;
          });
          it("Case 3: Normal flow.", async function(){
            await calEvent.queryByDate({date: '2019-09-29'}).then((results) => {
              expect(Array.isArray(results)).to.be.true;
              results.map((res) => {
                expect(res).to.have.all.keys('id', 'date', 'value');
                expect(res.date.toString()).to.equal('2019-09-29');
              });
            });
          });
          it("Case 4: Handling date not in DataBase.", async function(){
            await calEvent.queryByDate({date: '1840-12-01'}).then((results) => {
              expect(Array.isArray(results)).to.be.true;
              expect(results.length).to.equal(0);
            });
          });
        });

        describe("queryByMonthYear()", function() {
          const testDate = '2019-09-29';
          const patternDate = testDate.match(/\d*-\d*-/)[0].concat('%');
          it("Case 1: Handling valid Date format 'YYYY-MM-DD'", async function(){
            await calEvent.queryByDate({date: '1840-10-01'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '2019-01-25'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '1111-11-10'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '2000-05-23'}).should.be.fulfilled;
            await calEvent.queryByDate({date: '3000-12-20'}).should.be.fulfilled;
          });
          it("Case 2: Handling invalid Date formats", async function(){
            await calEvent.queryByDate({date: '1840-100-01'}).should.be.rejected;
            await calEvent.queryByDate({date: '2019-0-25'}).should.be.rejected;
            await calEvent.queryByDate({date: '2000-1-1'}).should.be.rejected;
            await calEvent.queryByDate({date: '2000-005-283'}).should.be.rejected;
            await calEvent.queryByDate({date: '1999-20-50'}).should.be.rejected;
          });
          it("Case 3: Normal flow, entries of same month & year.", async function(){
            await calEvent.queryByMonthYear({date: '2019-09-29'}).then((results) => {
              expect(Array.isArray(results)).to.be.true;
              results.map((res) => {
                expect(res).to.have.all.keys('count', 'date');
                expect(res.date.toString().match(/\d*-\d*-/)[0].concat('%')).to.equal('2019-09-%');
              });
            });
          });
        });

        describe("addEntry()", function(){
          const entry = {date:"2015-05-15", value:"blablabla"};
          const badEntry = {date:"2015-05-15", value:""}
          it("Case 1: Passing single entry", async function(){
            await calEvent.addEntry(entry).should.be.fulfilled;
          });
          it("Case 2: Passing list of entries", async function(){
            await calEvent.addEntry([entry]).should.be.fulfilled;
          });
          it("Case 3: Passing invalid entry", async function(){
            await calEvent.addEntry(badEntry).should.be.rejected;
          });
          it("Case 4: Passing invalid list of entries", async function(){
            await calEvent.addEntry([badEntry]).should.be.rejected;
          });
          it("Case 5: Checking returned id.", async function(){
            await calEvent.addEntry(entry).then((args) => {
              expect(typeof args.id === 'number').to.be.true;
              expect(args.success).to.be.true;
            });
          });
        });

        describe("delEntry()", function(){
          const trueId = {id: "2"};
          const falseId = {id: "8888888"};
          it("Case 1: Passing true id.", async function(){
            await calEvent.delEntry(trueId).should.be.fulfilled.and.eventually.equal(1);
          });
          it("Case 2: Passing false id.", async function(){
            await calEvent.delEntry(falseId).should.be.fulfilled.and.eventually.equal(0);
          });
        });

        describe("updateEntry()", function(){
          const trueId = {id: "3", value:"abc test"};
          const falseId = {id: "8888888", value:"xyz test"};
          it("Case 1: Passing true id.", async function(){
            await calEvent.updateEntry(trueId).should.be.fulfilled.and.eventually.equal(1);
          });
          it("Case 2: Passing false id.", async function(){
            await calEvent.updateEntry(falseId).should.be.fulfilled.and.eventually.equal(0);
          });
        });
      });
    });
  });
});
