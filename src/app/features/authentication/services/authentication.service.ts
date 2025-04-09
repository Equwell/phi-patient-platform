import { inject, Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE } from '~core/providers/local-storage';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { LoginRequest } from '~features/authentication/types/login-request.type';
import type { LoginResponse } from '~features/authentication/types/login-response.type';
import type {
  RefreshTokenResponse,
  RefreshTokenResponseData,
} from '~features/authentication/types/refresh-token.response.type';
import type { RegisterRequest } from '~features/authentication/types/register-request.type';
import type {
  RegisterResponse,
  RegisterResponseData,
} from '~features/authentication/types/register-response.type';
import { LanguageService } from '~core/services/language.service';
import type { User } from '~features/authentication/types/user.type';
import { clearCache } from '~core/interceptors/caching.interceptor';
import { getEndpoints } from '~core/constants/endpoints.constants';

export const ACCESS_TOKEN_KEY = 'access-token';
export const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly endpoints = getEndpoints();
  private readonly storageService = inject(LOCAL_STORAGE);
  private readonly httpClient = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly _isUserLoggedIn = signal(!!this.storageService?.getItem(ACCESS_TOKEN_KEY));

  readonly isUserLoggedIn = this._isUserLoggedIn.asReadonly();

  register(registerRequest: RegisterRequest): Observable<RegisterResponseData> {
    return this.httpClient
      .post<RegisterResponse>(
        this.endpoints.auth.v1.authentication,
        {
          email: registerRequest.email.toLowerCase(),
          password: registerRequest.password,
          name: registerRequest.name,
          favouritePokemonId: registerRequest.favouritePokemonId,
          terms: registerRequest.terms,
        },
        {
          headers: {
            'Accept-Language': this.languageService.convertLocaleToAcceptLanguage(),
          },
        },
      )
      .pipe(
        map((response: RegisterResponse) => {
          const { data } = response;
          this.saveTokens(data);
          this._isUserLoggedIn.set(true);
          return data;
        }),
      );
  }

  logIn(loginRequest: LoginRequest): Observable<User> {
    return this.httpClient
      .post<LoginResponse>(this.endpoints.auth.v1.login, {
        email: loginRequest.email.toLowerCase(),
        password: loginRequest.password,
      })
      .pipe(
        map((response: LoginResponse) => {
          const { data } = response;
          this.saveTokens(data);
          this._isUserLoggedIn.set(true);
          return data.user;
        }),
      );
  }

  refreshToken(): Observable<RefreshTokenResponseData> {
    return this.httpClient
      .post<RefreshTokenResponse>(this.endpoints.auth.v1.refreshToken, {
        refreshToken: this.storageService?.getItem(REFRESH_TOKEN_KEY),
      })
      .pipe(
        map((response: RefreshTokenResponse) => {
          const { data } = response;
          this.saveTokens(data);
          return data;
        }),
      );
  }

  logOut() {
    clearCache();
    this.removeTokens();
    this._isUserLoggedIn.set(false);
  }

  private saveTokens(data: { accessToken: string; refreshToken?: string }) {
    this.storageService?.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      this.storageService?.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
  }

  private removeTokens() {
    this.storageService?.removeItem(ACCESS_TOKEN_KEY);
    this.storageService?.removeItem(REFRESH_TOKEN_KEY);
  }
}
