export function LogoutPage() {
    localStorage.removeItem('token');
    window.location.href = '/';
    return <div>Logging you out...</div>;
}