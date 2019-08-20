import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { GlobalService } from '../../provider/global.service';
import {Md5} from 'ts-md5/dist/md5'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public myForm: FormGroup;
title;
id;
listData;
table='admins';
genderType;
selected;
subjArr;
submitted;
  constructor(public global: GlobalService, public fm: FormBuilder, public crud: CrudProviderService,public translate: TranslateService) {
    this.title='Profile';
    this.buildForm();
   /* let govQ={whereStatement:'subjectActive = 1',page:0,groupBy:"a.subjectId",requestFields:"*,GROUP_CONCAT(a.subjectNameAr,' (',b.stageNameAr,'-',c.gradeNameAr,')') as SubjectGrade",joinTables:"subjects as a inner join stages as b ON a.subjectStageId=b.stageId inner join grades as c ON a.subjectGradeId=c.gradeId"}
    this.crud.list('subjects','0',govQ,'govArr').subscribe(result=>{
      this.subjArr=result['data'];
    });*/
     
       
     

   
   }

  ngOnInit() {
  }
  ionViewWillEnter()
  {
    this.id =window.localStorage.getItem('adminId');
    let sendQ = { whereStatement: 'adminId = ' + this.id, page: 0 }
    console.log(sendQ)
    this.crud.list(this.table, '0', sendQ, '').subscribe(results=>{
      this.listData=results['data'];
      this.buildFormModify();
    });
  }

  buildForm()
  {
    this.myForm = this.fm.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mob: ['', Validators.required],
      user_name:['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(3)]],
    //  subjects:['',Validators.required],
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
  //  let subject=item.adminSubjects.split(',');
   // this.selected=subject;
   
     this.myForm = this.fm.group({
      name: [item.adminName, Validators.required],
      email: [item.adminEmail, [Validators.required, Validators.email]],
      mob: [item.adminPhone, Validators.required],
      user_name:[item.adminUN, Validators.required],
      pass: ['', [ Validators.minLength(3)]],
    //  subjects:[subject,Validators.required],
      gender:new FormControl('1')
   }); 

  }
  onSubmit()
  {     this.submitted = true;
    console.log(this.myForm)
    if (this.myForm.invalid) {
        return;
    }
   // let subj=this.myForm.controls.subjects.value;
   /* let subjSelect='';
    for(let i=0;i<subj.length;i++)
    {
      if(subjSelect!='')subjSelect+=',';
      subjSelect+=subj[i];
    }*/
    var data={
      adminName:this.myForm.controls.name.value,
      adminEmail:this.myForm.controls.email.value,
      adminPhone:this.myForm.controls.mob.value,
      adminUN:this.myForm.controls.user_name.value,
     // adminSubjects:subjSelect,
      adminType:window.localStorage.getItem('adminType'),
      adminGender:this.genderType,
    }
    if(this.myForm.controls.name.value!='')
     data['adminPW']=Md5.hashStr(this.myForm.controls.pass.value);
      this.crud.Update(this.table,'adminId',this.id,data).subscribe(data=>{
      console.log(data);//,adminSubject:data['adminSubjects']
      this.global.loginArr={adminId:window.localStorage.getItem('adminId'),adminName:data['adminName'],adminType:data['adminType'],lastVisit:window.localStorage.getItem('LastVisitdate')}
      window.localStorage.setItem('adminId', window.localStorage.getItem('adminId'));
      window.localStorage.setItem('adminName', data['adminName']);
   //   window.localStorage.setItem('adminSubject', data['adminSubjects']);

     // window.localStorage.setItem('adminType', loginArr[0].adminType);
     // window.localStorage.setItem('lastVisit', LastVisitdate);
     
      }); 
      
  }
}
