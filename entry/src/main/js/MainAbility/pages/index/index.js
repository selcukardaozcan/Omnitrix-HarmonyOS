export default {
    data: {
        currentIndex: 0,

        // Durumlar
        isBaseMode: true,      // Başlangıç modu (Kilitli)
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,

        imageScale: 1.0,

        // Görseller
        bgImageSrc: "/common/images/omnitrix_base.png", // Başlangıç: Kum Saati

        currentImageSrc: "",
        nextImageSrc: "",

        currentOpacity: 0, // Başlangıçta uzaylı yok
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
        // İlk açılış ayarları
        this.resetToInitialState();
    },

    // Kodu temiz tutmak için sıfırlama işlemini ayrı fonksiyona aldım
    resetToInitialState() {
        this.currentIndex = 0; // İstersen Ateş Topu'na sıfırla
        this.currentImageSrc = this.alienList[0];

        this.currentOpacity = 0; // Görünmez yap
        this.bgImageSrc = "/common/images/omnitrix_base.png"; // Kilitli moda dön
        this.isBaseMode = true; // Kilidi kapat

        this.isTransformed = false;
        this.isRecharging = false;
        this.isAnimating = false;
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

        // --- İLK AÇILIŞ (Kilit Açma Animasyonu) ---
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

    // --- ANİMASYONLAR ---
    runBaseToAlienAnimation() {
        this.isAnimating = true;
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png"; // Kilit açıldı (Baklava)

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
        this.isBaseMode = false; // Artık açık moddayız
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

    // --- DÖNÜŞÜM VE ŞARJ (RESET) MANTIĞI ---

    transform() {
        if (this.isBaseMode || this.isRecharging || this.isAnimating) return;

        if (!this.isTransformed) {
            // TIKLA -> DÖNÜŞ (YEŞİL EKRAN)
            this.isTransformed = true;
            this.imageScale = 1.3;
        }
        else {
            // TEKRAR TIKLA -> DÖNÜŞÜMÜ BİTİR VE ŞARJ ET
            this.isTransformed = false;
            this.imageScale = 1.0;
            this.startRecharge();
        }
    },

    startRecharge() {
        this.isRecharging = true;

        // 1. Arka planı KIRMIZI yap
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        // 2. Uzaylıyı gizle (Zaten resetlenecek)
        this.currentOpacity = 0;

        // 3. 10 Saniye Bekle ve RESET AT
        setTimeout(() => {
            // EN ÖNEMLİ KISIM BURASI:
            // Her şeyi en başa döndürüyoruz.
            this.resetToInitialState();

            console.info("Omnitrix Sıfırlandı ve Kilitlendi!");
        }, 10000);
    }
}