import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular'; 

import { GridPage } from './grid.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

const routes: Routes = [
  {
    path: '',
    component: GridPage
  },
  {
    path: ':id',
    component: GridPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2FilterPipeModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [GridPage]
})
export class GridageModule {}
