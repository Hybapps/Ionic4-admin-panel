import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../provider/global.service';
import { CrudProviderService } from '../../provider/crud-provider.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title_en: string; title_ar: string; note_en: string; note_ar: string; icon: string }> = [];
  constructor(public global: GlobalService,public crud: CrudProviderService) {
    this.crud.list('governments','0','','');
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title_en: 'Item ' + i,
        title_ar: 'عنصر ' + i,
        note_en: 'This is item #' + i,
        note_ar: 'هذا العنصر#' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ngOnInit() {
    setTimeout( () => {
      console.log(this.crud.listData)
  }, 1000);
   
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
