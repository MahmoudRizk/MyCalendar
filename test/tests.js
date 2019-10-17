const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const moment = require('moment');

import {CalEvent} from '../app/models/CalEvent';


describe("/app", function (){
  describe("/models", function(){
    describe("/CalEvent.js", function(){
      describe("CalEvent", function(){

        const DataBase = function(name){ //fake Knex object.
          this.select = function(args){return this};
          this.from = function(args){return this};
          this.where = function(args){return this};
          this.groupBy = function(args){return this};
          this.raw = function(args){return this};
          this.insert = function(args){return this};
          this.into = function(args){return this};
          this.del = function(args){return this};
          this.update = function(args){return this};
          this.then = function(args){return this};
          this.catch = function(args){return this};
        };

        describe("queryByDate()", function() {
          const db = new DataBase();

          const select = sinon.spy(db, 'select');
          const from = sinon.spy(db, 'from');
          const where = sinon.spy(db, 'where');

          const calEvent = new CalEvent(db);
          const testDate = moment(new Date()).format('YYYY-MM-DD');

          calEvent.queryByDate({date: testDate});

          it("test1: db is called.", function(){
            expect(select.called).to.be.true;
            expect(from.called).to.be.true;
            expect(where.called).to.be.true;
          });

          it("test2: db is called with correct arguments.", function(){
            expect(select.getCall(0).calledWith(["id", "value", "date"])).to.be.true;
            expect(from.getCall(0).calledWith("cal_event")).to.be.true;
            expect(where.getCall(0).calledWith("date", "=", testDate)).to.be.true;
          });

        });

        describe("queryByMonthYear()", function() {
          const db = new DataBase();

          const select = sinon.spy(db, 'select');
          const from = sinon.spy(db, 'from');
          const where = sinon.spy(db, 'where');
          const groupBy = sinon.spy(db, 'groupBy');
          const raw = sinon.spy(db, 'raw');

          const calEvent = new CalEvent(db);

          const testDate = moment(new Date()).format('YYYY-MM-DD');
          const patternDate = testDate.match(/\d*-\d*-/)[0].concat('%');
          calEvent.queryByMonthYear({date: testDate});

          it("test1: db is called.", function(){
            expect(select.called).to.be.true;
            expect(from.called).to.be.true;
            expect(where.called).to.be.true;
            expect(groupBy.called).to.be.true;
            expect(raw.called).to.be.true;
          });

          it("test2: db is called with correct arguments.", function(){
            expect(select.getCall(0).calledWith([raw.getCall(0).thisValue, "date"])).to.be.true;
            expect(from.getCall(0).calledWith("cal_event")).to.be.true;
            expect(where.getCall(0).calledWith("date", "like", patternDate)).to.be.true;
            expect(groupBy.getCall(0).calledWith("date")).to.be.true;
            expect(raw.getCall(0).calledWith("COUNT(date) as count")).to.be.true;
          });

        });

        describe("addEntry()", function(){
          const db = new DataBase();

          const insert = sinon.spy(db, 'insert');
          const into = sinon.spy(db, 'into');

          const calEvent = new CalEvent(db);
          const args = sinon.fake();
          const argsList = [sinon.fake()];

          calEvent.addEntry(args);
          calEvent.addEntry(argsList);

          it("test1: db is called.", function(){
            expect(insert.called).to.be.true;
            expect(into.called).to.be.true;
          });

          it("test2: db is called with correct arguments.", function(){
            expect(insert.getCall(0).calledWith([args])).to.be.true;
            expect(into.getCall(0).calledWith("cal_event")).to.be.true;
            expect(insert.getCall(1).calledWith(argsList)).to.be.true;
          });

        });

      });
    });
  });

});
