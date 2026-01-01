export default {
    data: {
        currentIndex: 0,

        // Durumlar
        isBaseMode: true,      // İlk açılış (Yeşil Kum Saati)
        isTransformed: false,  // Dönüşmüş (Active)
        isRecharging: false,   // Şarj oluyor (Kırmızı)
        isAnimating: false,    // Geçiş animasyonu sırasında

        imageScale: 1.0,

        // Görseller
        bgImageSrc: "/common/images/omnitrix_base.png", // Başlangıç resmi

        currentImageSrc: "",
        nextImageSrc: "",

        currentOpacity: 0,
        nextOpacity: 0,

        alienList: [
            "/common/images/heatblast.png",
            "/common/images/greymater.png",
            "/common/images/xlr8.png",
            "/common/images/diamondhead.png"
        ],

        animationStep: 0,
        animationInterval: null
    },

    onInit() {
        // Başlangıç: Uzaylı var ama görünmez, mod Baz.
        this.currentImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 0;
        this.bgImageSrc = "/common/images/omnitrix_base.png";
        this.isBaseMode = true;
    },

    handleSwipe(e) {
        // Dönüşmüşken, şarj olurken veya animasyon varken uzaylı değiştiremezsin
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

        // --- İLK AÇILIŞ (Baz Modundan Çıkış) ---
        if (this.isBaseMode) {
            this.runBaseToAlienAnimation();
            return;
        }

        // --- NORMAL UZAYLI GEÇİŞİ ---
        let nextIndex = this.currentIndex;
        if (e.direction === 'left' || e.direction === 2) {
            nextIndex = (this.currentIndex + 1) % this.alienList.length;
        } else if (e.direction === 'right' || e.direction === 1) {
            nextIndex = (this.currentIndex - 1 + this.alienList.length) % this.alienList.length;
        } else {
            return;
        }

        this.runAlienToAlienAnimation(nextIndex);
    },

    // --- ANİMASYON FONKSİYONLARI (Aynı kaldı) ---
    runBaseToAlienAnimation() {
        this.isAnimating = true;
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png"; // Yeşil Baklava

        this.nextImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 0;
        this.nextOpacity = 0;
        this.animationStep = 0;

        this.animationInterval = setInterval(() => {
            this.animationStep++;
            this.nextOpacity = (this.animationStep / 10);
            if (this.animationStep >= 10) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 30);
    },

    finalizeBaseTransition() {
        this.isBaseMode = false;
        this.currentImageSrc = this.nextImageSrc;
        this.currentOpacity = 1;
        this.nextOpacity = 0;
        this.isAnimating = false;
    },

    runAlienToAlienAnimation(nextIndex) {
        this.isAnimating = true;
        this.nextImageSrc = this.alienList[nextIndex];
        this.currentOpacity = 1;
        this.nextOpacity = 0;
        this.animationStep = 0;

        this.animationInterval = setInterval(() => {
            this.animationStep++;
            this.nextOpacity = (this.animationStep / 10);
            this.currentOpacity = 1 - (this.animationStep / 10);
            if (this.animationStep >= 10) {
                clearInterval(this.animationInterval);
                this.finalizeAlienTransition(nextIndex);
            }
        }, 30);
    },

    finalizeAlienTransition(nextIndex) {
        this.currentIndex = nextIndex;
        this.currentImageSrc = this.alienList[nextIndex];
        this.currentOpacity = 1;
        this.nextOpacity = 0;
        this.isAnimating = false;
    },

    // --- YENİ DÖNÜŞÜM VE ŞARJ MANTIĞI ---

    // Tıklama Olayı (Toggle Mantığı)
    transform() {
        // Baz modundaysan, şarjdaysan veya animasyon varsa tıklama çalışmaz
        if (this.isBaseMode || this.isRecharging || this.isAnimating) return;

        if (!this.isTransformed) {
            // DURUM 1: Henüz dönüşmedik -> DÖNÜŞ (ACTIVE OL)
            // Zamanlayıcı yok! İkinci tıklamaya kadar böyle kalır.
            this.isTransformed = true;
            this.imageScale = 1.3;
            console.info("Dönüşüm Aktif (Beklemede...)");
        }
        else {
            // DURUM 2: Zaten dönüşmüşüz -> DÖNÜŞÜMÜ BİTİR VE ŞARJA GEÇ
            this.isTransformed = false;
            this.imageScale = 1.0;
            this.startRecharge();
        }
    },

    startRecharge() {
        this.isRecharging = true;
        console.info("Şarj Modu Başladı (Kırmızı)");

        // 1. Arka planı KIRMIZI yap
        // Dosya adının tam doğru olduğundan emin ol
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        // 2. Şarj sırasında uzaylıyı gizleyelim (İsteğe bağlı, daha temiz durur)
        this.currentOpacity = 0;

        // 3. 10 Saniye Bekle
        setTimeout(() => {
            // Şarj Bitti
            this.isRecharging = false;

            // Arka planı tekrar YEŞİL BAKLAVA yap
            this.bgImageSrc = "/common/images/omnitrixsecond_base.png";

            // Uzaylıyı geri getir
            this.currentOpacity = 1;

            console.info("Omnitrix Hazır!");
        }, 10000); // 10000ms = 10 saniye
    }
}