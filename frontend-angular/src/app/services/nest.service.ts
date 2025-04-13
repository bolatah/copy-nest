import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Nest {
  id?: string;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class NestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllNests(): Observable<Nest[]> {
    return this.http.get<Nest[]>(this.apiUrl);
  }

  getNestById(id: string): Observable<Nest> {
    return this.http.get<Nest>(`${this.apiUrl}/${id}`);
  }

  createNest(nest: Nest): Observable<Nest> {
    return this.http.post<Nest>(this.apiUrl, nest);
  }

  updateNest(id: string, nest: Nest): Observable<Nest> {
    return this.http.put<Nest>(`${this.apiUrl}/${id}`, nest);
  }

  deleteNest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
