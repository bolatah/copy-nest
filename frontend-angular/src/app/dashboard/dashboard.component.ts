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
import { AddOrEditNestComponent } from '../add-or-edit-nest/add-or-edit-nest.component';
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
  nests$ = new BehaviorSubject<Nest[]>([]);
  @Output() selectNest = new EventEmitter<Nest>();
  selectedNest$ = new BehaviorSubject<Nest | null>(null);
  filteredNests$!: Observable<Nest[]>;
  opened: boolean=true;
  constructor(
    private nestService: NestService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadNests(); 
    this.filteredNests$ = combineLatest([
      this.nests$,
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('') 
      )
    ]).pipe(
      map(([nests, query]) => {
        if (!query) return nests;
        return nests.filter((nest) =>
          nest.title.toLowerCase().includes(query.trim().toLowerCase())
        );
      })
    );
  }

  loadNests() {
    this.nestService.getAllNests().subscribe((data) => {
      this.nests$.next(data);
    });
  }

  openAddNestDialog(nestToEdit: Nest | null = null) {
    const dialogRef = this.dialog.open(AddOrEditNestComponent, {
      disableClose: true,
      data: { nest: nestToEdit },
    });

    dialogRef.afterClosed().subscribe((newNest) => {
      if (newNest) {
        this.loadNests();
      }
    });
  } 

  setActiveNest(nest: Nest): void {
    this.selectNest.emit(nest);
    this.selectedNest$.next(nest);
  }

  onNestChanged(updatedNest: Nest): void {
    this.loadNests();
  }

  /* editNest(id: string | undefined): void {
    const selectedNest = this.selectedNest$.getValue();
  
    if (id && selectedNest) {
      this.nestService.updateNest(id, selectedNest).subscribe((updatedNest) => {
        this.loadNests(); 
      });
    }
  } */
    createNewNest(): void {
      const defaultNest: Nest = {
        title: 'Untitled Nest',
        content: 'Start writing here...',
      };
    
      this.nestService.createNest(defaultNest).subscribe((createdNest: Nest) => {
        const currentNests = this.nests$.getValue();
        const updatedNests = [createdNest, ...currentNests];
        this.nests$.next(updatedNests);
        this.setActiveNest(createdNest);
      });
    }

    deleteNest(id: string | undefined): void {
      if (!id) return;
      this.nestService.deleteNest(id).subscribe(() => {
        const currentNests = this.nests$.getValue(); 
        const updatedNests = currentNests.filter(nest => nest.id !== id); 
        this.nests$.next(updatedNests); 
      });
    }
    
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
