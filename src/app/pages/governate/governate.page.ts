import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import {FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { AlertController,ToastController  } from '@ionic/angular';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form',
  templateUrl: './governate.page.html',
  styleUrls: ['./governate.page.scss'],
})
export class GovernatePage implements OnInit {
  public myForm: FormGroup;
  id:any;
  submitted = false;
  statusSelect=1;
  title;
  showGrid=0;
  Okay;
  alertHead;
  alertMsg;
  toast: any;
  listData;
  selected:any=1;
  constructor(public global: GlobalService,public fm: FormBuilder,public crud: CrudProviderService,private alertController:AlertController,private route: ActivatedRoute,private router: Router,public translate: TranslateService, public toastController: ToastController) { 
        this.title='Governaments';
        this.translate.get(this.title).subscribe((res: string) => {           
          this.global.title = res;
           });
        this.global.activeitem=0;
        this.buildForm();
        let sub = this.route.params.subscribe(params => {
          this.id = params['id']; 
          if(this.id && this.id !='undefined' && this.id >0)
          {
            let sendQ={whereStatement:'govId = '+this.id,page:0}
            console.log(sendQ)
            this.crud.list('governments','0',sendQ,'').subscribe(result=>{
              this.listData=result['data'];
              this.buildFormModify();
            });
           
              console.log(this.listData);
           
        
          }
       
      });
     
  }

  ngOnInit() {
    this.translate.get('sucess').subscribe((res: string) => {           
      this.alertHead = res;
       });
       this.translate.get('suceeMsg').subscribe((res: string) => {           
        this.alertMsg = res;
         });
         this.translate.get('ok').subscribe((res: string) => {           
          this.Okay = res;
           });
   
      console.log(this.id)
      //this.id = this.navParams.data.id;
      /*   if(this.id && this.id !='undefined' && this.id >0)
        {
            
              setTimeout( () => {
                console.log(this.crud.listData);
                this.buildFormModify();
            }, 1000);
          
            }else{ */
            // this.buildForm();
        // }
  }
  ionViewDidLoad()
  {
    console.log('Ion View Did Load');
   
  }
  //get f() { return this.myForm.controls; }

  buildForm()
  {
    this.myForm = this.fm.group({
      name: ['', Validators.required]/*,
      options: new FormControl('1')*/
   });

  }
  buildFormModify()
  {
    let item=this.listData[0];
    console.log(this.listData)
    this.selected=item.govActive;
    this.myForm = this.fm.group({
      name: [item.govNameAr, Validators.required]/*,
      options: [item.govActive]*/
   });

  }

  onSubmit() {
    // elshamhout
    //console.log(val,this.myForm); 
      this.submitted = true;
      let data={
       govNameEn:this.myForm.controls.name.value,
       govNameAr:this.myForm.controls.name.value,
       govActive:this.selected
     }
     console.log(this.myForm) 
     if (this.myForm.invalid) {
         return;
     }
        this.buildForm(); 
    if(!this.id)
         this.crud.Add('governments',data).subscribe(data=>{
          console.log(data)
        })
    else
       this.crud.Update('governments','govId',this.id,data).subscribe(data=>{
        console.log(data)
      }); 
 
    this.presentAlert();
   /* if(this.showGrid==1)
    setTimeout( () => {
   this.router.navigateByUrl('/Grid/Governate');
   }, 3000);  */
 
}
async presentAlert() {
  const alert = await this.alertController.create({
    header:this.alertHead,
    message: this.alertMsg,
    buttons: [ {
      text: this.Okay,
      handler: () => {
       // console.log('Confirm Okay '+this.showGrid);
        if(this.showGrid==1)
             this.router.navigateByUrl('/Grid/Governate');
        else this.buildForm()
    // this.router.navigateByUrl('/Schools/add');// this.router.navigate(['/Schools/add']);
   
      }
    }]
  });

  await alert.present();
 
   
}
/*presentAlert()
{
 
    this.toast = this.toastController.create({
      message:  this.alertMsg,
      duration: 2000,
      position:'top',
      color:'success'
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
      if(this.showGrid==1)
          this.router.navigateByUrl('/Governate');

        else   {this.buildForm();}
    });
  //}

}
HideToast(){
  this.toast = this.toastController.dismiss();
}*/
}
