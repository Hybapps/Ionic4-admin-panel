import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
//import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { RequestOptions, Headers } from '@angular/http';

import { HttpConfigInterceptor } from './httpConfig.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CrudProviderService {
  //(private nativehttp: HTTP,
  public ApiUrl = 'http://ionicadmin.hybapps.com/api/v1/crud/';
  public headers;
  public headers_options;
  public Uheaders;
  public headers_Uoptions;
  public listData: any[] = [];
  public page: number = 0;
  public currentPage: number;
  public allpages: number = 1;
  public returnData: any[] = [];
  constructor(private http: HttpClient, public plt: Platform) {
    let plat = this.plt.platforms();
    console.log("Platform =>" + plat)
    this.setHeader();
    this.setUploadHeader();
  }
  setHeader() {
    this.headers = new Headers({
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': '*',
      'Access-Control-Allow-Credentials': true,
      'Upgrade-Insecure-Requests': '1',
      'withCredentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,Upgrade-Insecure-Requests',

    });

    this.headers_options = new RequestOptions({ headers: this.headers });
  }
  setUploadHeader() {
    this.Uheaders = new Headers({
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': '*',
      'Access-Control-Allow-Credentials': true,
      'Upgrade-Insecure-Requests': '1',
      'mimeType': 'multipart/form-data',
      'withCredentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,Upgrade-Insecure-Requests',

    });

    this.headers_Uoptions = new RequestOptions({ headers: this.Uheaders });
  }
  /**
   * 
   * @param table =>table name in db
   * @param page page number we required
   * @param data in case of search we use method post and send data else send empty
   * 
   * {
   *      page:0 (page number)
          orderBy: govNameAr (name of fields of sort)
          orderCase: asc ( method of sorting)
          whereStatement: govActive=1 (string contain where statement)
          pageSize:10 ( if we want to change page size)
          joinTables:levels inner join questions ( join tables if exists)
          joinOn: levels.id=questions.levelId ( join condition)
          requestFields: questions.*  (if we want custom columns name)
        }
   */
   list(table,page,data,itemArr)
   {
     let items=itemArr;
     console.log(items)
     let url=this.ApiUrl+'get/'+table+'/'+page;
     console.log(url)
      if(data==''){
           return this.http.get(url,this.headers_options)
         
      }else{
        let dbdata=data;//{whereStatement : data ,page:0}
       return this.http.post(url,dbdata,this.headers_options)
      
}
   }

 
      /***********Insert data Into table*********************
       * table =>Table Name
       * Data =>{
       * unique :"govName_ar",   (unique fields name to validate seprated with comma)
       * govName_ar:"Governament Name", (Columns of table in db and its value)
       * primaryField :"gov_id"
       * }
       */
   Add(table,data)
   {
      let url=this.ApiUrl+'add/'+table;
      console.log(url)
    return  this.http.post(url,data,this.headers_options)
     
   }
    /***********Update data In table*********************
       * table =>Table Name
       * col =>col of where condition
       * id =>value of where condition in update
       * Data =>{
       * unique :"govName_ar",   (unique fields name to validate seprated with comma)
       * govName_ar:"Governament Name", (Columns of table in db and its value)
       * primaryField :"gov_id"
       * }
       */
  Update(table,col,id,data)
      {
         let url=this.ApiUrl+'update/'+table+'/'+col+'/'+id;
         console.log(url)
        return this.http.post(url,data,this.headers_options)
       /*   .subscribe(result => {
           console.log(result);
         
         },err => {
           console.log("ERROR!: ", url);
         });  */
  }
  /******************Delete records from table
    * table =>Table Name
       * Col =>col name in database 
       * id =>id of the columns we want to delete
  */
   Del(table,col,id)
   {
      let url=this.ApiUrl+'delete/'+table+'/'+col+'/'+id;
      console.log(url)
      return this.http.delete(url,this.headers_options)
   
   }

   /*********Upload Files */
   UploadFiles(Files)
   {
    let url=this.ApiUrl+'upload';
    console.log(url)
    return this.http.post(url,Files,this.headers_Uoptions)   }
}
