import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snack-bar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success toaster message', () => {
    const showSpy = spyOn(service, 'show');

    service.success('User added successfully', 1000);

    expect(showSpy).toHaveBeenCalledWith(
      'User added successfully',
      'success',
      1000,
    );
  });

  it('should show error toaster message', () => {
    const showSpy = spyOn(service, 'show');

    service.error('Something went wrong', 1000);

    expect(showSpy).toHaveBeenCalledWith('Something went wrong', 'error', 1000);
  });

  it('should add a message to messages signal', () => {
    service.show('User added successfully', 'success', 5000);

    expect(service.messages()).toEqual([
      {
        id: 0,
        text: 'User added successfully',
        type: 'success',
      },
    ]);
  });

  it('should dismiss a message', () => {
    service.show('User added successfully', 'success', 5000);

    service.dismiss(0);

    expect(service.messages()).toEqual([]);
  });
});
