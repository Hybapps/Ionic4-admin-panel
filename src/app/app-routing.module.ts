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
  /*{
    path: 'Schools',
    loadChildren: './pages/schools/schools.module#SchoolsPageModule'
  },
  {
    path: 'Units',
    loadChildren: './pages/units/units.module#UnitsPageModule'
  },
  {
    path: 'Lessons',
    loadChildren: './pages/lessons/lessons.module#LessonsPageModule'
  },*/
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  }, 
  /*{
    path: 'list',
    loadChildren: './pages/list/list.module#ListPageModule'
  },
  { 
    path: 'form', 
    loadChildren: './pages/form/form.module#FormPageModule' 
  },
  { 
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule' 
  },
  { path: 'statistics', loadChildren: './pages/statistics/statistics.module#StatisticsPageModule' },
  { path: 'Stages', loadChildren: './pages/stages/stages.module#StagesPageModule' },
  { path: 'Grades', loadChildren: './pages/grades/grades.module#GradesPageModule' },
  { path: 'Semistars', loadChildren: './pages/semistars/semistars.module#SemistarsPageModule' },*/
  { path: 'Cities', loadChildren: './pages/cities/cities.module#CitiesPageModule' },
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
  