import { Component,ViewChild } from '@angular/core';
import { PopoverController,IonSelect } from '@ionic/angular';
import { GlobalService } from '../../provider/global.service' 
import { ActionPage } from '../../popover/action/action.page';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { Observable, Subscriber,Subject,fromEvent,interval,from  } from 'rxjs';
import { tap, map, filter,switchMap  } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.page.html',
  styleUrls: ['grid.page.scss'],
})
export class GridPage {
//	@ViewChild('sortSelect') select: IonSelect;
@ViewChild('searchInput') searchInput: any;

  googleChartLibrary;
  ColumnChartData;
  pieChartData ;
  GridCols:Array<any>;
  list:Array<any>;
  search={q:''};
  sort={q:'',case:'asc'};
  searchQ;
  formUrl;
  table;
  Join;
  pk;
  filterID;
  activeCol;
  activeVal;
  sendQuery;
  listData:any[]=[];
  page;
  currentPage;
  allpages;
  pageTitle;
  uploadAllow;homeWorkAllow;
  whereCond;
 // searchControl = new FormControl();

  constructor(public popoverController: PopoverController,public global: GlobalService,public crud: CrudProviderService,private http: HttpClient,private route: ActivatedRoute,private router: Router,public translate: TranslateService) {
   if(this.table)
    this.getGridData();
  
 
    
  //  this.GridCols=[{name:'name',search:1,sortItem:0,'name_indb':"schoolName"+global.lang,type:'text',showVal:"govName"+global.lang},{name:'Governaments',search:1,sortItem:1,'name_indb':"govName"+global.lang,type:'text',showVal:"govName"+global.lang},{name:'Type',search:1,sortItem:1,'name_indb':"schoolType",type:'text',showVal:"schoolType"},{name:'status',search:0,sortItem:1,'name_indb':"schoolActive",type:"boolean",showVal:{0:'inactive',1:'active'}}]
  }
  ngOnInit() {
   
    setTimeout( () => {
      if(this.table)  this.getGridData();
      this.translate.get(this.pageTitle).subscribe((res: string) => {           
        this.global.title = res;
         });
  

      
  }, 1000);
 

   
  }
  ionViewWillEnter()
  {
    console.log( "URL =>"+this.router.url)//url of routing
    let mode=this.router.url.replace(/\/Grid\//g, '')// remove forward slash
    let parmeter=mode.replace(/\//g, '')
    console.log("Mode="+mode)
    console.log("parmeter="+parmeter)
    var json; 
    this.global.activeMenu=parmeter;
    this.http.get('./assets/gridData/data.json').subscribe(data => {
      json = data;
      console.log(data[parmeter])
      this.pk=data[parmeter][0].pk;
      this.formUrl=data[parmeter][0].formUrl;
      this.table=data[parmeter][0].table;
      this.Join=data[parmeter][0].join;
      this.GridCols=data[parmeter][0].GridCols;
      this.activeCol=data[parmeter][0].activeCol; 
      this.global.activeitem=data[parmeter][0].activeitem;
      this.pageTitle=data[parmeter][0].title;
      this.uploadAllow=data[parmeter][0].Upload;
      this.homeWorkAllow=data[parmeter][0].homeWork;
      this.whereCond=data[parmeter][0].where;
      console.log('Table =>'+this.table+" Join =>"+this.Join)
      
     this.getGridData();
  });

  }
  getGridData()
  {this.sendQuery={joinTables:this.Join,page:0,whereStatement:this.whereCond}
    this.crud.list(this.table,'0',this.sendQuery,'').subscribe(result=>{
      console.log(result);
      this.listData=result['data'];
      this.page=0;
      this.currentPage=this.page+1;
      
          this.allpages=Math.ceil(parseInt(result['allrowsCount'])/10);
         console.log('Page =>'+this.page+' All =>'+this.allpages) ;
    });
      console.log(this.listData)
  }
  doInfinite() {
    this.page=this.page+1;
  
    this.crud.list(this.table,this.page,this.sendQuery,'').subscribe(result=>{
      console.log(result['data']);
     /*   for(let i=0;i<result['data'].length;i++)
       this.listData.push(result['data'][i])  */
       this.listData=this.listData.concat(result['data'])
      //}
     // this.listData.push(result['data']);
      console.log(result['data'].length);
      console.log(this.listData);
      this.currentPage=this.page+1;
      
         
    });
 
  }
  //*********Search Grid */
  searchGrid(evt)
  {//console.log(this.search)
    console.log(evt)
    //let searchq=evt.target.value;
   // search_q.pipe(debounceTime(1000)).subscribe(value => this.newSearch(value));

     let search_q=evt.target.value;
    this.searchQ='';
    for(var i=0;i<this.GridCols.length;i++)
    {
     // console.log(this.GridCols[i].search)
      if(this.GridCols[i].search==1){
         if(this.searchQ!='') this.searchQ+=' OR ';
         this.searchQ+=this.GridCols[i].name_indb+" Like '%"+search_q+"%'"
      }

    }
   let sendQ={whereStatement:this.searchQ,page:0,joinTables:this.Join}
    this.crud.list(this.table,'0',sendQ,'').subscribe(result=>{
      console.log(result);
      this.listData=result['data'];
      
      this.currentPage=1;
      
         
    });
    console.log(this.searchQ) 
  }
  
  newSearch(data)
  {
console.log(data)
  }
  //**********Sort Grid */
  sortItem()
  {
    //console.log('sort'+this.sort.q)
    let sendQ={whereStatement:this.searchQ,orderBy:this.sort.q,orderCase:this.sort.case,page:0,joinTables:this.Join}
    this.crud.list(this.table,'0',sendQ,'').subscribe(result=>{
      this.listData=result['data'];
    });
    if(this.sort.case=='desc') this.sort.case='asc';
    else this.sort.case='desc';
    console.log(this.searchQ)
    //this.sortselect.select.close();
  }
    //action btn
    async actionList(ev: any,row:any) {
      console.log(row)
      let keys = Object.keys(row);
      this.filterID=row[this.pk];
      this.activeVal=row[this.activeCol];
      console.log('Filterd ID =>'+this.filterID)
      const popover = await this.popoverController.create({
        component: ActionPage,
        event: ev,
        componentProps:{id:this.filterID,table:this.table,'col':this.pk,editLink:this.formUrl,'activeCol':this.activeCol,'activeVal':this.activeVal,'UploadAllow':this.uploadAllow,homeWorkAllow:this.homeWorkAllow},
        showBackdrop: false,
        cssClass: "action-popover",
      });
      popover.onDidDismiss()
      .then((result) => {
        console.log(result['data']); 
        if(result['data']=='del'){
        this.sendQuery={joinTables:this.Join,page:0}
        this.crud.list(this.table,'0',this.sendQuery,'').subscribe(result=>{
          console.log(result);
          this.listData=result['data'];
          this.page=0;
          this.currentPage=1;
          
              this.allpages=Math.ceil(parseInt(result['allrowsCount'])/10);
             console.log('Page =>'+this.page+' All =>'+this.allpages) ;
        });
      }
      });
  
      return await popover.present();
    }
}

