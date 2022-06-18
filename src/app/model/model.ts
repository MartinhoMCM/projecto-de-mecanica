export class Model {

    public result?:string;
    public date?: string;

    constructor(result: string, date: string){
        this.result = result;
        this.date = date; 
    }

    getResult(){
        return this.date;
    }
    getDate(){
        return this.date;
    }


}