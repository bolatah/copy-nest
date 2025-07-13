import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditNestComponent } from './add-or-edit-nest.component';

describe('AddOrEditNestComponent', () => {
  let component: AddOrEditNestComponent;
  let fixture: ComponentFixture<AddOrEditNestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditNestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditNestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
