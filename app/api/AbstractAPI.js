export class AbstractAPI{
  constructor(){
    if(this.authorize === undefined){
      throw new TypeError("authenticate function is not implemented.");
    }
    if(this.fetchData === undefined){
      throw new TypeError("fetchData function is not implemented.");
    }
  }
  /*This class is an abstract class, so when extending it these functions must be implemented*/
  /*
    authorize();
    fetchData();
  */
}

export default AbstractAPI;
