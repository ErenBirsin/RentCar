# RentCar

<p align="center">
  <strong>Modern arac kiralama sureclerini uctan uca yoneten full-stack proje</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=flat&logo=angular" alt="Angular 20" />
  <img src="https://img.shields.io/badge/.NET-9-512BD4?style=flat&logo=dotnet" alt=".NET 9" />
  <img src="https://img.shields.io/badge/SQL%20Server-EF%20Core-CC2927?style=flat&logo=microsoftsqlserver" alt="SQL Server" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript" alt="TypeScript" />
</p>

---

## Icindekiler

- [Projeyi Tanitalim](#projeyi-tanitalim)
- [Ekran Goruntuleri](#ekran-goruntuleri)
- [Teknoloji Yigini](#teknoloji-yigini)
- [E-posta / SMTP Yapisi](#e-posta--smtp-yapisi)
- [Mimari](#mimari)
- [One Cikan Ozellikler](#one-cikan-ozellikler)
- [Canli Is Akislari](#canli-is-akislari)
- [Kurulum](#kurulum)
- [Proje Yapisi](#proje-yapisi)
- [Gelistirme Notlari](#gelistirme-notlari)

---

## Projeyi Tanitalim

**RentCar**, arac kiralama sektorunde musteri deneyimini ve operasyonel yonetimi tek bir platformda birlestiren kapsamli bir full-stack uygulamadir. Proje, hem son kullanicilarin (musterilerin) arac kiralamasini hem de isletme personelinin tum surecleri yonetmesini saglayan iki ayri web uygulamasindan olusur.

### Musteri Uygulamasi (UI)

Musteriler, arac kiralama surecini bastan sona dijital ortamda tamamlayabilir:

- **Ana Sayfa** - Hizli baslangic ve rezervasyon akisina giris
- **Arac Secimi** - Tarih, kategori ve filtre kriterlerine gore musait arac listesi
- **Guvence Paketi Secimi** - Farkli kapsam secenekleriyle sigorta paketleri
- **Ucret ve Ekstra Hizmetler** - Ek donanim ve hizmet secenekleri
- **Surucu Detaylari** - Musteri bilgileri ve ehliyet girisi
- **Rezervasyon Onayi** - Ozet goruntuleme ve onay
- **Kiralama Gecmisi** - Gecmis rezervasyonlar ve detay goruntuleme
- **Profil Yonetimi** - Hesap bilgileri, sifre degistirme, sifremi unuttum

### Admin Paneli

Operasyon ekibi icin merkezi yonetim arayuzu:

- **Dashboard** - Gelir metrikleri, operasyon ozetleri ve grafikler
- **Subeler** - Sube ekleme, duzenleme ve detay yonetimi
- **Roller ve Yetkiler** - Rol tabanli erisim kontrolu ve izin yonetimi
- **Kategoriler** - Arac kategorileri (ekonomi, sedan, SUV vb.)
- **Guvence Paketleri** - Sigorta paket tanimlari
- **Kullanicilar** - Admin kullanici yonetimi
- **Ekstra Hizmetler** - Ek donanim ve hizmet tanimlari
- **Araclar** - Arac envanteri, ekleme, duzenleme, detay
- **Musteriler** - Musteri kayitlari ve gecmis
- **Rezervasyonlar** - Rezervasyon listesi, detay, olusturma
- **Teslim / Iade Formlari** - KM, hasar, ekipman ve gorsel kayitlari

### Guvenlik ve Iletisim

- JWT tabanli kimlik dogrulama
- Rol ve yetki bazli erisim kontrolu
- Rate limiting ile API korumasi
- SMTP ile sifre sifirlama ve e-posta dogrulama akislari

---

## Ekran Goruntuleri

### Admin Paneli

| Ekran | Gorsel |
|-------|--------|
| Admin Giris | ![Admin Giris](.github/screenshots/admin/admin-admin-giris.png) |
| Dashboard | ![Dashboard](.github/screenshots/admin/admin-dashboard.png) |
| Araclar | ![Araclar](.github/screenshots/admin/admin-araclar.png) |
| Arac Ekle (1) | ![Arac Ekle 1](.github/screenshots/admin/admin-arac-ekle-1.png) |
| Arac Ekle (2) | ![Arac Ekle 2](.github/screenshots/admin/admin-arac-ekle-2.png) |
| Arac Detay | ![Arac Detay](.github/screenshots/admin/admin-arac-detay.png) |
| Rezervasyonlar | ![Rezervasyonlar](.github/screenshots/admin/admin-rezervasyonlar.png) |
| Rezervasyon Detayi | ![Rezervasyon Detayi](.github/screenshots/admin/admin-rezervasyon-detay.png) |
| Rezervasyon Ekle (1) | ![Rezervasyon Ekle 1](.github/screenshots/admin/admin-rezervasyon-ekle-1.png) |
| Rezervasyon Ekle (2) | ![Rezervasyon Ekle 2](.github/screenshots/admin/admin-rezervasyon-ekle-2.png) |
| Arac Teslim Formu | ![Arac Teslim Formu](.github/screenshots/admin/admin-arac-teslim-formu.png) |
| Arac Iade Formu | ![Arac Iade Formu](.github/screenshots/admin/admin-arac-iade-formu.png) |
| Sifre Sifirlama | ![Sifre Sifirlama](.github/screenshots/admin/admin-sifre-sifirlama-2.png) |
| Sifre Sifirlama Baglantisi | ![Sifre Sifirlama Baglantisi](.github/screenshots/admin/admin-sifre-sifirlama-baglantisi.png) |

### Musteri Uygulamasi (UI)

| Ekran | Gorsel |
|-------|--------|
| Giris Yap | ![Giris Yap](.github/screenshots/ui/ui-giris-yap.png) |
| Kayit Ol | ![Kayit Ol](.github/screenshots/ui/ui-kayit-ol.png) |
| Arac Secimi | ![Arac Secimi](.github/screenshots/ui/ui-arac-secimi-1.png) |
| Guvence Paketi Secimi | ![Guvence Paketi Secimi](.github/screenshots/ui/ui-guvence-paketi-secimi-2.png) |
| Ucret ve Ekstra Secimi | ![Ucret ve Ekstra Secimi](.github/screenshots/ui/ui-ucret-and-ekstra-secimi-3.png) |
| Surucu Detay | ![Surucu Detay](.github/screenshots/ui/ui-surucu-detay-4.png) |
| Rezervasyon Onay | ![Rezervasyon Onay](.github/screenshots/ui/ui-rezervasyon-onay-5.png) |
| Kiralama Gecmisi | ![Kiralama Gecmisi](.github/screenshots/ui/ui-araba-kiralama-gecmisi.png) |
| Sifre Degistir | ![Sifre Degistir](.github/screenshots/ui/ui-sifre-degistir.png) |
| Sifremi Unuttum | ![Sifremi Unuttum](.github/screenshots/ui/ui-sifremi-unuttum-eposta-girisi.png) |

---

## Teknoloji Yigini

### Frontend

| Teknoloji | Aciklama |
|-----------|----------|
| Angular 20 | Modern SPA framework |
| Nx Monorepo | Coklu uygulama yonetimi |
| TypeScript 5.9 | Tip guvenli gelistirme |
| Chart.js | Dashboard grafikleri |
| OData | API tuketimi, filtreleme, siralama |
| Flexi UI | Grid, Select, Toast, Popup bilesenleri |

### Backend

| Teknoloji | Aciklama |
|-----------|----------|
| .NET 9 Web API | RESTful API katmani |
| Entity Framework Core | ORM ve veri erisimi |
| SQL Server | Iliskisel veritabani |
| Minimal API + OData | Endpoint tanimlari |
| JWT Authentication | Token tabanli kimlik dogrulama |
| FluentValidation | Istek dogrulama |

### Ortak

- DDD (Domain-Driven Design) prensipleri
- Katmanli mimari
- Repository + Unit of Work deseni

---

## E-posta / SMTP Yapisi

Proje, e-posta gonderimi icin **FluentEmail.Smtp** kutuphanesini kullanir. SMTP altyapisi Infrastructure katmaninda yapilandirilir ve `IMailService` uzerinden Application katmanina sunulur.

### Konfigurasyon

`appsettings.json` veya `appsettings.Development.json` icindeki `MailSettings` bolumu:

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

| Alan | Aciklama |
|------|----------|
| Email | Gonderici e-posta adresi |
| Smtp | SMTP sunucu adresi (orn: smtp.gmail.com) |
| Port | SMTP portu (25, 587 vb.) |
| UserId | Kimlik dogrulama icin kullanici adi (opsiyonel) |
| Password | Kimlik dogrulama icin sifre (opsiyonel) |

`UserId` ve `Password` bos birakilirsa anonim SMTP kullanilir (or. localhost).

### Kullanim Alanlari

- **Musteri sifre sifirlama** - "Sifremi unuttum" ile HTML e-posta ve sifirlama baglantisi
- **Admin sifre sifirlama** - Yonetici paneli icin ayni akis
- **Iki faktorlu dogrulama (2FA)** - Giris dogrulama kodlari

### Mimari

```text
Application (IMailService) -> Infrastructure (MailService, FluentEmail.Smtp) -> SMTP sunucusu
```

---

## Mimari

Proje DDD yaklasimina uygun olarak katmanlandirilmistir:

```text
RentCarServer/
|-- Domain          -> Entity, Value Object, cekirdek is kurallari
|-- Application     -> Command/Query, validasyon, is akislari
|-- Infrastructure  -> EF Core, JWT, SMTP, repository implementasyonlari
`-- WepAPI          -> Endpoint, middleware, HTTP katmani
```

---

## One Cikan Ozellikler

- Gelismis arac ve rezervasyon yonetimi
- Rol ve izin tabanli admin panel deneyimi
- Dashboard uzerinde gelir ve operasyon metrikleri
- Musteri tarafinda adim adim rezervasyon funnel yapisi
- Form tabanli teslim/iade sureclerinin dijital takibi
- OData ile performansli listeleme, siralama ve filtreleme

---

## Canli Is Akislari

- Rezervasyon oncesi arac musaitlik kontrolu
- Rezervasyon olusturma ve benzersiz rezervasyon numarasi uretimi
- Arac teslim/iade formu (KM, hasar, ekipman, gorsel kayit)
- Musteri profil, sifre degistirme ve sifremi unuttum surecleri

---

## Kurulum

### 1) Backend

```bash
cd RentCarServer
cd src/RentCarServer.WepAPI
dotnet restore
dotnet run
```

Varsayilan backend adresleri:

- `https://localhost:7161`
- `http://localhost:5062`

### 2) Frontend

```bash
cd RentCarClient
npm install
npx nx serve admin    # Admin paneli
npx nx serve ui       # Musteri uygulamasi
```

---

## Proje Yapisi

```text
RentCar/
|-- RentCarClient/           # Nx monorepo
|   |-- apps/
|   |   |-- admin/           # Admin paneli
|   |   `-- ui/              # Musteri uygulamasi
|   `-- libraries/
|       `-- shared/          # Paylasilan kutuphaneler
|-- RentCarServer/
|   `-- src/
|       |-- RentCarServer.Domain/
|       |-- RentCarServer.Application/
|       |-- RentCarServer.Infrastructure/
|       `-- RentCarServer.WepAPI/
`-- .github/
    `-- screenshots/
        |-- admin/
        `-- ui/
```

---

## Gelistirme Notlari

- Admin ve UI ayri uygulamalar olarak olceklenebilir sekilde tasarlanmistir.
- API tarafinda OData kullanimi listeleme/siralama/filtreleme performansini destekler.
- Domain tarafinda Value Object kullanimi is kurallarini daha guvenli hale getirir.
