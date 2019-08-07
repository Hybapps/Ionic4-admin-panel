import { GlobalService } from '../../provider/global.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  ColumnChartData;
  pieChartData;
  constructor(public menu: MenuController, public global: GlobalService,private route: ActivatedRoute,private router: Router) { }
  ionViewWillEnter(){
    this.menu.enable(true);  
    this.global.title='الاحصاء';
  }
  ngOnInit() {
    let loginId=window.localStorage.getItem('adminId');
    if(loginId && loginId!==undefined  && loginId!==null && typeof loginId !=undefined)
   { console.log("Login =>"+loginId);
   
    
  }
    else {console.log('Not logged');
    this.router.navigate(['/login']);

  }
    this.useAngularLibrary(); 
  }

  useAngularLibrary() {
    this.ColumnChartData = {
      chartType: 'ColumnChart',
      dataTable: [
        ['Languages', 'Percent'],
        ['Ionic', 83],
        ['Angular', 33],
        ['JavaScript', 50],
        ['css', 60]
      ],
      options: {
      title: 'Technologies',
      width: 400,
      height: 300,
       colors: ['#e6693e', '#e6693e', '#ec8f6e', '#f3b49f']
      }
    };


    this.pieChartData = {
      chartType: 'PieChart',
      dataTable: [
        ['Languages', 'Percent'],
        ['Ionic', 33],
        ['Angular', 33],
        ['JavaScript', 33],
      ],
      options: {
      title: 'Technologies',
      width: 400,
      height: 300
      }
    };
  }


}
