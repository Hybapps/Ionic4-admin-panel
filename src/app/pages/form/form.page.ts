import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../provider/global.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  constructor(public global: GlobalService) { }

  ngOnInit() {
  }

}
