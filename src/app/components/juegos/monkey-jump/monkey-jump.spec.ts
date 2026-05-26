import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonkeyJump } from './monkey-jump';

describe('MonkeyJump', () => {
  let component: MonkeyJump;
  let fixture: ComponentFixture<MonkeyJump>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonkeyJump],
    }).compileComponents();

    fixture = TestBed.createComponent(MonkeyJump);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
