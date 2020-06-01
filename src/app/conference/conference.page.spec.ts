import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConferencePage } from './conference.page';

describe('ConferencePage', () => {
  let component: ConferencePage;
  let fixture: ComponentFixture<ConferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
