import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentEmailsListComponent } from './sent-emails-list.component';

describe('SentEmailsListComponent', () => {
  let component: SentEmailsListComponent;
  let fixture: ComponentFixture<SentEmailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentEmailsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentEmailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
