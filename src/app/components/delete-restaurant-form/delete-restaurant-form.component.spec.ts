import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRestaurantFormComponent } from './delete-restaurant-form.component';

describe('DeleteRestaurantFormComponent', () => {
  let component: DeleteRestaurantFormComponent;
  let fixture: ComponentFixture<DeleteRestaurantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteRestaurantFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRestaurantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
