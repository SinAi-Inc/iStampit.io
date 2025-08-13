export default function Home() {
  return (
    <main style={{padding: '2rem', fontFamily: 'sans-serif'}}>
      <h1>iStampit Auth Service</h1>
      <p>This minimal app hosts authentication endpoints.</p>
      <a href="/api/auth/signin" style={{color: '#2563eb'}}>Sign in with Google</a>
    </main>
  );
}
