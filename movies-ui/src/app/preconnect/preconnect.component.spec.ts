import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreconnectComponent } from './preconnect.component';

describe('PreconnectComponent', () => {
  let component: PreconnectComponent;
  let fixture: ComponentFixture<PreconnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreconnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
