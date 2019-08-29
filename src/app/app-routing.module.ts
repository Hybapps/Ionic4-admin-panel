import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'Governate',
    loadChildren: './pages/governate/governate.module#GovernatePageModule'
  },
  {
    path: 'Grid',
    loadChildren: './pages/grid/grid.module#GridageModule'
  },
  {
    path: 'Admins',
    loadChildren: './pages/admins/admins.module#AdminsPageModule'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  }, 
  
  { 
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule' 
  },
  { path: 'statistics', loadChildren: './pages/statistics/statistics.module#StatisticsPageModule' },
  { path: 'news', loadChildren: './pages/news/news.module#NewsPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },

  /*{ path: 'Grades', loadChildren: './pages/grades/grades.module#GradesPageModule' },
  { path: 'Semistars', loadChildren: './pages/semistars/semistars.module#SemistarsPageModule' },*/
  { path: 'Cities', loadChildren: './pages/cities/cities.module#CitiesPageModule' },  { path: 'change-color', loadChildren: './popover/change-color/change-color.module#ChangeColorPageModule' },

  //{ path: 'test', loadChildren: './pages/test/test.module#TestPageModule' },
/*{ path: 'addmodal', loadChildren: './modal/addmodal/addmodal.module#AddmodalPageModule' },
*/


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
  