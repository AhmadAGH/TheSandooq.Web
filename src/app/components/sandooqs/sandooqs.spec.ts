import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sandooqs } from './sandooqs';

describe('Sandooqs', () => {
  let component: Sandooqs;
  let fixture: ComponentFixture<Sandooqs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sandooqs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sandooqs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
