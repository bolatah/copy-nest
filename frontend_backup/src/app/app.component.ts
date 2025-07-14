import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
//import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private swUpdate: SwUpdate, private router: Router , private matSnack : MatSnackBar) {
    window.addEventListener('offline', () => {
      this.matSnack.open('You are offline. Please check your internet connection.', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-offline'],
      });
      this.router.navigate(['/offline']);
    });
  }
}
