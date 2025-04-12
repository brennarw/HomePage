import { Component } from '@angular/core';
import { GithubApiService } from '../github-api.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

interface GithubRepos {
  name: string;
}

interface GithubRepo {
  name: string;
  html_url: string;
  language: string;
  size: number; //in kilobytes(KB)
  readme: string;
}

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './github.component.html',
  styleUrl: './github.component.css',
})

export class GithubComponent {
  user: any = null;
  repos: GithubRepos[] = [];
  repoInfo!: GithubRepo;
  showAvatar: boolean = false;
  showAllProjects: boolean = false;
  expandedRepo: string | null = null;

  constructor(private github: GithubApiService) {}

  toggleRepo(repoName: string) {
    this.expandedRepo = this.expandedRepo === repoName ? null : repoName;
    if(this.expandedRepo){
      this.github.getRepo(this.expandedRepo).subscribe(data => {
        this.repoInfo = data;
        if(this.expandedRepo){
          this.github.getReadme(this.expandedRepo).subscribe(data => this.repoInfo.readme = data);
        }
      });
    }
  }

  getGithubAvatar() {
    if(this.showAvatar){
      this.showAvatar = false;
      this.user = null;
      return;
    }
    else{
      this.github.getAvatar().subscribe(data => this.user = data);
      this.showAvatar = true;
    }
  }

  getAllProjects() {
    if(this.showAllProjects){
      this.showAllProjects = false;
      this.repos = [];
      return;
    }
    else{
      this.github.getAllRepos().subscribe(data => {
        this.repos = data;
        this.repos.pop(); //this removes the last repo because I don't want to display it
      });
      this.showAllProjects = true;
    }
  }
  
}
