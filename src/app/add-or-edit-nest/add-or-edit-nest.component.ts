import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { NestService } from '../services/nest.service';
import { Nest } from '../services/nest.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-or-edit-nest',
  templateUrl: './add-or-edit-nest.component.html',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  styleUrls: ['./add-or-edit-nest.component.css'],
})
export class AddOrEditNestComponent {
  nestForm: FormGroup;
  isEdit: boolean = false;
  private nestId?: string;
  constructor(
    private nestService: NestService,
    public dialogRef: MatDialogRef<AddOrEditNestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nest: Nest | null }
  ) {
    this.nestForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl(''),
    });

    if (data.nest) {
      this.isEdit = true;
      this.nestId = data.nest.id
      this.nestForm.patchValue(data.nest);
    }
  }
  saveNest() {
    if (this.nestForm.valid) {
      const nest: Nest = this.nestForm.value;

      if (this.isEdit && this.nestId) {
        this.nestService.updateNest(this.nestId, nest).subscribe((updatedNest) => {
          this.dialogRef.close(updatedNest);
        });
      } else {
        this.nestService.createNest(nest).subscribe((newNest) => {
          this.dialogRef.close(newNest);
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
