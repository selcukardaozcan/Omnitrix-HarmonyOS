export default {
    data: {
        currentIndex: 0,
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,
        isBaseMode: true, // Başlangıçta Base Modu aktif
        imageScale: 1.0,

        // YENİ: Başlangıçta Kum Saati Arka Planı Var
        bgImageSrc: "/common/images/omnitrix_base.png",

        // Uzaylı Görselleri
        currentImageSrc: "",
        nextImageSrc: "",

        // Opaklıklar (Başlangıçta uzaylı görünmez = 0)
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
        // Başlangıç ayarları: İlk uzaylıyı sıraya al ama gösterme (Opacity 0)
        this.currentImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 0;

        // Başlangıç arka planı (Emin olmak için tekrar set ediyoruz)
        this.bgImageSrc = "/common/images/omnitrix_base.png";
        this.isBaseMode = true;
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

        // --- İLK AÇILIŞ SENARYOSU ---
        if (this.isBaseMode) {
            this.runBaseToAlienAnimation();
            return;
        }

        // --- NORMAL GEÇİŞ SENARYOSU ---
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

    // BAZ MODUNDAN UZAYLIYA GEÇİŞ (Sadece 1 kere çalışır)
    runBaseToAlienAnimation() {
        this.isAnimating = true;

        // 1. ÖNCE ARKA PLANI DEĞİŞTİR (Kum Saati -> Baklava)
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png";

        // 2. Uzaylıyı yavaşça belirginleştir (Fade In)
        this.nextImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 0;
        this.nextOpacity = 0;
        this.animationStep = 0;

        this.animationInterval = setInterval(() => {
            this.animationStep++;

            // Opaklığı artır (0.0 -> 1.0)
            this.nextOpacity = (this.animationStep / 10);

            if (this.animationStep >= 10) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 30);
    },

    finalizeBaseTransition() {
        this.isBaseMode = false; // Artık normal moda geçtik

        // Gelen uzaylıyı ana görsel yap
        this.currentImageSrc = this.nextImageSrc;
        this.currentOpacity = 1;
        this.nextOpacity = 0;

        this.isAnimating = false;
    },

    // UZAYLIDAN UZAYLIYA GEÇİŞ (Cross-Fade)
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

    transform() {
        // Base modunda dönüşüm yok!
        if (this.isBaseMode || this.isTransformed || this.isRecharging || this.isAnimating) return;

        this.isTransformed = true;
        this.imageScale = 1.3;

        setTimeout(() => {
            this.isTransformed = false;
            this.imageScale = 1.0;
            this.startRecharge();
        }, 3000);
    },

    startRecharge() {
        this.isRecharging = true;
        setTimeout(() => {
            this.isRecharging = false;
        }, 5000);
    }
}