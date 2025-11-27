export async function getCsrfToken() {
    try {
        await fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include'
        });
    } catch (e) {
        console.error(e);
        
    }
}