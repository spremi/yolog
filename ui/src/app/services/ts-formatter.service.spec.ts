import { TestBed } from '@angular/core/testing';

import { TsFormatterService } from './ts-formatter.service';

describe('TsFormatterService', () => {
  let service: TsFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TsFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
