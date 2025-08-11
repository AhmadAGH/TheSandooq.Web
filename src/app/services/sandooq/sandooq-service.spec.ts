import { TestBed } from '@angular/core/testing';

import { SandooqService } from './sandooq-service';

describe('SandooqService', () => {
  let service: SandooqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SandooqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
