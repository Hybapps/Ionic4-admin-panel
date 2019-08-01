import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';

import { CitiesPage } from './cities.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  imports: [
    CommonModule,IonicSelectableModule,
    IonicModule,
    Ng2FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: CitiesPage
      },
      {
       path: ':id',
       component: CitiesPage
     }
    ]),
    Ng2GoogleChartsModule,
    TranslateModule.forChild()

  ],  /* GridPage, */
  declarations: [CitiesPage]
})
export class CitiesPageModule {}
