import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '~core/services/ui/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import type { PatientRequest } from '~features/patient/types/request.type';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
})
export class RequestDetailComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);

  readonly requestId = toSignal(
    this.activatedRoute.paramMap.pipe(map((parameters) => parameters.get('requestId') ?? '')),
    { initialValue: '' },
  );
  readonly requestResource = signal<PatientRequest | null>(null);
  readonly request = signal<PatientRequest | null>(null);

  constructor() {
    effect(() => {
      if (this.requestResource()) {
        // Handle valid request resource
      }
    });
  }
}