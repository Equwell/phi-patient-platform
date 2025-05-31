import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, viewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from '~features/authentication/services/user.service';
import { CommonModule } from '@angular/common';
import { translations } from '../../../../../locale/translations';
import type { MatSidenav} from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from '~core/services/ui/alert.service';
import type { Observable} from 'rxjs';
import { catchError, map, of, switchMap } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';
import { SearchInputComponent } from '~features/patient/components/search-input/search-input.component';
import { PatientService } from '~features/patient/services/patient.service';
import { PatientCardComponent } from '~features/patient/components/patient-card/patient-card.component';

// Use the shared PatientRequest type for consistency
import type { PatientRequest } from '../../types/request.type';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss',
  imports: [
    CommonModule,
    PatientCardComponent,
    // NgOptimizedImage,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    PushPipe,
    LetDirective,
    SearchInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
   // Temporarily disable encapsulation for testing
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyRequestsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly requestsService = inject(PatientService);
  private readonly alertService = inject(AlertService);

  readonly translations = translations;

  readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  private readonly breakpointObserver = inject(BreakpointObserver);

  isPatientDetailsVisible = true;
  
  // Patient information
  patient = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    id: 1,
    order: '1',
    height: '180',
    weight: '70',
    img: 'assets/images/profile-placeholder.jpg'
  };
  
  // Notifications or updates
  notifications = [
    { id: 1, message: 'Your appointment is confirmed for tomorrow at 10:00 AM', isRead: false },
    { id: 2, message: 'New lab results are available', isRead: true }
  ];
  
  // Patient requests
  patientRequests: PatientRequest[] = [
    { 
      id: 1, 
      type: 'Appointment', 
      date: new Date('2025-04-20'), 
      status: 'Scheduled', 
      patientId: 1,
      details: 'General checkup with Dr. Smith at 10:00 AM' 
    },
    { 
      id: 2, 
      type: 'Consultation', 
      date: new Date('2025-04-15'), 
      status: 'Pending',
      patientId: 1,
      details: 'Online consultation regarding medication side effects' 
    },
    { 
      id: 3, 
      type: 'Prescription Refill', 
      date: new Date('2025-04-10'), 
      status: 'Completed',
      patientId: 1,
      details: 'Refill for hypertension medication' 
    }
  ];
  
  selectedRequest: PatientRequest | null = null;
  
  // Observable to handle responsive behavior
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  
  
  ngOnInit(): void {
    // Set the first request as selected by default
    if (this.patientRequests.length > 0) {
      this.selectedRequest = this.patientRequests[0] ?? null;
    }
    this.fetchRequests();
  }

   // TrackBy function for notifications
   trackByNotificationId(index: number, notification: { id: number }): number {
    return notification.id;
  }

  // TrackBy function for patient requests
  trackByRequestId(index: number, request: { id: number }): number {
    return request.id;
  }
  
  // Select a request and close sidenav on mobile
  selectRequest(request: PatientRequest): void {
    this.selectedRequest = request;
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        void this.sidenav().close();
      }
    });
  }

  togglePatientDetailsVisibility(): void {
    this.isPatientDetailsVisible = !this.isPatientDetailsVisible;
  }

  createNewRequest() {
    // Logic to create a new request
    throw new Error('Not implemented');
  }
  
  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }
  readonly userRequests$ = this.userService.getMe({ cache: false }).pipe(
    switchMap((user) => {
      if (user.caughtPokemonIds.length === 0) {
        return of([]);
      }
      return this.requestsService.getPatientsByIds(user.caughtPokemonIds);
    }),
    catchError(() => {
      this.alertService.createErrorAlert(translations.genericErrorAlert);
      return of([]);
    }),
  );

  private fetchRequests(): void {
    this.requestsService.getRequests().pipe(
      catchError((error) => {
        throw new Error(`Failed to fetch requests: ${  error}`);
      })
    ).subscribe((requests) => {
      this.patientRequests = requests;
      if (this.patientRequests.length > 0) {
        this.selectedRequest = this.patientRequests[0] ?? null;
      }
    });
  }
}
