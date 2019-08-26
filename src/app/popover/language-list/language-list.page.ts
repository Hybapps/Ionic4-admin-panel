
 
import { Component, OnInit } from '@angular/core';
//import { GlobalService } from '../../provider/global.service';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.page.html',
  styleUrls: ['./language-list.page.scss'],
})
export class LanguageListPage implements OnInit {
  mylang
  constructor( ) { 
    this.mylang=window.localStorage.getItem('lang');
  }
  
  ngOnInit() {
    
  }
changelang(lang)
{
  localStorage.setItem('lang',lang);
  document.location.reload();
}
 
}
 