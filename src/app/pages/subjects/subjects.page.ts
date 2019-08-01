import { Component, OnInit,EventEmitter } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader , FileSelectDirective,FileLikeObject } from 'ng2-file-upload';

import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { createPipeInstance } from '@angular/core/src/view/provider';
//import { EventEmitter } from 'events';
const URL = 'http://209.188.90.190/~ashal/api/v1/crud/upload';
@Component({
  selector: 'app-form',
  templateUrl: './subjects.page.html',
  styleUrls: ['./subjects.page.scss'],
})
export class SubjectsPage implements OnInit {
  id:any;
  public hasBaseDropZoneOver: boolean = false;
  public myForm: FormGroup;
  submitted = false;
  statusSelect = 1;
  disabled = true;
  title;
  grades;
  gradeArr;
  stageArr;
  typeArr;
  table = 'subjects';
  Okay;
  alertHead;
  alertMsg;
  listData;
  showGrid = 0;
  filesUploaded='';
  imgUrl="http://209.188.90.190/~ashal/uploadFolder/original/";
  myFile;
  constructor(public global: GlobalService, public fm: FormBuilder, public crud: CrudProviderService, private alertController: AlertController, private route: ActivatedRoute, private router: Router, public translate: TranslateService) {
    /* For Upload */
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; 
      console.log('Files =>'+this.uploader.queue.length);
      
   
    };
    this.uploader.onCancelItem=(file)=>{file.withCredentials = false;console.log(' new Files =>'+this.uploader.queue.length)}
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('FileUpload:uploaded:', item, status, response);
        let result=JSON.parse(response)
        console.log(result['data']);
        this.myFile=result['data'].fileName;
        console.log("Img =>"+this.myFile)
                };
     this.uploader.onBeforeUploadItem = (file)=> {
      // logic of connecting url with the file
      //file.alias = 'http://localhost:3001/path/v1';
     this.uploader.options.additionalParameter = {"folder": 'original'};
    
     // alert(this.uploader.options);
      console.log(this.uploader.options)
      return {file};
    };
         /* End for Upload */
    this.title = 'Subjects';
    this.translate.get(this.title).subscribe((res: string) => {           
      this.global.title = res;
       });
    this.global.activeitem = 0;
    let stage = { whereStatement: 'stageActive = 1', page: 0, requestFields: 'stageId,stageName' + global.lang + ' as stageName' }
    this.crud.list('stages', '0', stage, 'stageArr').subscribe(results=>{
      this.stageArr=results['data'];
    });
    /* let orderBy = {  }
    this.crud.list('grades', '0', orderBy, 'gradeArr').subscribe(results=>{
      this.grades=results['data'];
    }); */
    this.typeArr = [{ 'id': 'general arabic', name: 'generalArabic' }, { 'id': 'private arabic', name: 'privateArabic' }, { 'id': 'general language', name: 'generallanguage' }, { 'id': 'private language', name: 'privatelanguage' }]
    this.buildForm();
 
   // this.crud.list('subjects', '0', '', '');
    let sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id && this.id != 'undefined' && this.id > 0) {
        this.disabled=false;
        let sendQ = { whereStatement: 'subjectId = ' + this.id, page: 0 }
        console.log(sendQ)
        this.crud.list(this.table, '0', sendQ, '').subscribe(results=>{
          this.listData=results['data'];
          this.buildFormModify();
        });
       
      }

    });

  }
/****For Upload  */
public uploader: FileUploader = new FileUploader({url: URL,
  disableMultipart : false,
  autoUpload: true,
  method: 'post',
  itemAlias: 'attachment',
  additionalParameter:{"folder":this.id,"requestNewFolder":'1'},
  allowedFileType: ['image'] });
  
  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    console.log(file);

  }
  getFiles(): FileLikeObject[] {
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  fileOverBase(ev): void {
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void {
    let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
  }
  /*****End for Upload */

  ngOnInit() {
    console.log(this.id)
   // console.log(this.crud.list);
   /*  setTimeout(() => {
      this.stageArr = this.crud.returnData['stageArr'];
      console.log(this.stageArr)

    }, 2000); */

    this.translate.get('sucess').subscribe((res: string) => {
      this.alertHead = res;
    });
    this.translate.get('suceeMsg').subscribe((res: string) => {
      this.alertMsg = res;
    });
    this.translate.get('ok').subscribe((res: string) => {
      this.Okay = res;
    });


    this.buildForm();
  }
  buildForm() {
    this.myForm = this.fm.group({
      name: ['', Validators.required],
      stage: ['', Validators.required],
      grade: ['', Validators.required],
      type: ['', Validators.required],
      monthly: ['0', Validators.required],
      semistar: ['0', Validators.required],

    });

  }
  buildFormModify() {
    let item = this.listData[0];
    this.myForm = this.fm.group({
      name: [item.subjectNameAr, Validators.required],
      stage: [item.subjectStageId, Validators.required],
      grade: [item.subjectGradeId, Validators.required],
      type: [item.subjectType, Validators.required],
      monthly: [item.subjectMonthlyFees, Validators.required],
      semistar: [item.subjectSemistarFees, Validators.required],
    });
    this.myFile=item.subjectIconFile;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.myForm)
    if (this.myForm.invalid) {
      return;
    }
    let data = {
      subjectNameAr: this.myForm.controls.name.value,
      subjectStageId:this.myForm.controls.stage.value,
      subjectGradeId: this.myForm.controls.grade.value,
      subjectType: this.myForm.controls.type.value,
      subjectMonthlyFees: this.myForm.controls.monthly.value,
      subjectSemistarFees: this.myForm.controls.semistar.value,
      subjectIconFile:this.myFile
    }
    console.log(data)
    //this.buildForm();
    if (!this.id)
      this.crud.Add(this.table, data).subscribe(results=>{
        console.log(results);
      });
    else
      this.crud.Update(this.table, 'subjectId', this.id, data).subscribe(results=>{
        console.log(results);
      });


    this.presentAlert();

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.alertHead,
      message: this.alertMsg,
      buttons: [{
        text: this.Okay,
        handler: () => {
          console.log('Confirm Okay');
          if (this.showGrid == 1)
            this.router.navigateByUrl('/Grid/Subjects');

          else this.router.navigateByUrl('/Subjects');
        }
      }]
    });

    await alert.present();


  }
  changeGrade($event) {
    this.disabled = true;
    let id = $event.detail.value;
    if(id!=''){
        let orderBy = { whereStatement: 'gradeStageId = ' + id }
        this.crud.list('grades', '0', orderBy, 'gradeArr').subscribe(results=>{
          this.grades=results['data'];
        });
    }
   /*  setTimeout(() => {
      this.grades = this.crud.returnData['gradeArr'];
      this.disabled = false;
    }, 2000); */

  }

}