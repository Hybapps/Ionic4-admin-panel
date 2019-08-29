import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-change-color',
  templateUrl: './change-color.page.html',
  styleUrls: ['./change-color.page.scss'],
})
export class ChangeColorPage implements OnInit {
  private htmlRoot = document.documentElement;
  constructor(public popoverController :PopoverController) { }

  ngOnInit() {
  }

  changeColor(class_name){
    this.custom();
     this.htmlRoot.className=class_name;
  }
  custom(){
    this.popoverController.dismiss();
    this.htmlRoot.classList.remove("darkStyle");
    this.htmlRoot.classList.remove("lightStyle");
  }

}
