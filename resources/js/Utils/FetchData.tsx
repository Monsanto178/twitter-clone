import { getCookie } from "./GetCookie";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function fetchData<T>(
    url: string,
    method: RequestMethod = 'GET',
    body?: FormData | Record<string, unknown>,
    signal?: AbortSignal
): Promise<T> {
    const headers: HeadersInit = {};
    if (method !== 'GET') {
        const csrfToken = getCookie('XSRF-TOKEN');
        
        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = csrfToken;
        }
    }

    let bodyContent: BodyInit | null = null;
    if(body) {
        if(body instanceof FormData) {
            bodyContent = body;
        } else {
            bodyContent = JSON.stringify(body);
            headers['Content-Type'] = 'application/json'
        }
    }
    
    const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: bodyContent,
        signal
    });

    if(!response.ok) {
        if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");
        
        throw new Error(`Error trying ${method} ${url} : ${response.statusText}`);
    };

    if (typeof ({} as T) === 'undefined') {
        return undefined as unknown as T;
    }
    
    const data:T = await response.json();
    return data;
}