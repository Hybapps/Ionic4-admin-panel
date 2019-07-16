import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { GovernatePage } from './governate.page';
//import { FormPage } from './form/form.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    Ng2FilterPipeModule,
    FormsModule,
    ReactiveFormsModule,
    //PipeModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: GovernatePage
      },
       {
        path: ':id',
        component: GovernatePage
      }
    ]),
    Ng2GoogleChartsModule,
    TranslateModule.forChild()

  ],
  declarations: [GovernatePage]
})
export class GovernatePageModule {}
