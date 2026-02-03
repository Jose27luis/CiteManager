import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="glass animate-fade" style={{ padding: '3rem', maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CiteManager
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Gestión de distribución de agua con tecnología de vanguardia y diseño premium.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/auth/login" className="glass" style={{ padding: '0.8rem 2rem', background: 'var(--primary)', color: '#000', fontWeight: 'bold', border: 'none' }}>
            Acceder al Sistema
          </a>
        </div>
      </div>
    </main>
  );
}
