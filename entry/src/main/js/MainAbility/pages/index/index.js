export default {
    data: {
        currentIndex: 0,

        // Modlar
        isBaseMode: true,
        isTransformed: false, // Beyaz modda true olur
        isRecharging: false,
        isAnimating: false,
        isFlashing: false,    // YENİ: Yeşil Flash efekti için

        imageScale: 1.0,

        // Görseller
        bgImageSrc: "/common/images/omnitrix_base.png",

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
        this.resetToInitialState();
    },

    resetToInitialState() {
        this.currentIndex = 0;
        this.currentImageSrc = this.alienList[0];
        this.currentOpacity = 0;
        this.bgImageSrc = "/common/images/omnitrix_base.png";

        this.isBaseMode = true;
        this.isTransformed = false;
        this.isRecharging = false;
        this.isAnimating = false;
        this.isFlashing = false;
        this.imageScale = 1.0;
    },

    handleSwipe(e) {
        // Dönüşüm, şarj veya flash anında kaydırma yapılamaz
        if (this.isTransformed || this.isRecharging || this.isAnimating || this.isFlashing) return;

        if (this.isBaseMode) {
            this.runBaseToAlienAnimation();
            return;
        }

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

    // --- ANİMASYON MANTIKLARI (Aynı kaldı) ---
    runBaseToAlienAnimation() {
        this.isAnimating = true;
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png";
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

    // --- YENİ DÖNÜŞÜM SENARYOSU ---
    transform() {
        if (this.isBaseMode || this.isRecharging || this.isAnimating || this.isFlashing) return;

        // DURUM 1: Henüz dönüşmedik -> Önce Yeşil Flash, Sonra Beyaz
        if (!this.isTransformed) {
            console.info("Dönüşüm Başladı: Yeşil Ekran");

            // 1. Ekranı komple yeşil yap (Flash)
            this.isFlashing = true;

            // 2. Uzaylıyı gizle (Arka planda kalsın)
            this.currentOpacity = 0;

            // 3. 2 Saniye bekle, sonra Beyaza dön
            setTimeout(() => {
                this.isFlashing = false; // Yeşil ekranı kaldır

                // Arka planı BEYAZ BAZ yap
                this.bgImageSrc = "/common/images/omnitrix_whitebase.png";

                // Artık dönüşmüş durumdayız (White Mode)
                this.isTransformed = true;
                console.info("Mod: Beyaz Omnitrix (Beklemede)");
            }, 2000);
        }
        // DURUM 2: Zaten Beyaz Moddayız -> Tıklayınca Şarj Et
        else {
            this.startRecharge();
        }
    },

    startRecharge() {
        this.isRecharging = true;
        console.info("Şarj Modu Aktif");

        // 1. Arka planı KIRMIZI yap
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        // 2. Kırmızı Opaklık Katmanı (HML'de isRecharging true olunca devreye girer)
        // CSS'de opacity 0.2 yaptık.

        // 3. 10 Saniye sonra Reset
        setTimeout(() => {
            this.resetToInitialState();
            console.info("Sistem Resetlendi.");
        }, 6000);
    }
}