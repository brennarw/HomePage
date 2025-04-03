import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {path:'home', component: HomepageComponent},
    {path:'about', component: AboutComponent},
    {path:'projects', component: ProjectsComponent},
];
