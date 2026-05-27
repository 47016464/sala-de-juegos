import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEncuestas } from './admin-encuestas';

describe('AdminEncuestas', () => {
  let component: AdminEncuestas;
  let fixture: ComponentFixture<AdminEncuestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEncuestas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEncuestas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
