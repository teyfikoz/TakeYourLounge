# 🖼️ Pexels Image Download Guide

Lounge görsellerini Pexels API ile indirme ve lokal olarak kaydetme rehberi.

---

## 📊 Özet

- **API Key**: `3cY7tU038L8z24RG3ANvZwQi5m77xlzYCq2f6SKBZg08lEWlgb3XEmqu`
- **Rate Limit**: 200 request/saat, 20,000 request/ay
- **Toplam Lounge**: 2,272
- **Tahmini Süre**: ~11 saat (tüm lounge'lar için)

---

## 🚀 Kullanım

### 1. Test Modunda Çalıştır (İlk 5 Lounge)

```bash
python3 download_pexels_images.py
# Seçenek 3'ü seç: Test (first 5 lounges)
```

### 2. Sample Modda Çalıştır (İlk 50 Lounge)

```bash
python3 download_pexels_images.py
# Seçenek 2'yi seç: Sample (first 50 lounges)
```

### 3. Tüm Lounge'lar İçin İndir

```bash
python3 download_pexels_images.py
# Seçenek 1'i seç: Download all
```

**⚠️ UYARI**: Tüm lounge'lar için ~11 saat sürer!

---

## 📁 Dosya Yapısı

İndirilen görseller şu yapıda kaydedilir:

```
web/public/images/lounges/
├── lounge_id_1/
│   ├── image_1.jpg
│   ├── image_2.jpg
│   └── image_3.jpg
├── lounge_id_2/
│   ├── image_1.jpg
│   ├── image_2.jpg
│   └── image_3.jpg
└── ...
```

---

## 📄 Attribution Sistemi

Pexels guidelines gereği her fotoğrafın kredisi verilmelidir.

### Attribution Dosyası

`web/src/data/photo_attributions.json`:

```json
{
  "lounge_id_1": [
    {
      "lounge_id": "lounge_id_1",
      "image_path": "/images/lounges/lounge_id_1/image_1.jpg",
      "photographer": "John Doe",
      "photographer_url": "https://www.pexels.com/@john",
      "photo_url": "https://www.pexels.com/photo/123456/",
      "source": "Pexels"
    }
  ]
}
```

### Web'de Gösterme

`PhotoAttribution` component'i kullan:

```tsx
import PhotoAttribution from '@/components/PhotoAttribution';

<Image src={lounge.images[0]} alt={lounge.name} />
<PhotoAttribution loungeId={lounge.id} imagePath={lounge.images[0]} />
```

---

## 🔧 Script Özellikleri

### Akıllı Arama

Script şu sırayla arama yapar:

1. `"{lounge_name} {airport_name}"` (örn: "Turkish Airlines Lounge Istanbul Airport")
2. `"airport lounge {city}"` (örn: "airport lounge Istanbul")
3. `"luxury airport lounge interior"` (generic fallback)

### Rate Limiting

- Otomatik olarak **18 saniye** bekleme (200 request/saat için)
- API response header'larını kontrol eder
- Kalan request sayısını gösterir

### Skip Existing

- Zaten indirilmiş lounge'ları atlar
- Hızlı re-run için ideal
- Manuel silip tekrar indirmek için dosyaları sil

---

## 📊 İstatistikler

### Test Modu (5 Lounge)

- **Süre**: ~2 dakika
- **API Requests**: ~5
- **İndirilen Görseller**: ~15 (3 per lounge)

### Sample Modu (50 Lounge)

- **Süre**: ~15 dakika
- **API Requests**: ~50
- **İndirilen Görseller**: ~150

### Full Modu (2,272 Lounge)

- **Süre**: ~11 saat
- **API Requests**: ~2,272
- **İndirilen Görseller**: ~6,816
- **Disk Kullanımı**: ~2-3 GB

---

## ⚠️ Önemli Notlar

### 1. Rate Limits

- **Saat başı**: 200 request
- **Ay başı**: 20,000 request
- Script otomatik olarak bekler, manuel müdahale gerekmez

### 2. Pexels Guidelines

✅ **İZİN VERİLEN**:
- Commercial kullanım
- Ücretsiz indirme
- Lokal kaydetme
- Web'de gösterme

❌ **YASAK**:
- Pexels'i kopyalamak
- Görselleri satmak
- Attribution (kredi) vermemek
- Core functionality'yi kopyalamak

### 3. Attribution (Kredi Verme)

Her görselde **MUTLAKA** şunlardan biri olmalı:

- `"Photo by {photographer} on Pexels"` (text link)
- Pexels logo ile link
- `PhotoAttribution` component'i (otomatik)

---

## 🔄 Workflow

### İlk Kurulum

```bash
# 1. Test et (5 lounge)
python3 download_pexels_images.py
# Seçenek 3

# 2. Görselleri kontrol et
ls -lh web/public/images/lounges/

# 3. Web data'yı güncelle
python3 generate_web_data.py

# 4. Dev server'ı yeniden başlat
cd web && npm run dev
```

### Günlük Kullanım

```bash
# Yeni lounge eklendiğinde:
python3 download_pexels_images.py  # Skip existing yapacak
python3 generate_web_data.py       # JSON'u güncelle
```

---

## 🎯 Best Practices

### 1. Aşamalı İndir

```bash
# İlk gün: 200 lounge
python3 download_pexels_images.py
# Seçenek 2, sonra limiti manuel düzenle

# İkinci gün: Kaldığı yerden devam
# Skip existing yapacağı için hızlı
```

### 2. Görselleri Kontrol Et

```bash
# İndirilen görselleri say
find web/public/images/lounges -name "*.jpg" | wc -l

# Boş klasörleri bul
find web/public/images/lounges -type d -empty
```

### 3. Attribution Kontrolü

```bash
# Attribution dosyasını kontrol et
cat web/src/data/photo_attributions.json | jq '.| length'
```

---

## 🐛 Troubleshooting

### API Key Hatası

```
❌ API Error: 401 Unauthorized
```

**Çözüm**: API key'i kontrol et, `download_pexels_images.py` içinde doğru olduğundan emin ol.

### Rate Limit Aşımı

```
❌ API Error: 429 Too Many Requests
```

**Çözüm**:
- Script otomatik bekler
- Manuel çalıştırıyorsan 1 saat bekle
- Veya API key'i upgrade et (unlimited için)

### Görsel İndirilmiyor

```
⚠️ No images found
```

**Çözüm**:
- Lounge ismini kontrol et
- Farklı query dene
- Generic "airport lounge" ile fallback yapılacak

---

## 📈 Gelişmiş Kullanım

### Custom Query

Script'i düzenle (`download_pexels_images.py`):

```python
queries = [
    f"{lounge_name} lounge",  # Daha spesifik
    f"{airport_name} airport",
    f"business class lounge {city}",
]
```

### Daha Fazla Görsel

```python
photos = self.search_images(query, per_page=5)  # 3 yerine 5
```

### Farklı Boyutlar

```python
image_url = photo["src"]["original"]  # large yerine original
```

---

## 📦 Deployment

### VPS'e Görselleri Yükle

```bash
# Local'den VPS'e rsync
rsync -avz web/public/images/lounges/ \
  root@your-vps:/var/www/takeyourlounge/images/lounges/
```

### Next.js Static Export

```bash
cd web
npm run build
npm run export

# out/ klasörünü deploy et
```

---

## ✅ Checklist

- [ ] API key'i test et
- [ ] İlk 5 lounge ile test yap
- [ ] Attribution component'ini ekle
- [ ] 50 lounge ile sample test yap
- [ ] Tüm lounge'ları indir (background'da)
- [ ] Web data'yı güncelle
- [ ] Dev server'da kontrol et
- [ ] VPS'e deploy et

---

## 🔗 Kaynaklar

- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Pexels Guidelines](https://www.pexels.com/license/)
- [Rate Limits](https://www.pexels.com/api/documentation/#authorization)

---

*Last Updated: November 23, 2025*
