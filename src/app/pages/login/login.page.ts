import { ForgotPasswordPage } from './../../modal/forgot-password/forgot-password.page';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController ,ModalController} from '@ionic/angular';
import { GlobalService } from '../../provider/global.service';
import { CrudProviderService } from '../../provider/crud-provider.service';
import {FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5'
import { Storage } from '@ionic/storage';
import { ActivatedRoute,Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  name;
  pass;
  public myForm: FormGroup;

  constructor(public menu: MenuController,public modalCtrl: ModalController, public navCtrl: NavController, public global: GlobalService,public crud:CrudProviderService,public fm: FormBuilder,private storage: Storage,private route: ActivatedRoute,private router: Router) {
    this.buildForm();
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'right');
    this.menu.enable(false, 'left');
    this.global.title='sign';
  }
  ngOnInit() {
    let loginId=window.localStorage.getItem('adminId');
    if(loginId && loginId!==undefined  && loginId!==null && typeof loginId !=undefined)
   { console.log("Login =>"+loginId);
   this.menu.enable(true, 'left');
    this.menu.enable(false, 'right');
    if (this.global.lang === 'Ar') {
      this.menu.enable(true, 'right');
      this.menu.enable(false, 'left'); 
    }
   this.router.navigateByUrl('/statistics');
  }
    else console.log('Not logged')
  }
  buildForm()
  {
    this.myForm = this.fm.group({
      name: ['', Validators.required],
      pass: ['', Validators.required],
     
   });

  }
  loginAdmin() {
   /* this.menu.enable(true, 'left');
    this.menu.enable(false, 'right');
    if (this.global.lang === 'Ar') {
      this.menu.enable(true, 'right');
      this.menu.enable(false, 'left'); 
    }*/
    console.log( this.myForm.controls)
    if (this.myForm.invalid) {
      return;
    }
    let password=Md5.hashStr(this.myForm.controls.pass.value);
    var data={
      
      adminUN:this.myForm.controls.name.value,
      adminPW:password
    }
    let LastVisitdate=new Date().toLocaleString();
let where="adminUN ='"+this.myForm.controls.name.value+"' AND adminPW='"+password+"'";
    let govQ={whereStatement:where,page:0}
    this.crud.list('admins','0',govQ,'govArr').subscribe(result=>{
      let loginArr=result['data'];
      console.log(loginArr.length)
      if(loginArr.length==1)
      {this.menu.enable(true, 'left');
      this.menu.enable(false, 'right');
      if (this.global.lang === 'Ar') {
        this.menu.enable(true, 'right');
        this.menu.enable(false, 'left'); 
      }
      let subject=loginArr[0].priv.split(',');
      var privArr=[];
      for(let i=0;i<=subject.length-1;i++)
      {console.log(i)
        let priv=subject[i].split('-');
        privArr.push({name:priv[0],add:priv[1],
        view:priv[2],
        edit:priv[3],
        delete:priv[4]});
      } 
        this.global.loginArr={adminId:loginArr[0].adminId,adminName:loginArr[0].adminName,adminType:loginArr[0].adminType,Privillage:privArr,lastVisit:LastVisitdate}
        window.localStorage.setItem('adminId', loginArr[0].adminId);
        window.localStorage.setItem('adminName', loginArr[0].adminName);
        window.localStorage.setItem('Privillage', loginArr[0].priv);

        window.localStorage.setItem('adminType', loginArr[0].adminType);
        window.localStorage.setItem('lastVisit', LastVisitdate);
        window.localStorage.setItem('activeMenu', '0');

        console.log(this.global.loginArr)
        //console.log(this.storage)
        this.router.navigateByUrl('/statistics');
      }
      console.log(LastVisitdate)
    });
  }



  async forgot_password() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage,
      cssClass: 'forgot_password',
    });
    return await modal.present();
  }
}
