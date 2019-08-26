import { Component, OnInit,EventEmitter } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { AlertController,ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader , FileSelectDirective,FileLikeObject } from 'ng2-file-upload';

import {Md5} from 'ts-md5/dist/md5'
import { LoadingController } from '@ionic/angular';

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
  filesUploaded='';
  myFiles:any[] = [];
  filesAttach;

  myDate = new Date(); 
  imgUrl="http://ionicadmin.hybapps.com/uploadFolder/original/";
 
  usePicker;selectedImage;
  minDate;
  maxDate;
  public editorOptions = {
   toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
    
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
    
       
    
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        
        [{ 'align': [] }],

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
      
      ]
    
  };
  
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
  loaderToShow: any;
  constructor(public global: GlobalService,public fm: FormBuilder, public crud: CrudProviderService, private alertController: AlertController, private route: ActivatedRoute, private router: Router, public translate: TranslateService,private file: File,private filePath: FilePath,private webview: WebView, public modalController: ModalController,public loadingController: LoadingController) { 
    /* For Upload */
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; 
      console.log('Files =>'+this.uploader.queue.length);
    console.log(this.uploader.queue)
   
    };

    this.uploader.onCancelItem=(file)=>{file.withCredentials = false;
      console.log(' new Files =>'+this.uploader.queue.length)}

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('FileUpload:uploaded:', item, status, response);
        let result=JSON.parse(response)
              if(this.filesUploaded!='')this.filesUploaded+=',';
            this.filesUploaded+=result.data.fileName;
            let check =this.filesUploaded.split(',');
            this.myFiles.push(result.data.fileName)

                console.log(this.filesUploaded)
                console.log(this.myFiles)
                //this.myFiles.push(result.data.fileName)
            if(check.length==this.uploader.queue.length)
            {
                console.log('Finish Upload')
           
            }
     };
     this.uploader.onBeforeUploadItem = (file)=> {
     
  //   this.uploader.options.additionalParameter = {"folder": this.id,"requestNewFolder":'1'};
    
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



/****For Upload  */
public uploader: FileUploader = new FileUploader({url: URL,
  disableMultipart : false,
  autoUpload: true,
  method: 'post',
  itemAlias: 'attachment',
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
  removeFile(i,events)
  {
    let index=this.myFiles.indexOf(i);
    console.log("I=>"+i);
    console.log(events)
    console.log(index);
    this.uploader.queue.splice(index-1,1);
    this.myFiles.splice(index-1,1);
  }
  /*****End for Upload */
  ngOnInit() {
    console.log(this.id)
  
    var month=this.myDate.getMonth()+1;
    let YY=this.myDate.getFullYear();
    if(month<9)var thismonth=('0'+month).toString();
    else var thismonth=(month).toString();
    this.minDate=YY+'-'+thismonth+'-01';
    this.maxDate=YY+'-'+thismonth+'-30';
    console.log('Min'+this.minDate+'Max =>'+this.maxDate)
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
ionViewWillEnter()
{
  this.showLoader()
}
showLoader() {
  this.loaderToShow = this.loadingController.create({
    message: 'Loading page please wait ....'
  }).then((res) => {
    res.present();

    res.onDidDismiss().then((dis) => {
      console.log('Loading dismissed!');
    });
  });
  this.hideLoader();
}

hideLoader() {
  setTimeout(() => {
    this.loadingController.dismiss();
  }, 2000);
}
buildForm()
{
 this.myForm = this.fm.group({
   name: ['', Validators.required],
   detail: new FormControl('this is initial content'),//['this is initial content'],
   newsDate: [this.myDate, Validators.required],
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
  let files=item.newsFiles.split(',');
  for(let i=0;i<files.length;i++)
     this.myFiles.push(files[i]);
  //this.myFiles=item.newsFiles;
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
   newsFiles:this.filesUploaded
 }

if(!this.id){
     this.crud.Add(this.table,data).subscribe(data=>{
       console.log(data)
     });
   }
else{
  
   this.crud.Update(this.table,'newsId',this.id,data).subscribe(data=>{
     console.log(data);
   }); 
 }
 if(this.showGrid==1)
 this.router.navigateByUrl('/Grid/news');

else   {if(!this.id)this.buildForm(); else this.router.navigateByUrl('/news');}
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
