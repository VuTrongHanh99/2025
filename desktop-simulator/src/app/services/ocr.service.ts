import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OcrService {
  constructor(private http: HttpClient) { }

  detectText(base64Image: string) {
    const payload = {
      requests: [{
        image: { content: base64Image },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
      }]
    };
    const apiKey = 'AIzaSyCrCndUDfKXTmI7X7hUiMPPT1kOr491Ug4'; // Thay bằng key của bạn
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    return this.http.post<any>(url, payload);
  }
}
