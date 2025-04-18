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
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NestContentComponent } from '../nest-content/nest-content.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @Output() selectNest = new EventEmitter<Nest>();
  selectedNest$ = new BehaviorSubject<Nest | null>(null);
  filteredNests$!: Observable<Nest[]>;
  opened: boolean = true;

  constructor(
    private nestService: NestService,
    private authService: AuthService,
    private dialog: MatDialog,
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
          nest.title.toLowerCase().includes(query.trim().toLowerCase())
        );
      })
    );

    this.nestService.nests$
      .pipe(map((nests) => nests[0]))
      .subscribe((firstNest) => {
        if (firstNest) {
          this.setActiveNest(firstNest);
        }
      });
  }
  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.opened = window.innerWidth >= 640;
    });
  }
  /* openAddNestDialog(nestToEdit: Nest | null = null) {
    const dialogRef = this.dialog.open(AddOrEditNestComponent, {
      disableClose: true,
      data: { nest: nestToEdit },
    });

    dialogRef.afterClosed().subscribe((newNest) => {
      // No need to manually call loadNests(); NestService handles updates
    });
  } */

  setActiveNest(nest: Nest): void {
    this.selectNest.emit(nest);
    this.selectedNest$.next(nest);
  }

  createNewNest(): void {
    const defaultNest: Nest = {
      title: 'Untitled Nest',
      content: 'Start writing here...',
    };

    this.nestService.createNest(defaultNest).subscribe((createdNest: Nest) => {
      this.setActiveNest(createdNest);
    });
  }

  deleteNest(id: string | undefined): void {
    if (!id) return;
    this.nestService.deleteNest(id).subscribe();
  }

  onNestChanged(updatedNest: Nest): void {
    this.nestService.updateNest(updatedNest.id!, updatedNest).subscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
