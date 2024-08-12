import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { TASK } from '../../types/task';

@Component({
  selector: 'tasklist',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.scss'
})
export class TasklistComponent {
  tasks : TASK[] =  []
  newTaskDescription = '';
  sha = ''

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
   this.getTasks()
  }

  getTasks(){
    this.githubService.getFileContent('PabliyoCR', 'tasks', 'data/tasks.json')
    .subscribe(
      resp => {
        console.log(resp)
        if(resp){
          this.tasks = resp.content
          this.sha = resp.sha
        }
      },
      error => console.error('Error:', error)
    );
  }

  addTask(){
    if (this.newTaskDescription.trim()) {
      this.tasks.push({ description: this.newTaskDescription, done : false});
      this.newTaskDescription = '';
      this.updateRemoteData()
    }
  } 

  updateRemoteData(){
    console.log('tasks', this.tasks)
    this.githubService.updateFileContent('PabliyoCR', 'tasks', 'data/tasks.json', this.tasks, this.sha)
    .subscribe(
      response => {
        console.log('Archivo actualizado:', response)
        this.getTasks()
      },
      error => console.error('Error:', error)
    );
  }
}
