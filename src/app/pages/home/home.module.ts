import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
//import { PipeModule } from '../../pipes/pipes.module';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2FilterPipeModule,
    //PipeModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    Ng2GoogleChartsModule,
    TranslateModule.forChild()

  ],
  declarations: [HomePage]
})
export class HomePageModule {}
