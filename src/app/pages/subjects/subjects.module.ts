import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { SubjectsPage } from './subjects.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    Ng2FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: SubjectsPage
      },
      {
       path: ':id',
       component: SubjectsPage
     }
    ]),
    Ng2GoogleChartsModule,
    TranslateModule.forChild()

  ],  /* GridPage, */
  declarations: [SubjectsPage]
})
export class SubjectsPageModule {}
