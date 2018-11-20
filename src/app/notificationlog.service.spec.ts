import { TestBed } from '@angular/core/testing';

import { NotificationLogService } from './notificationlog.service';

describe('NotificationLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationLogService = TestBed.get(NotificationLogService);
    expect(service).toBeTruthy();
  });
});
