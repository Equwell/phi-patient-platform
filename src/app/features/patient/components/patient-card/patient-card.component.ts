import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import type { Patient } from '~features/patient/types/patient.type';
import { CardComponent } from '~core/components/card/card.component';
import { FirstTitleCasePipe } from '~core/pipes/first-title-case.pipe';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-card',
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, FirstTitleCasePipe, MatIconModule, MatCardModule, MatButtonModule, MatListModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PatientCardComponent implements OnInit {
  readonly patient = input<Patient>();
  readonly notifications = input<{ id: number, message: string, isRead: boolean }[]>();
  readonly loading = input<boolean>();

  patientImage: string | undefined;

  ngOnInit() {
    this.patientImage = this.patient()?.img;
  }
}
