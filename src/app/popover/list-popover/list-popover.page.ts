import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
//import { GlobalService } from '../../provider/global.service';
/*import { ActivatedRoute,Router } from '@angular/router';*/
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-popover',
  templateUrl: './list-popover.page.html',
  styleUrls: ['./list-popover.page.scss'],
})
export class ListPopoverPage implements OnInit {
/*,private route: ActivatedRouter*/
  constructor(public popoverController: PopoverController,private router: Router) { }

  ngOnInit() {
  }
  dismiss(){
    this.popoverController.dismiss();
  }
  logOut()
  {
    //  this.global.loginArr={adminId:'',adminName:'',adminType:'',lastVisit:''}
      window.localStorage.removeItem('adminId');
      window.localStorage.removeItem('adminName');
      window.localStorage.removeItem('adminType');
      window.localStorage.removeItem('lastVisit');
      window.localStorage.removeItem('adminSubject');
      this.router.navigate(['/login']);

  }
}
