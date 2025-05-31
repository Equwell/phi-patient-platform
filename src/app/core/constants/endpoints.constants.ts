import { inject } from '@angular/core';
import type { Environment } from '~core/tokens/environment.token';
import { ENVIRONMENT } from '~core/tokens/environment.token';

const getAuthEndpoints = (environment: Environment) => ({
  v1: {
    authentication: `${environment.apiBaseUrl}/v1/authentication`,
    login: `${environment.apiBaseUrl}/v1/authentication/login`,
    refreshToken: `${environment.apiBaseUrl}/v1/authentication/token/refresh`,
  },
});

const getUserEndpoints = (environment: Environment) => ({
  v1: {
    user: `${environment.apiBaseUrl}/v1/user`,
    pokemonCatch: `${environment.apiBaseUrl}/v1/user/pokemon/catch`,
  },
});

const getPatientEndpoints = (environment: Environment, PATIENT_API_HOST: string) => ({
  v1: {
    patient: (patientIdOrName: string | number) =>
      `${PATIENT_API_HOST}/v2/patient/${patientIdOrName}`,
    requests: `${environment.apiBaseUrl}/v1/requests`,
  },
});

const getAnalyticsEndpoints = (environment: Environment) => ({
  v1: {
    realtimeUsers: `${environment.apiBaseUrl}/v1/analytics/realtime-users`,
  },
});

export const getEndpoints = () => {
  const environment = inject<Environment>(ENVIRONMENT);
  const PATIENT_API_HOST = 'https://patients/api'; // Update this with the actual API host
  return {
    auth: getAuthEndpoints(environment),
    user: getUserEndpoints(environment),
    patient: getPatientEndpoints(environment, PATIENT_API_HOST),
    analytics: getAnalyticsEndpoints(environment),
  } as const;
};
