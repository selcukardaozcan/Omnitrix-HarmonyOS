export default {
    data: {
        currentIndex: 0,

        // DURUMLAR
        isBaseMode: true,      // İlk açılış (Kapalı Saat)
        isTransformed: false,  // Dönüşmüş hali (Beyaz Saat)
        isRecharging: false,   // Şarj modu (Kırmızı Saat)
        isFlashing: false,     // Yeşil Patlama Efekti
        isAnimating: false,    // O an animasyon var mı? (Tıklamayı engellemek için)

        // RESİM YOLLARI
        bgImageSrc: "/common/images/omnitrix_base.png",

        // SENİN GÖNDERDİĞİN RESİM İSMİ BURADA:
        overlayImageSrc: "/common/images/omnitrixsecondbase_empty.png",

        flashOpacity: 0,

        // Intro Animasyonu Sayaçları
        introFrameCount: 0,
        animationInterval: null,

        // UZAYLI LİSTESİ
        alienList: [
            "/common/images/heatblast.png",
            "/common/images/greymatter.png",
            "/common/images/wildmutt.png",
            "/common/images/ghostfreak.png",
            "/common/images/upgrade.png",
            "/common/images/fourarms.png",
            "/common/images/stinkfly.png",
            "/common/images/ripjaws.png",
            "/common/images/xlr8.png",
            "/common/images/diamondhead.png"
        ],
    },

    onInit() {
        this.resetToInitialState();
    },

    // Swiper değiştikçe index'i güncelle
    updateIndex(e) {
        this.currentIndex = e.index;
    },

    // --- ANA TIKLAMA FONKSİYONU ---
    transform() {
        // Animasyon oynarken tıklamayı engelle
        if (this.isRecharging || this.isFlashing || this.isAnimating) return;

        // 1. Kapalıysa -> Açılış Videosunu Oynat
        if (this.isBaseMode) {
            this.playIntroAnimation();
            return;
        }

        // 2. Açıksa -> Dönüşüm Başlasın (Yeşil Efekt)
        if (!this.isTransformed) {
            this.runFlashSequence();
        }
        // 3. Zaten dönüşmüşse -> Şarj Moduna Geç
        else {
            this.startRecharge();
        }
    },

    // --- AÇILIŞ VİDEOSU ---
    playIntroAnimation() {
        this.isAnimating = true;
        this.introFrameCount = 0;

        this.animationInterval = setInterval(() => {
            this.introFrameCount++;

            // Dosya adını formatla: 1 -> 001
            let paddedNumber = this.introFrameCount < 10 ? '00' + this.introFrameCount : '0' + this.introFrameCount;
            this.bgImageSrc = '/common/images/intro/ezgif-frame-' + paddedNumber + '.png';

            if (this.introFrameCount >= 24) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 33); // 30 FPS
    },

    finalizeBaseTransition() {
        this.isBaseMode = false;      // Kapalı mod bitti
        this.isAnimating = false;     // Kilit kalktı

        // Arka planı değiştir (Bu resim en altta kalacak)
        // Üstüne overlay (çerçeve) bineceği için uzaylılar arada kalacak
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png";
    },

    // --- DÖNÜŞÜM EFEKTİ ---
    runFlashSequence() {
        this.isFlashing = true;
        this.isAnimating = true;
        this.flashOpacity = 0;

        let step = 0;
        // Fade In
        let fadeInTimer = setInterval(() => {
            step += 0.1;
            this.flashOpacity = step;

            if (this.flashOpacity >= 1) {
                this.flashOpacity = 1;
                clearInterval(fadeInTimer);

                // Tam yeşil olduğunda arkadaki her şeyi değiştir
                this.bgImageSrc = "/common/images/omnitrix_whitebase.png";
                this.isTransformed = true; // Uzaylılar ve Çerçeve gizlenecek

                // 3 saniye bekle
                setTimeout(() => {
                    this.startFadeOut();
                }, 3000);
            }
        }, 30);
    },

    startFadeOut() {
        let step = 1;
        // Fade Out
        let fadeOutTimer = setInterval(() => {
            step -= 0.05;
            this.flashOpacity = step;

            if (this.flashOpacity <= 0) {
                this.flashOpacity = 0;
                clearInterval(fadeOutTimer);
                this.isFlashing = false;
                this.isAnimating = false;
            }
        }, 30);
    },

    // --- ŞARJ MODU ---
    startRecharge() {
        this.isRecharging = true;
        this.isAnimating = true;
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        setTimeout(() => {
            this.resetToInitialState();
        }, 5000);
    },

    resetToInitialState() {
        this.currentIndex = 0;
        this.bgImageSrc = "/common/images/omnitrix_base.png";
        this.isBaseMode = true;
        this.isTransformed = false;
        this.isRecharging = false;
        this.isFlashing = false;
        this.isAnimating = false;
        this.flashOpacity = 0;
        this.introFrameCount = 0;
    }
}