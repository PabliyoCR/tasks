import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasklistComponent } from "./components/tasklist/tasklist.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TasklistComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
 
}
