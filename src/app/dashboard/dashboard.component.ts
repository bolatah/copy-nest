import { Component, EventEmitter } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
import { AsyncPipe, CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
    AsyncPipe,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  searchControl = new FormControl('');
  selectedNest$ = new BehaviorSubject<Nest | null>(null);
  filteredNests$!: Observable<Nest[]>;
  opened: boolean = true;
  isSmallScreen: boolean = false;

  constructor(
    private nestService: NestService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
     private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
    .subscribe(result => {
      this.isSmallScreen = result.matches;
      this.opened = !this.isSmallScreen;
    });

    this.route.data
    .pipe(take(1))
    .subscribe(data => {
      const resolvedNests = data['allNests'] as Nest[];
       this.nestService.updateNests(resolvedNests.reverse());
    });

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



  setActiveNest(nest: Nest): void {
    this.router
      .navigate(['nest', nest.id], { relativeTo: this.route })
      .then(() => {
        this.selectedNest$.next(nest);
      });
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
    this.nestService.updateNests([]);
    this.router.navigate(['/login']);
  }
}
