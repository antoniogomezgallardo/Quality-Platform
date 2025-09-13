export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        padding: '0'
      }}>
        <nav style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'rgb(17 24 39)',
              margin: 0
            }}>
              Quality Platform Store
            </h1>
          </div>
        </nav>
      </header>

      <section style={{
        backgroundColor: 'white',
        padding: '4rem 1rem'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'rgb(17 24 39)',
            margin: '0 0 0.75rem 0'
          }}>
            <div>Quality Platform</div>
            <div style={{ color: 'rgb(37 99 235)' }}>E-commerce Demo</div>
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgb(107 114 128)',
            maxWidth: '48rem',
            margin: '0.75rem auto 0'
          }}>
            ✅ API Server Running on localhost:3001<br/>
            ✅ Authentication System Complete<br/>
            ✅ Database Seeded with Sample Data<br/>
            ✅ Swagger Documentation Available<br/>
            <br/>
            <a href="http://localhost:3001/api/docs" target="_blank" style={{
              color: 'rgb(37 99 235)',
              textDecoration: 'underline'
            }}>
              → Open API Documentation
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}