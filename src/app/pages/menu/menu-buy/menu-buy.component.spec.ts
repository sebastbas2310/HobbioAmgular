import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBuyComponent } from './menu-buy.component';

describe('MenuBuyComponent', () => {
  let component: MenuBuyComponent;
  let fixture: ComponentFixture<MenuBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
