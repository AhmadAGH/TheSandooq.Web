import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandooqDetails } from './sandooq-details';

describe('SandooqDetails', () => {
  let component: SandooqDetails;
  let fixture: ComponentFixture<SandooqDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandooqDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandooqDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
