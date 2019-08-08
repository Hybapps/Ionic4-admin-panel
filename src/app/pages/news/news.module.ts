import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { FileUploadModule } from 'ng2-file-upload';
import { NewsPage } from './news.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: NewsPage
  },
  {
    path: ':id',
    component: NewsPage
  }
];
@NgModule({
  imports: [
    CommonModule,FileUploadModule,
    FormsModule,ReactiveFormsModule,
    FontAwesomeModule,
    IonicModule,
    QuillModule.forRoot({
      modules: {
        syntax: true
      }
    }),
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [NewsPage]
})
export class NewsPageModule {}
