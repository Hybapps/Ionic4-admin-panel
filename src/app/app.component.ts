import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './provider/global.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
}) 
export class AppComponent {
  shownGroup;
  public appPages = [
    {
      title: 'Generalsettings', icon: 'home', arrow: 'ios-arrow-forward',
      sublist: [{ title: 'Governaments', url: '/Grid/Governate' }]
    }/*,
    {
      title: 'Lessons', icon: 'home', arrow: 'ios-arrow-forward',
      sublist: [ { title: 'Units', url: '/Grid/Units' },{title:'Lessons',url:'/Grid/Lessons'}]
    },
    { title: 'statistics', url: '/statistics', icon: 'stats' },
    {
      title: 'dashboard', icon: 'home', arrow: 'ios-arrow-forward',
      sublist: [{ title: 'dashboard', url: '/home' }, { title: 'dashboard', url: '/home' }]
    },
    { title: 'list', url: '/list', icon: 'list' },
    {
      title: 'tables', icon: 'grid', arrow: 'ios-arrow-forward',
      sublist: [{ title: 'regular', url: '/list' }, { title: 'smart_table', url: '/list' }]
    },
    { title: 'settings', url: '/home', icon: 'settings' },
    { title: 'Generalsettings', url: '/Grid/Test', icon: 'settings' }
    */
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public translate: TranslateService,
    public global: GlobalService,
    public menu: MenuController,
    public storage: Storage
  ) {
    //this.global.activeitem = 0;
    console.log("ActiveLink =>"+this.appPages[this.global.activeitem]);
    this.toggleDetails(this.appPages[this.global.activeitem]);
    this.initializeApp();

    this.storage.get('lang').then((val) => {
      if (val != null) {
        if (val === 'En') {
          this.global.lang = 'En';
          this.menu.enable(true, 'left');
          this.menu.enable(false, 'right');
        } else {
          this.global.lang = 'Ar';
          this.menu.enable(true, 'right');
          this.menu.enable(false, 'left');
        }
      }
    
      this.global.change_lang(this.global.lang);
    });
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  toggleDetails(group) {

    if (group.sublist) {

      if (this.isGroupShown(group)) {
        if (this.shownGroup) { this.shownGroup.arrow = 'ios-arrow-down'; }
        this.shownGroup = null;
        group.arrow = 'ios-arrow-forward';
       // console.log(group.sublist)
      } else {
        if (this.shownGroup) { this.shownGroup.arrow = 'ios-arrow-forward'; }
        this.shownGroup = group;
        group.arrow = 'ios-arrow-down';
        console.log(group.sublist)
      }

    } else {
      this.router.navigateByUrl(group.url);
    }

  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  //active menu item
  activeItem(index) {
    this.global.activeitem = index;
  }

}
