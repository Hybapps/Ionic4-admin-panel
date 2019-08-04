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
import { Country } from '../../types';
import { IonicSelectableComponent } from 'ionic-selectable';

//import { EventEmitter } from 'events';
const URL = 'http://209.188.90.190/~ashal/api/v1/crud/upload';
@Component({
  selector: 'app-form',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})
export class CitiesPage implements OnInit {
  id:any;
  public hasBaseDropZoneOver: boolean = false;
  public myForm: FormGroup;
  country: Country[];

  submitted = false;
  statusSelect = 1;
  disabled = true;
  title;
  grades;
  table = 'cities';
  Okay;
  alertHead;
  alertMsg;
  listData;
  showGrid = 0;
  filesUploaded='';
  imgUrl="http://209.188.90.190/~ashal/uploadFolder/original/";
  myFile;
  countries;
  govs;
  portControl: FormControl;
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
    this.title = 'Cities';
    this.translate.get(this.title).subscribe((res: string) => {           
      this.global.title = res;
       });
      
    this.global.activeitem = 0;
   
   
    this.buildForm();
 
   // this.crud.list('subjects', '0', '', ''); 
    let sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id && this.id != 'undefined' && this.id > 0) {
        this.disabled=false;
        let sendQ = { whereStatement: 'cityId = ' + this.id, page: 0 }
        console.log(sendQ)
        this.crud.list(this.table, '0', sendQ, '').subscribe(results=>{
          this.listData=results['data'];
          console.log(this.listData)

          this.getGov(this.listData[0].cityCountry)
        //  this.buildFormModify();
        });
       
      }

    });
    let countryQuery={whereStatement:"status=1",pageSize:'-1'};

    this.crud.list('countries','-1',countryQuery,'').subscribe(result=>{
     this.countries=result['data'];
     if(!this.id)
     this.getGov(this.countries[0].id)
     console.log(this.countries)
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
  getGov(id)
  {
    let govQuery={whereStatement:"govActive=1 AND govCountryId="+id,pageSize:'-1'};

           this.crud.list('governments','-1',govQuery,'').subscribe(result=>{
            this.govs=result['data'];
            console.log(this.govs);
            if(this.id)
           { console.log('ID =>'+this.id)
           this.buildFormModify();
           }
           });
  }
  buildForm() {
    this.myForm = this.fm.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      gov: ['', Validators.required],
      options: [true, Validators.required]

    });

  }
  countryChange(event: {
    countryChange: IonicSelectableComponent,
    value: any
  }) {
   // let port = event.value;
   console.log(event.value.id)
   this.getGov(event.value.id)
  }
  buildFormModify() {
    let item = this.listData[0];
    let countryItem = this.countries.filter((filter) =>
    {
      return filter.id==item.cityCountry;
    })
    let govItem = this.govs.filter((filter2) =>
    {console.log(filter2)
      return filter2.govId == item.cityGov;
    })
    console.log(countryItem);
    console.log(govItem)
    this.myForm = this.fm.group({
      name: [item.cityNameAr, Validators.required],
      country: [countryItem[0], Validators.required],
      gov: [govItem[0], Validators.required],
      options: [item.cityActive, Validators.required]
    });
    this.myFile=item.cityAttach;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.myForm)
    if (this.myForm.invalid) {
      return;
    }
    
    let data = {
      cityNameAr: this.myForm.controls.name.value,
      cityNameEn: this.myForm.controls.name.value,
      cityCountry:this.myForm.controls.country.value.id,
      cityGov: this.myForm.controls.gov.value.govId,
      cityActive: this.myForm.controls.options.value,
      cityAttach:this.myFile
    }
    console.log(data)
    //this.buildForm();
    if (!this.id)
      this.crud.Add(this.table, data).subscribe(results=>{
        console.log(results);
      });
    else
      this.crud.Update(this.table, 'cityId', this.id, data).subscribe(results=>{
        console.log(results);
      });

      if (this.showGrid == 1)
      this.router.navigateByUrl('/Grid/Cities');

    else this.router.navigateByUrl('/Cities');
  //  this.presentAlert();

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

}