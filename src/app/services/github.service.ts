import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import axios from 'axios';
import { TASK } from '../types/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private apiUrl = 'https://api.github.com/repos';
  private token = environment.gh_token;

  getFileContent(owner: string, repo: string, path: string): Observable<{ content: TASK[], sha: string }> {
    const url = `${this.apiUrl}/${owner}/${repo}/contents/${path}`;

    return new Observable(observer => {
      axios.get(url, {
        headers: {
          'Authorization': `token ${this.token}`
        }
      })
      .then(response => {
        console.log("response", response)
        const cleanedBase64 = response.data.content.replace(/\s/g, '');
        console.log("cleanedBase64", cleanedBase64)

        try {
          const content = JSON.parse(atob(cleanedBase64)); // Decodificar Base64 y parsear JSON
        console.log("content", content)

          observer.next({ content, sha: response.data.sha });
        } catch (e) {
          console.error('Error al decodificar Base64 o parsear JSON', e);
          //observer.next({ content: null, sha: response.data.sha });
        }
        observer.complete();
      })
      .catch(error => {
        console.error('Error en la solicitud GET', error);
        observer.error(error);
      });
    });
  }

  updateFileContent(owner: string, repo: string, path: string, newContent: TASK[], sha: string): Observable<any> {
    const url = `${this.apiUrl}/${owner}/${repo}/contents/${path}`;
    const body = {
      message: 'Update file content via API',
      content: btoa(JSON.stringify(newContent)), // Codificar nuevo contenido en Base64
      sha: sha // SHA del archivo actual
    };

    return new Observable(observer => {
      axios.put(url, body, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        observer.next(response.data);
        observer.complete();
      })
      .catch(error => {
        console.error('Error en la solicitud PUT', error);
        observer.error(error);
      });
    });
  }
}
