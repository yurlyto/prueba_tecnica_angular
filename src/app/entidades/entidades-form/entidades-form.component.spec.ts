import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadesFormComponent } from './entidades-form.component';

describe('EntidadesFormComponent', () => {
  let component: EntidadesFormComponent;
  let fixture: ComponentFixture<EntidadesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
