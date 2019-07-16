import { Component,ViewChild } from '@angular/core';
import { PopoverController,IonSelect } from '@ionic/angular';
import { GlobalService } from '../../provider/global.service' 
import { ActionPage } from '../../popover/action/action.page';
import { CrudProviderService } from '../../provider/crud-provider.service';
// { SearchPipe } from '../../pipes/search.pipe';
//import { Select } from 'ionic-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
//	@ViewChild('sortSelect') select: IonSelect;

  googleChartLibrary;
  ColumnChartData;
  pieChartData ;
  GridCols:Array<any>;
  list:Array<any>;
  search={q:''};
  sort={q:'',case:'asc'};
  searchQ;
  constructor(public popoverController: PopoverController,public global: GlobalService,public crud: CrudProviderService) {
    this.crud.list('governments','0','','');
    this.GridCols=[{name:'name',search:1,sortItem:0,'name_indb':"govName"+global.lang},{name:'status',search:0,sortItem:1,'name_indb':"govActive"}]
    this.list=[1,2,3,4,5,6]
  }
  ngOnInit() {
    setTimeout( () => {
      console.log(this.crud.listData)
  }, 1000);
   
  }
  doInfinite() {
    this.crud.page=this.crud.page+1;
    this.crud.list('governments',this.crud.page,'','');
   /*  for (let i = 0; i < 6; i++) {
      this.list.push( this.list.length );
    } */
  }
  //*********Search Grid */
  searchGrid(evt)
  {//console.log(this.search)
    console.log(evt.target.value)
    let search_q=evt.target.value;
    this.searchQ='';
    for(var i=0;i<this.GridCols.length;i++)
    {
     // console.log(this.GridCols[i].search)
      if(this.GridCols[i].search==1){
         if(this.searchQ!='') this.searchQ+=' OR ';
         this.searchQ+=this.GridCols[i].name_indb+" Like '"+search_q+"%'"
      }

    }
   let sendQ={whereStatement:this.searchQ,page:0}
    this.crud.list('governments','0',sendQ,'');
    console.log(this.searchQ)
  }
  //**********Sort Grid */
  sortItem()
  {
    //console.log('sort'+this.sort.q)
    let sendQ={whereStatement:this.searchQ,orderBy:this.sort.q,orderCase:this.sort.case,page:0}
    this.crud.list('governments','0',sendQ,'');
    if(this.sort.case=='desc') this.sort.case='asc';
    else this.sort.case='desc';
    console.log(this.searchQ)
    //this.sortselect.select.close();
  }
    //action btn
    async actionList(ev: any,row:any) {
      console.log(row)
      const popover = await this.popoverController.create({
        component: ActionPage,
        event: ev,
        componentProps:{id:row.govId},
        showBackdrop: false,
        cssClass: "action-popover",
      });
      popover.onDidDismiss()
      .then((result) => {
        console.log(result['data']); 
      });
  
      return await popover.present();
    }
}

