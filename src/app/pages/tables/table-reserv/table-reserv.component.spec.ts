import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReservComponent } from './table-reserv.component';

describe('TableReservComponent', () => {
  let component: TableReservComponent;
  let fixture: ComponentFixture<TableReservComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableReservComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableReservComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
