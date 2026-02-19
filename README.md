# RentCar

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
| Admin Giriş | ![Admin Giriş](../RentCarEkran Görüntüleri/Admin/Admin%20Giri%C5%9F%20.png) |
| Dashboard | ![Dashboard](../RentCarEkran Görüntüleri/Admin/Dashboard.png) |
| Araçlar | ![Araçlar](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7lar.png) |
| Araç Ekle (1) | ![Araç Ekle 1](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7%20Ekle%201.png) |
| Araç Ekle (2) | ![Araç Ekle 2](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7%20Ekle%202%20.png) |
| Araç Detay | ![Araç Detay](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7%20Detay.png) |
| Rezervasyonlar | ![Rezervasyonlar](../RentCarEkran Görüntüleri/Admin/Rezervasyonlar%20.png) |
| Rezervasyon Detayı | ![Rezervasyon Detayı](../RentCarEkran Görüntüleri/Admin/Rezervasyon%20Detay%C4%B1.png) |
| Rezervasyon Ekle (1) | ![Rezervasyon Ekle 1](../RentCarEkran Görüntüleri/Admin/Rezervasyon%20Ekle%201%20.png) |
| Rezervasyon Ekle (2) | ![Rezervasyon Ekle 2](../RentCarEkran Görüntüleri/Admin/Rezervasyon%20Ekle%202%20.png) |
| Araç Teslim Formu | ![Araç Teslim Formu](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7%20Teslim%20Formu%20.png) |
| Araç İade Formu | ![Araç İade Formu](../RentCarEkran Görüntüleri/Admin/Ara%C3%A7%20%C4%B0ade%20Formu.png) |
| Şifre Sıfırlama | ![Şifre Sıfırlama](../RentCarEkran Görüntüleri/Admin/%C5%9Eifre%20S%C4%B1f%C4%B1rlama%202%20.png) |
| Şifre Sıfırlama Bağlantısı | ![Şifre Sıfırlama Bağlantısı](../RentCarEkran Görüntüleri/Admin/%C5%9Eifre%20S%C4%B1f%C4%B1rlama%20Ba%C4%9Flant%C4%B1s%C4%B1.png) |

### Müşteri Uygulaması (UI)

| Ekran | Görsel |
|-------|--------|
| Giriş Yap | ![Giriş Yap](../RentCarEkran Görüntüleri/UI/Giri%C5%9F%20Yap.png) |
| Kayıt Ol | ![Kayıt Ol](../RentCarEkran Görüntüleri/UI/Kay%C4%B1t%20Ol%20.png) |
| Araç Seçimi | ![Araç Seçimi](../RentCarEkran Görüntüleri/UI/Ara%C3%A7%20Se%C3%A7imi%201%20.png) |
| Güvence Paketi Seçimi | ![Güvence Paketi Seçimi](../RentCarEkran Görüntüleri/UI/G%C3%BCvence%20Paketi%20Se%C3%A7imi%202%20.png) |
| Ücret ve Ekstra Seçimi | ![Ücret ve Ekstra Seçimi](../RentCarEkran Görüntüleri/UI/%C3%9Ccret%20%26%20Ekstra%20Se%C3%A7imi%203.png) |
| Sürücü Detay | ![Sürücü Detay](../RentCarEkran Görüntüleri/UI/S%C3%BCrc%C3%BC%20Detay%204%20.png) |
| Rezervasyon Onay | ![Rezervasyon Onay](../RentCarEkran Görüntüleri/UI/Rezervasyon%20Onay%205%20.png) |
| Kiralama Geçmişi | ![Kiralama Geçmişi](../RentCarEkran Görüntüleri/UI/Araba%20Kiralama%20Ge%C3%A7mi%C5%9Fi.png) |
| Şifre Değiştir | ![Şifre Değiştir](../RentCarEkran Görüntüleri/UI/%C5%9Eifre%20De%C4%9Fi%C5%9Ftir.png) |
| Şifremi Unuttum | ![Şifremi Unuttum](../RentCarEkran Görüntüleri/UI/%C5%9Eifremi%20unuttum%20eposta%20giri%C5%9Fi.png) |

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

