
 
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.page.html',
  styleUrls: ['./language-list.page.scss'],
})
export class LanguageListPage implements OnInit {
  
  constructor( ) { }

  ngOnInit() {
    
  }
changelang(lang)
{
  localStorage.setItem('lang',lang);
  document.location.reload();
}
 
}
 