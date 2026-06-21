import React, { useState } from 'react';

export default function GCPGuide() {
  const [activeGcpTab, setActiveGcpTab] = useState('cloudrun');
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const cloudRunCommands = `# 1. Login to Google Cloud SDK
gcloud auth login

# 2. Set your active Google Cloud project ID
gcloud config set project [YOUR_PROJECT_ID]

# 3. Build and containerize using Google Cloud Build
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/carbonpulse-app

# 4. Deploy to Google Cloud Run as serverless service
gcloud run deploy carbonpulse-app \\
  --image gcr.io/[YOUR_PROJECT_ID]/carbonpulse-app \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated`;

  const dockerfileCode = `FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]`;

  const nginxCode = `server {
    listen 8080;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}`;

  const firebaseCommands = `# 1. Install Firebase tools CLI globally
npm install -g firebase-tools

# 2. Authenticate CLI with Google Account
firebase login

# 3. Initialize project setup
# (Choose: Hosting, select SPA config, set output directory to "dist")
firebase init hosting

# 4. Build the production React-Vite static bundle
npm run build

# 5. Deploy the production folder to Firebase CDN
firebase deploy`;

  return (
    <div className="card col-12 animate-fade-in">
      <h3 className="card-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Google Cloud Platform (GCP) Deployment Guide
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Learn how to deploy your premium CarbonPulse application to Google Cloud. We provide configurations for both serverless containers and static CDN hosting.
      </p>

      <div className="guide-tabs" style={{ marginBottom: '20px' }}>
        <button 
          className={`guide-tab-btn ${activeGcpTab === 'cloudrun' ? 'active' : ''}`}
          onClick={() => setActiveGcpTab('cloudrun')}
        >
          🚀 Option A: Google Cloud Run (Containerized Nginx)
        </button>
        <button 
          className={`guide-tab-btn ${activeGcpTab === 'firebase' ? 'active' : ''}`}
          onClick={() => setActiveGcpTab('firebase')}
        >
          🔥 Option B: Firebase Hosting (Static Single-Page App)
        </button>
      </div>

      {activeGcpTab === 'cloudrun' && (
        <div className="gcp-guide-section animate-fade-in">
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: '#fff' }}>
              Why Cloud Run?
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Cloud Run runs containerized services serverlessly. It automatically scales down to **zero instances** when there is no traffic, costing you $0.00, and scales up instantly on demand. It is ideal if you add node/python microservices later.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: '600', fontSize: '14px' }}>Terminal Deployment Commands</h5>
              <span className="copy-badge" onClick={() => copyToClipboard(cloudRunCommands, 'cr-cli')}>
                {copiedId === 'cr-cli' ? 'Copied!' : 'Copy'}
              </span>
            </div>
            <div className="code-container">
              <pre className="code-block">{cloudRunCommands}</pre>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: '600', fontSize: '14px' }}>Production Dockerfile config</h5>
              <span className="copy-badge" onClick={() => copyToClipboard(dockerfileCode, 'dockerfile')}>
                {copiedId === 'dockerfile' ? 'Copied!' : 'Copy'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0' }}>
              This multi-stage Dockerfile builds the Vite React assets and hosts them using Nginx Alpine.
            </p>
            <div className="code-container">
              <pre className="code-block">{dockerfileCode}</pre>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: '600', fontSize: '14px' }}>Nginx Configuration (nginx.conf)</h5>
              <span className="copy-badge" onClick={() => copyToClipboard(nginxCode, 'nginx')}>
                {copiedId === 'nginx' ? 'Copied!' : 'Copy'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0' }}>
              Nginx listens on port 8080 (GCP's standard default container port) and serves the index router fallback for React.
            </p>
            <div className="code-container">
              <pre className="code-block">{nginxCode}</pre>
            </div>
          </div>
        </div>
      )}

      {activeGcpTab === 'firebase' && (
        <div className="gcp-guide-section animate-fade-in">
          <div>
            <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: '#fff' }}>
              Why Firebase Hosting?
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Firebase Hosting is a Google Cloud-backed global CDN built for static frontends. It has zero configuration, provides an automated SSL certificate, and has an extensive free tier, making it the easiest deployment vector for React-Vite frontends.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ fontWeight: '600', fontSize: '14px' }}>Hosting CLI commands</h5>
              <span className="copy-badge" onClick={() => copyToClipboard(firebaseCommands, 'fb-cli')}>
                {copiedId === 'fb-cli' ? 'Copied!' : 'Copy'}
              </span>
            </div>
            <div className="code-container">
              <pre className="code-block">{firebaseCommands}</pre>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}>
            💡 <strong>Setup Tip:</strong> During `firebase init`, select <strong>Hosting: Configure files for Firebase Hosting</strong>, configure as a single-page app (write **yes** to redirect all URLs to index.html), and specify <strong>dist</strong> as your public directory (since Vite builds assets to `dist/`).
          </div>
        </div>
      )}
    </div>
  );
}
