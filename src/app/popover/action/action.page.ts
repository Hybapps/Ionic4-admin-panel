import { PopoverController,NavParams ,AlertController  } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrudProviderService } from '../../provider/crud-provider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action',
  templateUrl: './action.page.html',
  styleUrls: ['./action.page.scss'],
})
export class ActionPage implements OnInit {
  x=111;
  id: any;
  table:any;
  col:any;
  editLink:any;
  confirmHeader;
  confirmMessage;
  confirmActiveMessage;
   Okay;
  cancel;
  activeCol;
  activeVal;
  constructor(public popCtrl :PopoverController,private route: ActivatedRoute, private navParams: NavParams,private alertController:AlertController,public translate: TranslateService,public crud: CrudProviderService,private router: Router) { 
    //console.log(this.navParams.data);
     
   }

  ngOnInit() {
    this.id = this.navParams.data.id;
    this.table = this.navParams.data.table;
    this.col = this.navParams.data.col;
    this.editLink = this.navParams.data.editLink;
    this.activeCol = this.navParams.data.activeCol;
    this.activeVal = this.navParams.data.activeVal;
    console.log(this.id)//DeActiveConfirmMsg
    this.translate.get('DeleteConfirm').subscribe((res: string) => {           
      this.confirmHeader = res;
       });
       this.translate.get('DelConfirmMsg').subscribe((res: string) => {           
        this.confirmMessage = res;
         });
         this.translate.get('DeActiveConfirmMsg').subscribe((res: string) => {           
          this.confirmActiveMessage = res;
           });
         this.translate.get('ok').subscribe((res: string) => {           
          this.Okay = res;
           });
           this.translate.get('cancel').subscribe((res: string) => {           
            this.cancel = res;
             });
  }

  close(){
    this.popCtrl.dismiss(this.x);
  }
 // ()
  async delConfirm() {
    //TranslateService.'DeleteConfirm'.translate
   
    const alert = await this.alertController.create({
      header: this.confirmHeader,
      message: this.confirmMessage,
      buttons: [
        {
          text: this.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.close();
          }
        }, {
          text: this.Okay,
          handler: () => {
            console.log('Confirm Okay');
            this.crud.Del(this.table,this.col,this.id).subscribe(data=>{
              console.log(data)
            });
          /*    setTimeout( () => {
              this.crud.list(this.table,'0','','');
            }, 2000);*/
            this.close();

            

          }
        }
      ]
    });

    await alert.present();
  }

  async DeActivateItem() {
    //TranslateService.'DeleteConfirm'.translate
   
    const alert = await this.alertController.create({
      header: this.confirmHeader,
      message: this.confirmActiveMessage,
      buttons: [
        {
          text: this.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.close();
          }
        }, {
          text: this.Okay,
          handler: () => {
            console.log('Confirm Okay');//  Update(table,col,id,data)
            let newVal;
            if(this.activeVal==0)   newVal=1;
            else  newVal=0;
           /*  let data={};
            
            data.this.activeCol=newVal;
            console.log(data)
            this.crud.Update(this.table,this.col,this.id,data); */
        
            this.close();

            

          }
        }
      ]
    });

    await alert.present();
  }

  EditItem()
  {
    console.log('route =>'+this.editLink+'  Id=>'+this.id)
    this.close();
    this.router.navigate([this.editLink,this.id]);
    
  }
}
