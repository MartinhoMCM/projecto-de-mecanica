import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector : 'graphic-modal',
    templateUrl:'./graphic-modal.html',
    styles :  [`
    img {
        width:100%;
        height: 100%;
        object-fit: cover;
    }
    button{
        height: 30px;
        width: 80px;
        font-size: 14px;
        background-color: #ee744d;
        color: white;
        border: none;
        outline: none;
    } `]
  
    
})
export class GraphicDialog {

    url:any; 
    constructor(
        public dialogRef : MatDialogRef<GraphicDialog>,
        @Inject (MAT_DIALOG_DATA) public data :string | ArrayBuffer | null
    ){
        console.log("data", typeof data);
        this.url = data;
        // data.onload = (_) =>{
        //     this.url = data.result;
        // }
    }

    onNoClick(): void {
        this.dialogRef.close()
    }
}