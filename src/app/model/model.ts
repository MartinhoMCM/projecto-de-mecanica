export class Model {

    public result:string;
    public date: Date;

    constructor(result: string, date: Date){
        this.result = result;
        this.date = date; 
    }

    getResult(){
        return this.result
    }
    getDate(){
        return this.date;
    }


}
export class ImageSnippet {
    constructor(public src: string, public file: File) {}
  }