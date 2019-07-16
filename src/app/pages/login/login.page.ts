import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { GlobalService } from '../../provider/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  constructor(public menu: MenuController, public navCtrl: NavController, public global: GlobalService) {
  }

  ionViewWillEnter() {
    this.menu.enable(false, 'right');
    this.menu.enable(false, 'left');
    this.global.title='sign';
  }
  ngOnInit() {
  }

  loginAdmin() {
    this.menu.enable(true, 'left');
    this.menu.enable(false, 'right');
    if (this.global.lang === 'Ar') {
      this.menu.enable(true, 'right');
      this.menu.enable(false, 'left'); 
    }
  }

}
