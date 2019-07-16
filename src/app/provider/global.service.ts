
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
  private htmlRoot = document.documentElement;
  constructor(public popoverController: PopoverController, public translate: TranslateService,public router: Router, public menu: MenuController, public storage: Storage) { }

  
  
    // change Language
    change_lang(lang) { 
       console.log(this.lang);
      this.lang=lang;
      this.storage.set('lang', this.lang);
      if (lang === 'En') {
        this.Dir = 'ltr';
        this.menu.enable(false, 'rightMenu');
        this.menu.enable(true, 'leftMenu'); 
        console.log(lang);
      } else if (lang === 'Ar') {
        this.Dir = 'rtl';
        console.log(lang);
        this.menu.enable(false, 'leftMenu');
        this.menu.enable(true, 'rightMenu'); 
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
