import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackBarComponent } from './shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SnackBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-angular-app';
}
