import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // The World Bank API base URL.
  private baseUrl = 'http://api.worldbank.org/V2/country/';

  constructor(private http: HttpClient) { }

  // Get country details from the World Bank API.
  getCountryDetails(countryCode: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}${countryCode}?format=json`);
  }

  // Get additional data from the World Bank API.
  getAdditionalData(countryCode: string, indicator: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}${countryCode}/indicator/${indicator}?format=json`);
  }
}