// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import decode from 'jwt-decode';
(window as any).global = window;

@Injectable()
export class AuthService {
  userProfile: any;
  idTokenPayload;
  auth0 = new auth0.WebAuth({
    clientID: 'WooIm3FGwAoEGi7ltppuZiiqrPqjM4ma',
    domain: 'auth-ng6-start.auth0.com',
    responseType: 'token id_token',
    audience: 'https://auth-ng6-start.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile'
  });

  constructor(public router: Router) { }

  public login(): void {
    this.auth0.authorize();
  }


  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      console.log('authResult', authResult);


      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
      } 
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.getProfile()
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    console.log(new Date().getTime());
    console.log(expiresAt);
    

    return new Date().getTime() < expiresAt;
  }
  
  public getProfile(cb?): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      console.log("profile=>", profile);
      this.idTokenPayload = decode(localStorage.getItem('id_token'));
      console.log(this.idTokenPayload['http://localhost:4200/First_Name']);
      console.log(this.idTokenPayload);
      if (profile) {
        self.userProfile = profile;

      }
      // cb(err, profile);
      // https://github.com/auth0/auth0.js/issues/433
    });


  }

}