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
  @Output() nestChanged = new EventEmitter<Nest>();
  title: string = '';
  content: string = '';

  constructor(
    private nestService: NestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nest'] && this.nest) {
      this.title = this.nest.title;
      this.content = this.nest.content;
    }
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
          this.nestChanged.emit(updated);
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
}
