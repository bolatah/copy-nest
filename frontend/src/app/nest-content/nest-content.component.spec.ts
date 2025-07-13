import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestContentComponent } from './nest-content.component';

describe('NestContentComponent', () => {
  let component: NestContentComponent;
  let fixture: ComponentFixture<NestContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
