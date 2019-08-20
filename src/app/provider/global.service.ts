
import { Injectable } from '@angular/core';
import { PopoverController, MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute,Router } from '@angular/router';

import { LanguageListPage } from '../popover/language-list/language-list.page';
import { NotificationsListPage } from './../popover/notifications-list/notifications-list.page';
import { ListPopoverPage } from './../popover/list-popover/list-popover.page';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  title:string='الصفحة الرئيسية';
  lang = 'Ar';
  fab = 'end';
  Dir;
  activeitem=0;
  activeMenu='home';
  pages:any[]=[];
  loginArr:any={adminId:'',adminName:'',adminType:'',Privillage:'',lastVisit:''}
  private htmlRoot = document.documentElement;
  constructor(public popoverController: PopoverController, public translate: TranslateService,public router: Router, public menu: MenuController, public storage: Storage) { 
    console.log('Pages ===')
    console.log(this.pages)
    /*let themeLang=window.localStorage.getItem('lang');
    this.lang=themeLang;
    this.change_lang(themeLang);*/
    let loginId=window.localStorage.getItem('adminId');
    if(loginId && loginId!==undefined  && loginId!==null && typeof loginId !=undefined)
      {
        let subject=window.localStorage.getItem('Privillage').split(',');
      var privArr=[];
      for(let i=0;i<=subject.length-1;i++)
      {console.log(i)
        let priv=subject[i].split('-');
        privArr.push({name:priv[0],add:priv[1],
        view:priv[2],
        edit:priv[3],
        delete:priv[4]});
      } 
        this.loginArr={adminId:loginId,adminName:window.localStorage.getItem('adminName'),adminType:window.localStorage.getItem('adminType'),Privillage:privArr,lastVisit:window.localStorage.getItem('lastVisit')}

        console.log(this.loginArr.Privillage)

        this.menu.enable(true, 'left');
        this.menu.enable(false, 'right');
        if (this.lang === 'Ar') {
          this.menu.enable(true, 'right');
          this.menu.enable(false, 'left'); 
        }
      }
  }
    
  
    // change Language
    change_lang(lang) { 
       console.log(this.lang);
      this.lang=lang;
     // this.storage.set('lang', this.lang);
      if (lang === 'En') {
        this.Dir = 'ltr';
        this.menu.enable(false, 'right');
        this.menu.enable(true, 'left'); 
        console.log(lang);
      } else if (lang === 'Ar') {
        this.Dir = 'rtl';
        console.log(lang);
        this.menu.enable(false, 'left');
        this.menu.enable(true, 'right'); 
      }
      this.htmlRoot.setAttribute('dir', this.Dir);
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.htmlRoot.setAttribute('lang', lang);
    }

  //language list popover
  async languagePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LanguageListPage,
      event: ev,
      showBackdrop: false,
      cssClass: "action-popover",
    });
    return await popover.present();
  }

  //notification list popover
  async listPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ListPopoverPage,
      event: ev,
      showBackdrop: false,
      cssClass: "action-popover",
    });
    return await popover.present();
  }

  //notification list popover
  async notificationPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificationsListPage,
      event: ev,
      showBackdrop: false,
      cssClass: "notification-page",
    });
    return await popover.present();
  }


  backToGrid(model){
    this.router.navigateByUrl('/Grid/'+model);
  }

}
