<img width="1720" height="1314" alt="Admin Giriş " src="https://github.com/user-attachments/assets/fd987ed4-c3e1-48d2-99a1-63d460e0aac2" /># RentCar

<p align="center">
  <strong>Modern araç kiralama süreçlerini uçtan uca yöneten full-stack proje</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=flat&logo=angular" alt="Angular 20" />
  <img src="https://img.shields.io/badge/.NET-9-512BD4?style=flat&logo=dotnet" alt=".NET 9" />
  <img src="https://img.shields.io/badge/SQL%20Server-EF%20Core-CC2927?style=flat&logo=microsoftsqlserver" alt="SQL Server" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript" alt="TypeScript" />
</p>

---

## İçindekiler

- [Projeyi Tanıtalım](#projeyi-tanıtalım)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Teknoloji Yığını](#teknoloji-yığını)
- [E-posta / SMTP Yapısı](#e-posta--smtp-yapısı)
- [Mimari](#mimari)
- [Öne Çıkan Özellikler](#öne-çıkan-özellikler)
- [Canlı İş Akışları](#canlı-iş-akışları)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [Geliştirme Notları](#geliştirme-notları)

---

## Projeyi Tanıtalım

**RentCar**, araç kiralama sektöründe müşteri deneyimini ve operasyonel yönetimi tek bir platformda birleştiren kapsamlı bir full-stack uygulamadır. Proje, hem son kullanıcıların (müşterilerin) araç kiralamasını hem de işletme personelinin tüm süreçleri yönetmesini sağlayan iki ayrı web uygulamasından oluşur.

### Müşteri Uygulaması (UI)

Müşteriler, araç kiralama sürecini baştan sona dijital ortamda tamamlayabilir:

- **Ana Sayfa** — Hızlı başlangıç ve rezervasyon akışına giriş
- **Araç Seçimi** — Tarih, kategori ve filtre kriterlerine göre müsait araç listesi
- **Güvence Paketi Seçimi** — Farklı kapsam seçenekleriyle sigorta paketleri
- **Ücret ve Ekstra Hizmetler** — Ek donanım ve hizmet seçenekleri
- **Sürücü Detayları** — Müşteri bilgileri ve ehliyet girişi
- **Rezervasyon Onayı** — Özet görüntüleme ve onay
- **Kiralama Geçmişi** — Geçmiş rezervasyonlar ve detay görüntüleme
- **Profil Yönetimi** — Hesap bilgileri, şifre değiştirme, şifremi unuttum

### Admin Paneli

Operasyon ekibi için merkezi yönetim arayüzü:

- **Dashboard** — Gelir metrikleri, operasyon özetleri ve grafikler
- **Şubeler** — Şube ekleme, düzenleme ve detay yönetimi
- **Roller ve Yetkiler** — Rol tabanlı erişim kontrolü ve izin yönetimi
- **Kategoriler** — Araç kategorileri (ekonomi, sedan, SUV vb.)
- **Güvence Paketleri** — Sigorta paket tanımları
- **Kullanıcılar** — Admin kullanıcı yönetimi
- **Ekstra Hizmetler** — Ek donanım ve hizmet tanımları
- **Araçlar** — Araç envanteri, ekleme, düzenleme, detay
- **Müşteriler** — Müşteri kayıtları ve geçmiş
- **Rezervasyonlar** — Rezervasyon listesi, detay, oluşturma
- **Teslim / İade Formları** — KM, hasar, ekipman ve görsel kayıtları

### Güvenlik ve İletişim

- JWT tabanlı kimlik doğrulama
- Rol ve yetki bazlı erişim kontrolü
- Rate limiting ile API koruması
- SMTP ile şifre sıfırlama ve e-posta doğrulama akışları

---

## Ekran Görüntüleri

### Admin Paneli

| Ekran | Görsel |
|-------|--------|
| Admin Giriş | ![Admin Giriş](<img width="1720" height="1314" alt="Admin Giriş " src="https://github.com/user-attachments/assets/23550eab-c2c4-4e66-9322-7daa42cf88d5" />) |
| Dashboard | ![Dashboard](<img width="2850" height="1582" alt="Dashboard" src="https://github.com/user-attachments/assets/859db5c4-a98a-4c0d-9429-afd15d86673e" />) |
| Araçlar | ![Araçlar](<img width="2880" height="1590" alt="Araçlar" src="https://github.com/user-attachments/assets/b435276d-4f8f-4bb0-942d-83d0a4b45381" />) |
| Araç Ekle (1) | ![Araç Ekle 1](<img width="2848" height="1584" alt="Araç Ekle 1" src="https://github.com/user-attachments/assets/e3282e4e-bf40-4ba8-837c-ff48f7b262ee" />) |
| Araç Ekle (2) | ![Araç Ekle 2](<img width="2848" height="1578" alt="Araç Ekle 2 " src="https://github.com/user-attachments/assets/2986bd3a-2166-422f-b769-dd2fc77762a6" />) |
| Araç Detay | ![Araç Detay](<img width="2846" height="1584" alt="Araç Detay" src="https://github.com/user-attachments/assets/ae6c9d98-ecb8-49df-b3fd-3dbd6c6976a8" />) |
| Rezervasyonlar | ![Rezervasyonlar](<img width="2848" height="1584" alt="Rezervasyonlar " src="https://github.com/user-attachments/assets/6a630d1e-cd3d-4596-981f-59c221ac51de" />) |
| Rezervasyon Detayı | ![Rezervasyon Detayı](<img width="2858" height="1584" alt="Rezervasyon Detayı" src="https://github.com/user-attachments/assets/40aece33-4357-4bcf-96f4-ff731668635b" />) |
| Rezervasyon Ekle (1) | ![Rezervasyon Ekle 1](<img width="2854" height="1584" alt="Rezervasyon Ekle 1 " src="https://github.com/user-attachments/assets/b0a9b4f0-8d14-410d-b2aa-085e271506a4" />) |
| Rezervasyon Ekle (2) | ![Rezervasyon Ekle 2](<img width="2852" height="1584" alt="Rezervasyon Ekle 2 " src="https://github.com/user-attachments/assets/123814d7-b711-428a-969e-9ad1d86e61c7" />) |
| Araç Teslim Formu | ![Araç Teslim Formu](<img width="2850" height="1582" alt="Araç Teslim Formu " src="https://github.com/user-attachments/assets/2c6d32aa-8740-41d2-ad5a-0e9010d0bbe3" />) |
| Araç İade Formu | ![Araç İade Formu](<img width="2850" height="1584" alt="Araç İade Formu" src="https://github.com/user-attachments/assets/644bd08a-9bc0-4514-9d68-79bf734f4e7a" />) |
| Şifre Sıfırlama Bağlantısı | ![Şifre Sıfırlama Bağlantısı](<img width="2876" height="1588" alt="Şifre Sıfırlama Bağlantısı" src="https://github.com/user-attachments/assets/aeb2ad9c-6c0f-4aad-909d-f7b45fada6ff" />) |
| Şifre Sıfırlama | ![Şifre Sıfırlama](<img width="2852" height="1592" alt="Şifre Sıfırlama 2 " src="https://github.com/user-attachments/assets/427e0a8e-3c62-472a-a6fa-661e381147be" />) |


### Müşteri Uygulaması (UI)

| Ekran | Görsel |
|-------|--------|
| Giriş Yap | ![Giriş Yap](<img width="2880" height="1582" alt="Giriş Yap" src="https://github.com/user-attachments/assets/363de725-cfff-432b-bdeb-b0669c77ba96" />) |
| Kayıt Ol | ![Kayıt Ol](<img width="2880" height="1578" alt="Kayıt Ol " src="https://github.com/user-attachments/assets/c9fc1ed8-6e3a-42e0-9d67-a3e84b40b1a7" />) |
| Araç Seçimi | ![Araç Seçimi](<img width="2876" height="1580" alt="Araç Seçimi 1 " src="https://github.com/user-attachments/assets/20b8f255-bb6e-4c15-b6e0-387b049cacfe" />) |
| Güvence Paketi Seçimi | ![Güvence Paketi Seçimi](<img width="2874" height="1584" alt="Güvence Paketi Seçimi 2 " src="https://github.com/user-attachments/assets/3a9f509e-ab90-4e1f-8ffc-fbe6cd39c9ea" />) |
| Ücret ve Ekstra Seçimi | ![Ücret ve Ekstra Seçimi](<img width="2866" height="1580" alt="Ücret   Ekstra Seçimi 3" src="https://github.com/user-attachments/assets/0bc64fed-e4bc-470a-aa5a-593d748da8bc" />) |
| Sürücü Detay | ![Sürücü Detay](<img width="2872" height="1580" alt="Sürücü Detay 4 " src="https://github.com/user-attachments/assets/fd52a362-1284-4371-a9ef-18c1437e5b8f" />) |
| Rezervasyon Onay | ![Rezervasyon Onay](<img width="2880" height="1578" alt="Rezervasyon Onay 5 " src="https://github.com/user-attachments/assets/a6d68cff-9605-4d09-8a91-e76680c3b3bc" />) |
| Kiralama Geçmişi | ![Kiralama Geçmişi](<img width="2880" height="1584" alt="Araba Kiralama Geçmişi" src="https://github.com/user-attachments/assets/f607d1c5-71f4-42f5-baeb-60e0f05024eb" />) |
| Şifre Değiştir | ![Şifre Değiştir](<img width="2880" height="1570" alt="Şifre Değiştir" src="https://github.com/user-attachments/assets/01a04c15-5e58-4a9d-8c78-fb9852056a0e" />) |
| Şifremi Unuttum | ![Şifremi Unuttum](<img width="660" height="622" alt="Şifremi unuttum eposta girişi" src="https://github.com/user-attachments/assets/802a578e-161b-4789-a3d8-9745285079a3" />) |

---

## Teknoloji Yığını

### Frontend

| Teknoloji | Açıklama |
|-----------|----------|
| Angular 20 | Modern SPA framework |
| Nx Monorepo | Çoklu uygulama yönetimi |
| TypeScript 5.9 | Tip güvenli geliştirme |
| Chart.js | Dashboard grafikleri |
| OData | API tüketimi, filtreleme, sıralama |
| Flexi UI | Grid, Select, Toast, Popup bileşenleri |

### Backend

| Teknoloji | Açıklama |
|-----------|----------|
| .NET 9 Web API | RESTful API katmanı |
| Entity Framework Core | ORM ve veri erişimi |
| SQL Server | İlişkisel veritabanı |
| Minimal API + OData | Endpoint tanımları |
| JWT Authentication | Token tabanlı kimlik doğrulama |
| FluentValidation | İstek doğrulama |

### Ortak

- DDD (Domain-Driven Design) prensipleri
- Katmanlı mimari
- Repository + Unit of Work deseni

---

## E-posta / SMTP Yapısı

Proje, e-posta gönderimi için **FluentEmail.Smtp** kütüphanesini kullanır. SMTP altyapısı Infrastructure katmanında yapılandırılır ve `IMailService` üzerinden Application katmanına sunulur.

### Konfigürasyon

`appsettings.json` veya `appsettings.Development.json` içindeki `MailSettings` bölümü:

```json
"MailSettings": {
  "Email": "info@rentcar.com",
  "Smtp": "localhost",
  "Port": 25,
  "SSL": false,
  "UserId": "",
  "Password": ""
}
```

| Alan | Açıklama |
|------|----------|
| Email | Gönderici e-posta adresi |
| Smtp | SMTP sunucu adresi (örn: smtp.gmail.com) |
| Port | SMTP portu (25, 587 vb.) |
| UserId | Kimlik doğrulama için kullanıcı adı (opsiyonel) |
| Password | Kimlik doğrulama için şifre (opsiyonel) |

`UserId` ve `Password` boş bırakılırsa anonim SMTP kullanılır (ör. localhost).

### Kullanım Alanları

- **Müşteri şifre sıfırlama** — "Şifremi unuttum" ile HTML e-posta ve sıfırlama bağlantısı
- **Admin şifre sıfırlama** — Yönetici paneli için aynı akış
- **İki faktörlü doğrulama (2FA)** — Giriş doğrulama kodları

### Mimari

```
Application (IMailService) → Infrastructure (MailService, FluentEmail.Smtp) → SMTP sunucusu
```

---

## Mimari

Proje DDD yaklaşımına uygun olarak katmanlandırılmıştır:

```
RentCarServer/
├── Domain          → Entity, Value Object, çekirdek iş kuralları
├── Application     → Command/Query, validasyon, iş akışları
├── Infrastructure  → EF Core, JWT, SMTP, repository implementasyonları
└── WepAPI          → Endpoint, middleware, HTTP katmanı
```

---

## Öne Çıkan Özellikler

- Gelişmiş araç ve rezervasyon yönetimi
- Rol ve izin tabanlı admin panel deneyimi
- Dashboard üzerinde gelir ve operasyon metrikleri
- Müşteri tarafında adım adım rezervasyon funnel yapısı
- Form tabanlı teslim/iade süreçlerinin dijital takibi
- OData ile performanslı listeleme, sıralama ve filtreleme

---

## Canlı İş Akışları

- Rezervasyon öncesi araç müsaitlik kontrolü
- Rezervasyon oluşturma ve benzersiz rezervasyon numarası üretimi
- Araç teslim/iade formu (KM, hasar, ekipman, görsel kayıt)
- Müşteri profil, şifre değiştirme ve şifremi unuttum süreçleri

---

## Kurulum

### 1) Backend

```bash
cd RentCarServer
cd src/RentCarServer.WepAPI
dotnet restore
dotnet run
```

Varsayılan backend adresleri:

- `https://localhost:7161`
- `http://localhost:5062`

### 2) Frontend

```bash
cd RentCarClient
npm install
npx nx serve admin    # Admin paneli
npx nx serve ui       # Müşteri uygulaması
```

---

## Proje Yapısı

```
RentCar/
├── RentCarClient/           # Nx monorepo
│   ├── apps/
│   │   ├── admin/           # Admin paneli
│   │   └── ui/              # Müşteri uygulaması
│   └── libraries/
│       └── shared/          # Paylaşılan kütüphaneler
└── RentCarServer/
    └── src/
        ├── RentCarServer.Domain/
        ├── RentCarServer.Application/
        ├── RentCarServer.Infrastructure/
        └── RentCarServer.WepAPI/
```

---

## Geliştirme Notları

- Admin ve UI ayrı uygulamalar olarak ölçeklenebilir şekilde tasarlanmıştır.
- API tarafında OData kullanımı listeleme/sıralama/filtreleme performansını destekler.
- Domain tarafında Value Object kullanımı iş kurallarını daha güvenli hale getirir.

