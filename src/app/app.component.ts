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
  public appPages=[];
  public MenuPages = [
    {
      title: 'Generalsettings', icon: 'home', arrow: 'ios-arrow-forward',
      sublist: [{ title: 'Governaments', url: '/Grid/Governate' },{ title: 'Cities', url: '/Grid/Cities' }]
    },
    { title: 'statistics', url: '/statistics', icon: 'stats' },
    { title: 'News', url: '/Grid/news', icon: 'stats' },
    { title: 'Admins', url: '/Grid/Admins', icon: 'stats' }
 
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
    console.log(this.appPages)
    this.global.pages=this.MenuPages;
    console.log(this.MenuPages)
    /*else*/ this.appPages=this.MenuPages;
   
    //this.global.activeitem = 0;
    if(localStorage.getItem('activeMenu'))
    this.getActiveGroup()
    console.log("ActiveLink =>"+this.global.activeitem)
    console.log(this.appPages[this.global.activeitem]);
   // this.toggleDetails(this.appPages[this.global.activeitem]);
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
    console.log(group)
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
  ngOnInit()
  {
      console.log('Init')
      if(this.global.loginArr)
    {
      let priv=this.global.loginArr.Privillage;
     
      let privPages=this.appPages;
      let i=0;
      var pages=[];
     for (const item of privPages) {
      if(item.sublist)
      {var hasSup=[];
        for(let sub of item.sublist)
        {
          for(let page of priv)
          {
            if(page.name==sub.title)
            {  console.log(page.view);console.log(page.add);
              if((page.view == true || page.view==1)|| (page.add== true || page.add==1))
              {hasSup.push(sub);
              console.log(page.view);
              console.log('sub');
              i++;
              }
            }
          }
        
        }
        if(hasSup.length>0){
          let myMenu={title:item.title,icon:item.icon,arrow:item.arrow,sublist:hasSup};
          pages.push(myMenu)
        }
      }else{
        for(let page of priv)
          {
            if(page.name==item.title)
            {
              if(page.view==true || page.view==1 || page.add==true || page.add==1){
                pages.push(item);
              console.log(page);
              console.log('Item');
              i++;
            }
            }
          }
      
      }
    }
    console.log(pages);
    this.appPages=pages;
    }
      console.log('Init Enter')
        console.log(this.appPages)
  }
  ionViewWillEnter()
  {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  getActiveGroup()
  {
    let index=localStorage.getItem('activeMenu');
    console.log('Index=>'+index)
  }
  //active menu item
  activeItem(index) {
    this.global.activeitem = index;
    window.localStorage.setItem('activeMenu', index);

    console.log("Global Active =>"+this.global.activeitem)
  }

}
