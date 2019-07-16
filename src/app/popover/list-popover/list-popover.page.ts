import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-popover',
  templateUrl: './list-popover.page.html',
  styleUrls: ['./list-popover.page.scss'],
})
export class ListPopoverPage implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }
  dismiss(){
    this.popoverController.dismiss();
  }
}
