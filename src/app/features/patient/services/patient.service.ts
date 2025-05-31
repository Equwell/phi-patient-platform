import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { forkJoin, map } from 'rxjs';
import type { HttpResourceRef } from '@angular/common/http';
import { HttpClient, HttpContext, HttpParams, httpResource } from '@angular/common/http';
import { CACHING_ENABLED } from '~core/interceptors/caching.interceptor';
import type { Patient } from '~features/patient/types/patient.type';
import type { PatientRequest } from '~features/patient/types/request.type';
import { getEndpoints } from '~core/constants/endpoints.constants';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly endpoints = getEndpoints();
  private readonly httpClient = inject(HttpClient);

  getPatient(patientIdOrName: string | number): Observable<Patient> {
    return this.httpClient.get<Patient>(this.endpoints.patient.v1.patient(patientIdOrName), {
      params: new HttpParams().set('limit', '1'),
      context: new HttpContext().set(CACHING_ENABLED, true),
    });
  }

  getPatientResource(patientName: () => string | undefined): HttpResourceRef<Patient | undefined> {
    return httpResource<Patient>(() =>
      patientName() ? this.endpoints.patient.v1.patient(patientName()!) : undefined,
    );
  }

  getPatientsByIds(ids: number[]): Observable<Patient[]> {
    const getPatientRequests = ids.map((id) => this.getPatient(id));
    return forkJoin(getPatientRequests).pipe(
      map((patients: Patient[]) =>
        patients.sort((patientA, patientB) => Number(patientA.order) - Number(patientB.order)),
      ),
    );
  }

  getRequests(): Observable<PatientRequest[]> {
    return this.httpClient.get<PatientRequest[]>(this.endpoints.patient.v1.requests, {
      context: new HttpContext().set(CACHING_ENABLED, true),
    });
  }
}
