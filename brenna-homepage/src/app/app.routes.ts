import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { ResearchComponent } from './research/research.component';
import { GithubComponent } from './github/github.component';

export const routes: Routes = [
    {path:'', component: HomepageComponent},
    {path:'home', component: HomepageComponent},
    {path:'about', component: AboutComponent},
    {path:'projects', component: ProjectsComponent},
    {path:'research', component: ResearchComponent},
    {path:'github', component: GithubComponent},
];
