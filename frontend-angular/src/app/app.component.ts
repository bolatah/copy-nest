import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { LoginComponent } from "./login/login.component";
//import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'copy-nest';

  constructor(private router: Router) {
    window.addEventListener('offline', () => {
      this.router.navigate(['/offline']);
    });

    window.addEventListener('online', () => {
      this.router.navigate(['/login']);
    });
  }
}
