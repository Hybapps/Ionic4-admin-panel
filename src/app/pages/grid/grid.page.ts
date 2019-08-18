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
  addAllow=1;EditAllow=1;DelAllow=1;
 // searchControl = new FormControl();

  constructor(public popoverController: PopoverController,public global: GlobalService,public crud: CrudProviderService,private http: HttpClient,private route: ActivatedRoute,private router: Router,public translate: TranslateService) {
   if(this.table)
    this.getGridData();
  
 
    
  }
  ngOnInit() {
   
    setTimeout( () => {
      if(this.table)  this.getGridData();
      this.translate.get(this.pageTitle).subscribe((res: string) => {           
        this.global.title = res;
         });
  

      
  }, 1000);
 

   
  }
  strip_html_tags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}
  ionViewWillEnter()
  {
    console.log( "URL =>"+this.router.url)//url of routing
    let mode=this.router.url.replace(/\/Grid\//g, '')// remove forward slash
    let parmeter=mode.replace(/\//g, '')
    console.log("Mode="+mode)
    console.log("parmeter="+parmeter)
    let priv=this.global.loginArr.Privillage;
   
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
      for(let page of priv)
      {
        if(page.name.toLowerCase()==this.pageTitle.toLowerCase())
        {
          if(page.add===true || page.add==1)
          {
            this.addAllow=1;
          }else this.addAllow=0;
          if(page.edit===true || page.edit==1)
          {
            this.EditAllow=1;
          }else this.EditAllow=0;

          if(page.delete===true || page.delete==1)
          {
            this.DelAllow=1;
          }else this.DelAllow=0;
        }
      }
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
    
       this.listData=this.listData.concat(result['data'])
      
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
  //**************** */
  truncateString(str, len, append)
  {
     var newLength;
     append = append || "";  //Optional: append a string to str after truncating. Defaults to an empty string if no value is given
     
     if (append.length > 0)
      {
        append = " "+append;  //Add a space to the beginning of the appended text
      }
     if (str.indexOf(' ')+append.length > len)
     {
         return str;   //if the first word + the appended text is too long, the function returns the original String
     }
     
     str.length+append.length > len ? newLength = len-append.length : newLength = str.length; // if the length of original string and the appended string is greater than the max length, we need to truncate, otherwise, use the original string
     
          var tempString = str.substring(0, newLength);  //cut the string at the new length
          tempString = tempString.replace(/\s+\S*$/, ""); //find the last space that appears before the substringed text
  
     
     if (append.length > 0)
        {
             tempString = tempString + append;
        }
  
     return tempString;
  };
  
  //********************** */
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
        componentProps:{id:this.filterID,table:this.table,'col':this.pk,editLink:this.formUrl,'activeCol':this.activeCol,'activeVal':this.activeVal,'UploadAllow':this.uploadAllow,homeWorkAllow:this.homeWorkAllow,editAllow:this.EditAllow,delAllow:this.DelAllow},
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

