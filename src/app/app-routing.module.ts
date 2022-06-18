import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataInsertionComponent } from './component/data-insertion/data-insertion.component';

const routes: Routes = [
  {
    path: 'dados', component: DataInsertionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
