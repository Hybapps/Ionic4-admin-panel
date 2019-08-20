import { Component, OnInit,EventEmitter } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {Md5} from 'ts-md5/dist/md5'

@Component({
  selector: 'app-form',
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.scss'],
})
export class AdminsPage implements OnInit {
appPage:any[]=[];
public myForm: FormGroup;
  id:any;
  submitted = false;
  statusSelect=1;
  title;
  subjArr;
  typeArr;
  table='admins';
  Okay;
  alertHead;
  alertMsg;
  showGrid=0;
  listData;
  selected:any=1;
  genderType:any=0;
 
  constructor(public global: GlobalService,public fm: FormBuilder, public crud: CrudProviderService, private alertController: AlertController, private route: ActivatedRoute, private router: Router, public translate: TranslateService) { 
    console.log(this.global.pages)
    this.global.activeitem=3;
   // let i=0;
    for (const item of this.global.pages) {
      if(item.sublist)
      {
        for(let sub of item.sublist)
        {
          this.appPage.push({name:sub.title,add:"1",
          view:'1',
          edit:'1',
          delete:'1'});
         // i++;
        }
      }else{
        this.appPage.push({name:item.title,
        add:'1',
        view:'1',
        edit:'1',
        delete:'1'});
      }
      //  console.log( item);
    }
    console.log( this.appPage);
    this.title='Admins';
    this.translate.get(this.title).subscribe((res: string) => {           
      this.global.title = res;
       });
    this.global.activeitem=0;
  
        this.buildForm();
       /* let govQ={whereStatement:'subjectActive = 1',page:0,groupBy:"a.subjectId",requestFields:"*,GROUP_CONCAT(a.subjectNameAr,' (',b.stageNameAr,'-',c.gradeNameAr,')') as SubjectGrade",joinTables:"subjects as a inner join stages as b ON a.subjectStageId=b.stageId inner join grades as c ON a.subjectGradeId=c.gradeId"}
        this.crud.list('subjects','0',govQ,'govArr').subscribe(result=>{
          this.subjArr=result['data'];
        });*/
        let sub = this.route.params.subscribe(params => {
          this.id = params['id']; 
          if(this.id && this.id !='undefined' && this.id >0)
          {
            let sendQ={whereStatement:'adminId = '+this.id,page:0}
            console.log(sendQ)
            this.crud.list(this.table,'0',sendQ,'').subscribe(result=>{
              this.listData=result['data'];
              this.buildFormModify();
            });
           
          }
      });
   
  }

  updateObject(mode,index,evt)
  {
    console.log(index);
    console.log(evt)
    if(evt.detail.checked) var check =1; else var check =0;
    if(mode=='add')
      this.appPage[index].add=check;
    if(mode=='view')
    this.appPage[index].view=check;
    if(mode=='edit')
    this.appPage[index].edit=check;
    if(mode=='delete')
    this.appPage[index].delete=check;
   
   /* if(mode=='copy')this.copy[index]=evt.detail.checked;
    if(mode=='down')this.down[index]=evt.detail.checked;
    console.log(this.copy);
    console.log(this.down);*/
    console.log(this.appPage)
  }
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
   email: ['', [Validators.required, Validators.email]],
   mob: ['', Validators.required],
   user_name:['', Validators.required],
   pass: ['', [Validators.required, Validators.minLength(3)]],
   options: new FormControl('1'),
   gender:new FormControl('1')
});

}
buildFormModify()
{
 let item=this.listData[0];
 this.selected=item.adminActive;
 this.genderType=item.adminGender;
// let subject=[];
 let subject=item.priv.split(',');
 this.myForm = this.fm.group({
   name: [item.adminName, Validators.required],
   email: [item.adminEmail, [Validators.required, Validators.email]],
   mob: [item.adminPhone, Validators.required],
   user_name:[item.adminUN, Validators.required],
   pass: ['', [ Validators.minLength(3)]],
   options: new FormControl('1'),
   gender:new FormControl('1')
});
this.appPage=[];
for(let i=0;i<=subject.length-1;i++)
{console.log(i)
  let priv=subject[i].split('-');
  this.appPage.push({name:priv[0],add:priv[1],
  view:priv[2],
  edit:priv[3],
  delete:priv[4]});
}
}

onSubmit() {
  this.submitted = true;
 console.log(this.myForm)
 if (this.myForm.invalid) {
     return;
 }
 let priv=this.appPage;
 let privillage='';
 for(let i=0;i<priv.length;i++)
 {
   if(privillage!='')privillage+=',';
   privillage+=priv[i].name+'-'+priv[i].add+'-'+priv[i].view+'-'+priv[i].edit+'-'+priv[i].delete;
 }
 var data={
   adminName:this.myForm.controls.name.value,
   adminEmail:this.myForm.controls.email.value,
   adminPhone:this.myForm.controls.mob.value,
   adminUN:this.myForm.controls.user_name.value,
   priv:privillage,
   adminType:1,
   adminGender:this.genderType,
   adminActive:this.selected
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
