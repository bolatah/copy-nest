import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Nest, NestService } from '../services/nest.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  take,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NestContentComponent } from '../nest-content/nest-content.component';
import { AsyncPipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    NestContentComponent,
    AsyncPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  searchControl = new FormControl('');
  selectedNest$ = new BehaviorSubject<Nest | null>(null);
  filteredNests$!: Observable<Nest[]>;
  opened: boolean = true;

  constructor(
    private nestService: NestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 640) {
      this.opened = false;
    }
    this.filteredNests$ = combineLatest([
      this.nestService.nests$,
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      ),
    ]).pipe(
      map(([nests, query]) => {
        if (!query) return nests;
        return nests.filter((nest) =>
          nest.title.toLowerCase().includes(query.trim())
        );
      })
    );

    if (!this.selectedNest$.value) {
      this.setActiveNestWithoutEmit();
    }
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.opened = window.innerWidth >= 640;
    });
  }

  setActiveNest(nest: Nest): void {
    this.selectedNest$.next(nest);
    if (this.opened && window.innerWidth < 640) {
      this.opened = false;
    }
  }

  setActiveNestWithoutEmit(): void {
    this.nestService.nests$
      .pipe(
        filter((nests) => nests.length > 0),
        take(1),
        map((nests) => nests[0])
      )
      .subscribe((firstNest) => {
        this.setActiveNest(firstNest);
      });
  }

  createNewNest(): void {
    const defaultNest: Nest = {
      title: 'Title',
      content: '',
    };

    this.nestService.createNest(defaultNest).subscribe((createdNest: Nest) => {
      this.setActiveNest(createdNest);
    });
  }

  deleteNest(id: string | undefined): void {
    if (!id) return;
    this.nestService.deleteNest(id).subscribe(() => {
      this.setActiveNestWithoutEmit();
    });
  }

  onNestChanged(updatedNest: Nest): void {
    this.nestService.updateNest(updatedNest.id!, updatedNest).subscribe();
  }

  logout() {
    this.authService.logout();
    this.selectedNest$.next(null);
    this.router.navigate(['/login']);
     if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
  }
}
