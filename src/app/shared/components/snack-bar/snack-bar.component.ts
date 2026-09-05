import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SnackbarService } from '../../../services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(120%)', opacity: 0 }),
        animate(
          '250ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 }),
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateX(120%)', opacity: 0 }),
        ),
      ]),
    ]),
  ],
})
export class SnackBarComponent {
  snackbarService = inject(SnackbarService);
}
