import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
  private nestsSubject = new BehaviorSubject<Nest[]>([]);
  public nests$ = this.nestsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllNests().subscribe((nests) => {
      this.nestsSubject.next(nests);
    });
  }

  getAllNests(): Observable<Nest[]> {
    return this.http.get<Nest[]>(this.apiUrl).pipe(
      tap((nests) => {
        this.nestsSubject.next(nests.reverse());
      })
    );
  }

  getNestById(id: string): Observable<Nest> {
    return this.http.get<Nest>(`${this.apiUrl}/${id}`);
  }

  createNest(nest: Nest): Observable<Nest> {
    return this.http.post<Nest>(this.apiUrl, nest).pipe(
      tap((newNest) => {
        this.nestsSubject.next([ newNest, ...this.nestsSubject.getValue()]);
      })
    );
  }

  updateNest(id: string, nest: Nest): Observable<Nest> {
    return this.http.put<Nest>(`${this.apiUrl}/${id}`, nest).pipe(
      tap((updatedNest) => {
        const currentNests = this.nestsSubject.getValue();
        const updatedNests = currentNests.map((item) =>
          item.id === id ? updatedNest : item
        );
        this.nestsSubject.next(updatedNests);
      })
    );
  }

  deleteNest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentNests = this.nestsSubject.getValue();
        const updatedNests = currentNests.filter((item) => item.id !== id);
        this.nestsSubject.next(updatedNests);
      })
    );
  }
}
