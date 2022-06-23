import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageSnippet, Model } from 'src/app/model/model';
import AnnotationPlugin, { AnnotationOptions, AnnotationPluginOptions } from "chartjs-plugin-annotation";
import { ServiceService } from 'src/app/service.service';
import { FileUploadService } from 'src/app/file-upload.service';
import { Form } from '@angular/forms';
import { DialogData } from '../menu/menu.component';
import { MatDialog } from '@angular/material/dialog';
import { GraphicDialog } from './graphic-modal';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.scss']
})
export class GraphicComponent implements OnInit, OnDestroy {

  @Input() analises : Model[] = new Input();
  analiseActual?: DialogData;
  ordenada:number  = 5;
  resultAnalises: number[] =[];
  dateAnalises: string[] = [];
  
  // Variable to store shortLink from api response
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file?: File ; // Variable to store file
  fileReader?:string | ArrayBuffer | null;
  isUploaded : boolean = false;

  isDescriptionSaved =false;
  descriptionText ='';

  isUploadImageShowed=false;
  
  public lineChartOptions: ChartConfiguration['options'];

  public lineChartData: ChartConfiguration['data'] ={
    datasets :[],
    labels: []
  };

  constructor(private service: ServiceService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog) {
    Chart.register(AnnotationPlugin);
   }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

    this.service.getOrdenada().subscribe((data)=>{
      this.ordenada = data;
      this.lineChartOptions = {
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            // We use this empty structure as a placeholder for dynamic theming.
            y: {
              stacked: true
            }
          },
      
          plugins: {
            legend: { display: true },
            annotation:{
              annotations:
              [
                {
                  type: 'line',
                  scaleID: 'y',
                  value: this.ordenada,
                  borderColor: 'red',
                  borderWidth: 3,
                  label: {
                    position: 'center',
                    enabled: true,
                    color: 'orange',
                    content: '',
                    font: {
                      weight: 'bold'
                    }
                  }
                },
              ]
            }
            
          }
        };
  
        });

    this.service.getAnaliseActual().subscribe((analiseActual)=>{
          this.analiseActual =analiseActual;
          this.getDescription();
    });
    this.service.getResultDataObservable(this.analiseActual!.nomeAnalise)
    .subscribe((resultado)=>{
      if(resultado.length ===0){
        this.resultAnalises =[];
        this.dateAnalises = [];
      }
      resultado.forEach((data)=>{
        this.resultAnalises.push(+data.result)
        this.dateAnalises.push(data.date.toString().substring(5,10))
      })
      this.setChartData();
    });
   
   this.fileUploadService.getImageUploaded(this.analiseActual).subscribe((file)=>{
       this.fileReader =file;
   });

  }

  openDialog(): void{
   
    if(this.file !== null && this.file !== undefined){
      var reader = new FileReader();
      reader.readAsDataURL(this.file!);
      reader.onload = (_)=>{
        const dialogRef = this.dialog.open( GraphicDialog, {
          width:'1000px',
          height: '800px',
          data : reader.result
        } );
        dialogRef.afterClosed().subscribe(result =>{
          console.log('The dialog was closed');
        });
      }
    }
    else{
      const dialogRef = this.dialog.open( GraphicDialog, {
        width:'1000px',
        height: '800px',
        data : this.fileReader
      } );
      dialogRef.afterClosed().subscribe(result =>{
        console.log('The dialog was closed');
      });
    }
  
      
  }

  setChartData(){
   // this.getResultObservable();
    this.lineChartData = {
      datasets: [
        {
          data:  this.resultAnalises,
          label: 'Gráfico',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        },      
      ],
      labels: this.dateAnalises
    };
  }
  getResultObservable() :void{
   this.service.getResultDataObservable(this.analiseActual!.nomeAnalise)
    .subscribe((resultado)=>{
      resultado.forEach((data)=>{
        this.resultAnalises.push(+data.result);
        this.dateAnalises.push(data.toString().substring(5,10))
      })
    });
    this.setChartData();
  }

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.datasets.length; i++) {
      for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
        this.lineChartData.datasets[i].data[j] = GraphicComponent.generateNumber(i);
      }
    }
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
   // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
   // console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = GraphicComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${ this.lineChartData.labels.length }`);

    this.chart?.update();
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'green';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(): void {
    if (this.lineChartData.labels) {
      this.lineChartData.labels[2] = [ '1st Line', '2nd Line' ];
    }

    this.chart?.update();
  }

  sortResultByDate(){
    var aux;
    for(let count=0; count<this.analises.length-1; count++){
      let date1 = new Date(this.analises[count].date);
      let date2 = new Date(this.analises[count+1].date);
      if((date1.getDate() - date2.getDate())>0){
         aux = this.analises[count+1];
         this.analises[count+1] = this.analises[count];
         this.analises[count] = aux;
      }
    }
  }

  getResult(): number []{
     this.analises.forEach((a)=>{
         this.resultAnalises.push(+a.result)
     });
     return this.resultAnalises;
  }

  getDate(){
    this.analises.forEach((a)=>{
       this.dateAnalises.push(a.date.toString().substring(5,10))
       
    })
    return this.dateAnalises;
  }

   // On file Select
   onChange(event:any) {
    this.file = event.target.files[0];
    this.loading =true
}

// OnClick of button Upload
onUpload() {
if(this.loading){
  this.onUploadFile();
}
else{
  this.fileUploadService.getImageUploaded(this.analiseActual).subscribe((source)=>{
    if(source != null){
     this.fileReader = source;
     this.openDialog();
    }
    // else{
    //   this.onUploadFile();
    // }
  })
}    
}

onUploadFile(){
  if(this.file !== undefined){
    this.isUploaded = true;
    this.isUploadImageShowed = true;

    var reader = new FileReader();
		reader.readAsDataURL(this.file!);

    reader.onload = (_)=>{
      this.fileUploadService.upload(reader.result, this.analiseActual).subscribe(
        (event: any) => {
            if (typeof (event) === 'object') {
  
                // Short link via api response
                this.shortLink = event.link;
  
                this.loading = false; // Flag variable 
            }
        }
    );
    }

 
  this.openDialog();
  }
}

saveDescricao(): void {
  if(this.descriptionText.length>0){
    this.service.saveDescription(this.analiseActual!.nomeAnalise,this.descriptionText);
    this.isDescriptionSaved=true;
    this.getDescription();
  }
  }

  getDescription(){
   this.descriptionText = this.service.getDescripton(this.analiseActual!.nomeAnalise);
   if(this.descriptionText.length>0){
    this.isDescriptionSaved=true;
   }
  }
  editDescricao(){
    this.isDescriptionSaved=false;
  }
}
