# Customer Service AI Assistant

Bu proje, yapay zeka destekli bir müşteri hizmetleri asistanı uygulamasıdır. Kullanıcıların sorularını yanıtlamak ve müşteri hizmetleri süreçlerini otomatikleştirmek için tasarlanmıştır.

## Proje Yapısı

Proje iki ana bölümden oluşmaktadır:

- **Frontend**: Next.js ile geliştirilmiş modern bir web arayüzü
- **Backend**: AWS Lambda ve API Gateway kullanılarak oluşturulmuş serverless bir mimari

## Teknolojiler

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React

### Backend
- AWS Lambda
- API Gateway
- S3
- Node.js

## Kurulum

### Ön Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn
- AWS hesabı (backend deployment için)

### Frontend Kurulumu
1. Frontend dizinine gidin:
```bash
cd AWS-CustomerServ/frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Örnek çevre değişkenleri dosyasını kopyalayın:
```bash
cp .env.example .env.local
```

4. `.env.local` dosyasını gerçek API Gateway URL'iniz ile güncelleyin.

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

### Backend Kurulumu
1. Backend Lambda dizinine gidin:
```bash
cd AWS-CustomerServ/backend/CustomerService/lambda/chat
```

2. Örnek çevre değişkenleri dosyasını kopyalayın:
```bash
cp .env.example .env
```

3. `.env` dosyasını gerçek AWS yapılandırmalarınızla güncelleyin.

## Özellikler

- Gerçek zamanlı sohbet arayüzü
- Yapay zeka destekli yanıtlar
- Kullanıcı kimlik doğrulama
- Sohbet geçmişi

## Güvenlik Notları

- `.env` dosyalarını asla repository'ye commit etmeyin
- Her zaman `.env.example` dosyalarını şablon olarak kullanın
- AWS kimlik bilgilerinizi ve hassas bilgilerinizi güvende tutun
- Lambda fonksiyonları için sabit kodlanmış kimlik bilgileri yerine AWS IAM rollerini ve politikalarını kullanın

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Sorularınız veya geri bildirimleriniz için lütfen iletişime geçin. 