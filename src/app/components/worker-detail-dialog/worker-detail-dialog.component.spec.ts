import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDetailDialogComponent } from './worker-detail-dialog.component';

describe('WorkerDetailDialogComponent', () => {
  let component: WorkerDetailDialogComponent;
  let fixture: ComponentFixture<WorkerDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
