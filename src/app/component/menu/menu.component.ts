import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface DialogData {
  nomeAnalise: string;
  unidadeAnalise: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  nomeAnalise?: string;
  unidadeAnalise?: string;
  newAnalise?: DialogData;


  analises: DialogData[] = [
    {
    nomeAnalise:'Análise de óleo',
    unidadeAnalise: 'm3'
  }, 
  {
    nomeAnalise:'Análise de viscosidade',
    unidadeAnalise: 'v'
  },
  {
    nomeAnalise:'Análise de densidade',
    unidadeAnalise: 'd'
  }
  ];

  itemMenuSelected = 0;
  analiseActual =this.analises[0];

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) {
   
  }

  ngOnInit(): void {
      
   if(this.getCurrentData()!=null){
    this.analises = this.getCurrentData();
    console.log("analises ", this.analises);
    if(!(this.analises.length>=0)){
      this.analises =[
        {
        nomeAnalise:'Análise de óleo',
        unidadeAnalise: 'm3'
      }, 
      {
        nomeAnalise:'Análise de viscosidade',
        unidadeAnalise: 'v'
      },
      {
        nomeAnalise:'Análise de densidade',
        unidadeAnalise: 'd'
      }
      ]
    localStorage.setItem('analises', JSON.stringify(this.analises));
    }
   }

   //Obter Analise Actual 
  if(localStorage.getItem('analiseActual')){
    this.analiseActual = JSON.parse(localStorage.getItem('analiseActual')??'') as DialogData;
    console.log("Analise Actual ", this.analiseActual);
    
    
  }
  }

  getClass(): string{
    return 'active';
  }
  
 navigateToNextPage() : void{
  this.router.navigate(['chat'])
 }

  changeMenuItem(position: number): void{
    this.itemMenuSelected = position;
    this.analiseActual =this.analises[position];
    this.reloadWindows();
  }

  reloadWindows(){
    localStorage.removeItem('analiseActual');
    localStorage.setItem('analiseActual', JSON.stringify(this.analiseActual));
    location.reload();
  }

  adicionarAnalise(novaAnalise: DialogData){
  if (novaAnalise.nomeAnalise !=null && novaAnalise.nomeAnalise.length >= 0) {
    let data = this.getCurrentData();
    data.push(
      novaAnalise
    )
  localStorage.removeItem('analises');
  localStorage.setItem('analises', JSON.stringify(data));
  this.analises = data;
  }
}
  getCurrentData(): Array<DialogData>{
    let data: any;
    if(localStorage.getItem("analises")){
      data = JSON.parse(localStorage.getItem("analises")??'') as Array<DialogData>;
    }
    else{
     data =this.analises;
    }
    
    return data;
  }

  getData(){
    let data = this.getCurrentData;

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {nomeAnalise: this.nomeAnalise, unidadeAnalise: this.unidadeAnalise},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      this.adicionarAnalise(result)
    });
  }
  
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
