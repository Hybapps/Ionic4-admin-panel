import { Component, OnInit,EventEmitter } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { AlertController,ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {Md5} from 'ts-md5/dist/md5'
import { FileUploader , FileSelectDirective,FileLikeObject } from 'ng2-file-upload';

import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { createPipeInstance } from '@angular/core/src/view/provider';
//import { EventEmitter } from 'events';
const URL = 'http://ionicadmin.hybapps.com/api/v1/crud/upload';

@Component({
  selector: 'app-form',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
appPage:any[]=[];
public myForm: FormGroup;
  id:any;
  public hasBaseDropZoneOver: boolean = false;
  myDate = new Date(); 
  imgUrl="http://ionicadmin.hybapps.com/uploadFolder/original/";
  filesUploaded='';
  myFiles:any[] = [];
  usePicker;selectedImage;
  minDate;
  maxDate;
  editorContent="My text goes here";
  public editorOptions = {
    placeholder: "insert content..."
  };
  copy:any[]=[];
  down:any[]=[];
  filesAttach;
  mode=0;
  submitted = false;
  statusSelect=1;
  title;
  subjArr;
  typeArr;
  table='news';
  Okay;
  alertHead;
  alertMsg;
  showGrid=0;
  listData;
  selected:any=1;
  genderType:any=0;
 
  constructor(public global: GlobalService,public fm: FormBuilder, public crud: CrudProviderService, private alertController: AlertController, private route: ActivatedRoute, private router: Router, public translate: TranslateService,private file: File,private filePath: FilePath,private webview: WebView, public modalController: ModalController) { 
    /* For Upload */
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; 
      console.log('Files =>'+this.uploader.queue.length);
    //  this.copy[this.uploader.queue.length-1]=true;
    //  this.down[this.uploader.queue.length-1]=true;
   
    };
    this.uploader.onCancelItem=(file)=>{file.withCredentials = false;
      console.log(' new Files =>'+this.uploader.queue.length)}
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('FileUpload:uploaded:', item, status, response);
        let result=JSON.parse(response)
              if(this.filesUploaded!='')this.filesUploaded+=',';
            this.filesUploaded+=result.data.fileName;
            let check =this.filesUploaded.split(',');

            console.log('-----------');
            console.log(this.uploader.queue+" ***")
            console.log(check)
            console.log(this.filesUploaded+"  length =>"+this.uploader.queue.length);
            console.log('-----------');
            if(check.length==this.uploader.queue.length)
            {
                console.log('Finish Upload')
            // this.submitData();
         //   this.filesAttachAdd()
            }
     };
     this.uploader.onBeforeUploadItem = (file)=> {
      // logic of connecting url with the file
      //file.alias = 'http://localhost:3001/path/v1';
  //   this.uploader.options.additionalParameter = {"folder": this.id,"requestNewFolder":'1'};
    
     // alert(this.uploader.options);
      console.log(this.uploader.options)
      return {file};
    };
         /* End for Upload */
    console.log(this.global.pages)
    this.title='News';
    this.translate.get(this.title).subscribe((res: string) => {           
      this.global.title = res;
       });
    this.global.activeitem=0;
  
        this.buildForm();
      
        let sub = this.route.params.subscribe(params => {
          this.id = params['id']; 
          if(this.id && this.id !='undefined' && this.id >0)
          {
            let sendQ={whereStatement:'newsId = '+this.id,page:0}
            console.log(sendQ)
            this.crud.list(this.table,'0',sendQ,'').subscribe(result=>{
              this.listData=result['data'];
              this.buildFormModify();
            });
           
          }
      });
   
  }


filesAttachAdd()
{
 // if(this.mode==0)
  var files=this.filesUploaded.split(',');
  //  else { let lessonAttach=this.filesUploaded+','+this.myFiles;
 // var files=files=lessonAttach.split(',');
 // }
 var filesData=[];
  for(let i=0;i<files.length;i++)
  {
     filesData[i]={
      lessonAttachLesson:this.id,
      lessonAttachMode:0,
      lessonAttachFile:files[i],
      lessonAttachDownload:this.down[i],
      lessonAttachCopy:this.copy[i]
    };
    
  }
  this.crud.bulk('lessonAttach',filesData).subscribe(results=>{
    console.log('results')
  });
  if(this.mode==1)//Update
  {
    for(let i=0;i<this.filesAttach;i++)
   {
        let filesData={
          lessonAttachLesson:this.id,
          lessonAttachMode:0,
          lessonAttachFile:this.filesAttach[i]['lessonAttachFile'],
          lessonAttachDownload:this.filesAttach[i]['lessonAttachDownload'],
          lessonAttachCopy:this.filesAttach[i]['lessonAttachCopy'],
        }
        this.crud.Add('lessonAttach',filesData).subscribe(results=>{
          console.log('results')
        });
  }
}
      if(this.showGrid==1)
                  this.router.navigateByUrl('/Grid/news');

            else   {if(!this.id)this.buildForm(); else  this.router.navigateByUrl('/Lessons');
              console.log(this.uploader.queue.length)
            for(let i=0;i<this.uploader.queue.length;i++){
              this.uploader.queue[i].remove();
            }
            this.filesAttach=[];
          }
    //this.presentAlert();
}
/****For Upload  */
public uploader: FileUploader = new FileUploader({url: URL,
  disableMultipart : false,
  autoUpload: true,
  method: 'post',
  itemAlias: 'attachment',
 // additionalParameter:{"folder":this.id,"requestNewFolder":'1'},
  allowedFileType: ['image', 'pdf'] });
  
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
buildForm()
{
 this.myForm = this.fm.group({
   name: ['', Validators.required],
   detail: new FormControl('this is initial content'),//['this is initial content'],
   newsDate: ['', Validators.required],
   options: new FormControl('1')
});

}
buildFormModify()
{
 let item=this.listData[0];
 this.selected=item.adminActive;
 
 this.myForm = this.fm.group({
   name: [item.newsTitleAr, Validators.required],
   detail: [item.newsDescAr, [Validators.required]],
   newsDate: [item.newsDate, Validators.required],
   
   options: [item.newsActive, Validators.required]
   
});

}

onSubmit() {
  this.submitted = true;
 console.log(this.myForm)
 if (this.myForm.invalid) {
     return;
 }
 
 var data={
   newsTitleAr:this.myForm.controls.name.value,
   newsTitleEn:this.myForm.controls.name.value,
   newsDescAr:this.myForm.controls.detail.value,
   newsDescEn:this.myForm.controls.detail.value,
   newsActive:this.myForm.controls.options.value,
   newsFile:this.file
 }

if(!this.id){
  data['adminPW']=Md5.hashStr(this.myForm.controls.pass.value);
     this.crud.Add(this.table,data).subscribe(data=>{
       console.log(data)
     });
   }
else{
  if(this.myForm.controls.pass.value!='')
         data['adminPW']=Md5.hashStr(this.myForm.controls.pass.value);
   this.crud.Update(this.table,'adminId',this.id,data).subscribe(data=>{
     console.log(data);
   }); 
 }
 if(this.showGrid==1)
 this.router.navigateByUrl('/Grid/Admins');

else   {if(!this.id)this.buildForm(); else this.router.navigateByUrl('/Admins');}
// this.presentAlert();

  

}

async presentAlert() {
const alert = await this.alertController.create({
 header:this.alertHead,
 message: this.alertMsg,
 buttons: [ {
   text: this.Okay,
   handler: () => {
     console.log('Confirm Okay');
     if(this.showGrid==1)
          this.router.navigateByUrl('/Grid/Teachers');

   else   this.buildForm();// this.router.navigateByUrl('/Schools/add');// this.router.navigate(['/Schools/add']);

   }
 }]
});

await alert.present();


}

}
