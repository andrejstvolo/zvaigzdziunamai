# Žvaigždžių Namai - CyberPanel Diegimo Gidas

## 📋 Turinys
1. [Reikalavimai](#reikalavimai)
2. [Frontend diegimas](#frontend-diegimas)
3. [Backend diegimas](#backend-diegimas)
4. [MySQL duomenų bazė](#mysql-duomenų-bazė)
5. [Stripe konfigūracija](#stripe-konfigūracija)
6. [Trikčių šalinimas](#trikčių-šalinimas)

---

## Reikalavimai

- CyberPanel VPS (rekomenduojama: 2GB RAM, 20GB SSD)
- Domainas (pvz., zvaigzdziunamai.lt)
- SSL sertifikatas (Let's Encrypt)

---

## Frontend Diegimas

### 1. Sukurkite svetainę CyberPanel

1. Prisijunkite prie CyberPanel: `https://your-server:8090`
2. Eikite į **Websites** → **Create Website**
3. Užpildykite:
   - Domain: `zvaigzdziunamai.lt`
   - Package: `Default`
   - Owner: `admin`
   - PHP: `8.1` (arba naujesnė)
   - SSL: ✓ (pažymėkite)

### 2. Įkelkite frontend failus

**Būdas A: Per CyberPanel failų tvarkyklę**
```bash
# Jūsų kompiuteryje - sukurkite production build
cd /path/to/your/project
npm run build

# Suspauskite dist/ aplanką
cd dist && zip -r ../frontend.zip .
```

1. CyberPanel: **File Manager** → `public_html`
2. Ištrinkite numatytuosius failus
3. Įkelkite `frontend.zip` ir išarchyvuokite

**Būdas B: Per SSH (rekomenduojama)**
```bash
# Prisijunkite prie serverio
ssh root@your-server-ip

# Eikite į svetainės aplanką
cd /home/zvaigzdziunamai.lt/public_html

# Ištrinkite senus failus
rm -rf *

# Nukopijuokite naujus failus (iš savo kompiuterio)
scp -r /path/to/dist/* root@your-server-ip:/home/zvaigzdziunamai.lt/public_html/
```

### 3. Nustatykite teises
```bash
chown -R zvaigzdziu:zvaigzdziu /home/zvaigzdziunamai.lt/public_html
chmod -R 755 /home/zvaigzdziunamai.lt/public_html
```

---

## Backend Diegimas

### 1. Sukurkite subdomeną API

CyberPanel: **Websites** → **Create Website**
- Domain: `api.zvaigzdziunamai.lt`
- PHP: `8.1`
- SSL: ✓

### 2. Įdiekite Node.js

```bash
# Prisijunkite prie serverio
ssh root@your-server-ip

# Įdiekite Node.js (naudokite NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Patikrinkite
node -v  # v18.x.x
npm -v   # 9.x.x
```

### 3. Nukopijuokite backend failus

```bash
# Sukurkite aplanką backendui
mkdir -p /home/zvaigzdziunamai.lt/backend
cd /home/zvaigzdziunamai.lt/backend

# Nukopijuokite failus (iš savo kompiuterio)
scp -r /path/to/backend/* root@your-server-ip:/home/zvaigzdziunamai.lt/backend/

# Įdiekite priklausomybes
npm install --production

# Sukurkite .env failą
cp .env.example .env
nano .env  # Redaguokite nustatymus
```

### 4. Sukurkite PM2 procesą

```bash
# Įdiekite PM2 globally
npm install -g pm2

# Sukurkite PM2 konfigūraciją
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'zvaigzdziu-api',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
EOF

# Sukurkite logs aplanką
mkdir -p logs

# Paleiskite aplikaciją
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nustatykite Nginx reverse proxy

```bash
# Redaguokite Nginx konfigūraciją
nano /usr/local/lsws/conf/vhosts/api.zvaigzdziunamai.lt/vhost.conf
```

Pridėkite šį turinį:
```nginx
extprocessor zvaigzdziu-api {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
}

context / {
  type                    proxy
  handler                 zvaigzdziu-api
  addDefaultCharset       off
}
```

Perkraukite LiteSpeed:
```bash
/usr/local/lsws/bin/lswsctrl restart
```

---

## MySQL Duomenų Bazė

### 1. Sukurkite duomenų bazę CyberPanel

1. CyberPanel: **Databases** → **Create Database**
2. Užpildykite:
   - Database Name: `zvaigzdziu_db`
   - User: `zvaigzdziu_user`
   - Password: (sugeneruokite stiprų slaptažodį)

### 2. Importuokite schemą

```bash
# Prisijunkite prie MySQL
mysql -u zvaigzdziu_user -p

# Arba importuokite tiesiogiai
mysql -u zvaigzdziu_user -p zvaigzdziu_db < /path/to/database.sql
```

### 3. Atnaujinkite .env

```bash
nano /home/zvaigzdziunamai.lt/backend/.env
```

```env
DB_HOST=localhost
DB_USER=zvaigzdziu_user
DB_PASSWORD=jusu_slaptazodis
DB_NAME=zvaigzdziu_db
```

---

## Stripe Konfigūracija

### 1. Sukurkite Stripe paskyrą
- Eikite į https://stripe.com
- Sukurkite paskyrą
- Gaukite API raktus

### 2. Atnaujinkite .env

```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Sukurkite Webhook endpoint

Stripe Dashboard → Developers → Webhooks:
- Endpoint URL: `https://api.zvaigzdziunamai.lt/api/webhooks/stripe`
- Events: `payment_intent.succeeded`

---

## Automatinis atnaujinimas per Git (CI/CD)

### 1. Sukurkite GitHub/GitLab repozitoriją

### 2. Pridėkite deploy scriptą

```bash
# /home/zvaigzdziunamai.lt/deploy.sh
#!/bin/bash
cd /home/zvaigzdziunamai.lt/backend
git pull origin main
npm install
pm2 restart zvaigzdziu-api

cd /home/zvaigzdziunamai.lt/public_html
git pull origin main
npm install
npm run build
```

### 3. Nustatykite webhook (GitHub)

GitHub → Settings → Webhooks:
- Payload URL: `https://api.zvaigzdziunamai.lt/webhook/deploy`
- Secret: (sugeneruokite)

---

## Trikčių Šalinimas

### Patikrinkite log failus
```bash
# Backend logs
pm2 logs zvaigzdziu-api

# Nginx logs
tail -f /usr/local/lsws/logs/error.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

### Patikrinkite ar backend veikia
```bash
curl http://localhost:3001/api/health
```

### Perkraukite viską
```bash
pm2 restart zvaigzdziu-api
/usr/local/lsws/bin/lswsctrl restart
```

---

## Naudingos komandos

```bash
# Peržiūrėti visus procesus
pm2 status

# Peržiūrėti logus realiu laiku
pm2 logs

# Išvalyti logus
pm2 flush

# Atnaujinti PM2
pm2 update

# Sukurti backup
cd /home/zvaigzdziunamai.lt
mysqldump -u zvaigzdziu_user -p zvaigzdziu_db > backup_$(date +%Y%m%d).sql
tar -czf backup_$(date +%Y%m%d).tar.gz public_html backend
```

---

## Kontaktai pagalbai

Jei kyla problemų:
1. Patikrinkite log failus
2. Patikrinkite ar visos paslaugos veikia: `pm2 status`
3. Kreipkitės į CyberPanel forumą: https://community.cyberpanel.net
