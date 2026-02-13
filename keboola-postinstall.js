import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const appDir = resolve(import.meta.dirname);
const distPath = resolve(appDir, "dist");

// Build the production bundle
console.log("Building production bundle...");
execSync("npx tsc -b && npx vite build", { cwd: appDir, stdio: "inherit" });
console.log("Build complete. dist path:", distPath);

// Write nginx main config with /tmp temp paths (fixes permission denied error)
const mainConfig = `worker_processes auto;
pid /tmp/nginx.pid;
error_log /tmp/nginx_error.log;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server_tokens off;

    client_body_temp_path /tmp/nginx_body;
    proxy_temp_path /tmp/nginx_proxy;
    fastcgi_temp_path /tmp/nginx_fastcgi;
    uwsgi_temp_path /tmp/nginx_uwsgi;
    scgi_temp_path /tmp/nginx_scgi;

    access_log off;
    sendfile on;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    include /tmp/nginx_default.conf;
}
`;

const serverConfig = `server {
    listen 80;
    server_name _;
    root ${distPath};
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`;

try {
  writeFileSync("/tmp/nginx.conf", mainConfig);
  writeFileSync("/tmp/nginx_default.conf", serverConfig);
  console.log("Nginx configs written to /tmp/nginx.conf and /tmp/nginx_default.conf");
} catch (err) {
  console.warn("Could not write nginx configs to /tmp/:", err.message);
}
