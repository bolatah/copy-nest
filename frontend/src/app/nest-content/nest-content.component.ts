import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Nest, NestService } from '../services/nest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuillModule } from 'ngx-quill';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nest-content',
  standalone: true,
  imports: [
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './nest-content.component.html',
  styleUrls: ['./nest-content.component.css'],
})
export class NestContentComponent implements OnChanges {
  @Input() nest: Nest | null = null;
  title: string = '';
  content: string = '';

  constructor(
    private nestService: NestService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
  }

  
ngOnInit(): void {
  this.route.paramMap.subscribe(paramMap => {
    const id = paramMap.get('id');
    if (id) {
      this.nestService.getNestById(id).subscribe(nest => {
        this.nest = nest;
        this.title = nest.title;
        this.content = nest.content;
      });
    }
  });
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nest'] && this.nest) {
      this.title = this.nest.title;
      this.content = this.nest.content;
    }
  }

  hasChanges(): boolean {
    if (!this.nest) return false;
    return this.title !== this.nest.title || this.content !== this.nest.content;
  }

  saveNest() {
    if (!this.title.trim()) {
      this.snackBar.open('Please fill in the required fields.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
      });
      return;
    }

    const updatedNest: Nest = {
      title: this.title,
      content: this.content,
    };

    if (this.nest?.id) {
      const id = this.nest.id;

      this.nestService.updateNest(id, { id, ...updatedNest }).subscribe({
        next: () => {
          this.snackBar.open('Nest content saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          const updated = { id, ...updatedNest };
          this.nest = updated;
        },
        error: (error) => {
          this.snackBar.open('Error saving nest!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          console.error('Error saving nest:', error);
        },
      });
    }
  }

  adjustEditorHeight(event: any): void {
    const editorElem = event.editor?.root || event?.root;
    if (editorElem) {
      editorElem.style.height = 'auto';
      editorElem.style.height = editorElem.scrollHeight + 'px';
    }
  }

  deleteNest(): void {
    if (!this.nest?.id) return;

    this.nestService.deleteNest(this.nest.id).subscribe({
      next: () => {
        this.snackBar.open('Nest deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.nest = null;
        this.title = '';
        this.content = '';
      },
      error: (error) => {
        this.snackBar.open('Error deleting nest!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error deleting nest:', error);
      },
    });
  }
}
