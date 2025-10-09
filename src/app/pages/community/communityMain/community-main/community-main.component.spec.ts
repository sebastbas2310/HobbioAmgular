import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMainComponent } from './community-main.component';

describe('CommunityMainComponent', () => {
  let component: CommunityMainComponent;
  let fixture: ComponentFixture<CommunityMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
