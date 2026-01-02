export default {
    data: {
        currentIndex: 0,
        // Durumlar
        isBaseMode: true,
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,
        isFlashing: false,

        imageScale: 1.0,

        bgImageSrc: "/common/images/omnitrix_base.png",

        currentImageSrc: "",
        nextImageSrc: "",

        currentOpacity: 0,
        nextOpacity: 0,

        // YENİ: Flash efekti için opaklık değişkeni
        flashOpacity: 0,

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

        // Animasyon sayaçları
        animationInterval: null,
        introFrameCount: 1
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
        this.flashOpacity = 0; // Opaklığı sıfırla
        this.imageScale = 1.0;
        this.introFrameCount = 1;
    },

    // --- KARE KARE VİDEO OYNATICI ---
    playIntroAnimation() {
        this.isAnimating = true;
        this.introFrameCount = 1;

        this.animationInterval = setInterval(() => {
            let frameNumber = this.introFrameCount;
            let paddedNumber = (frameNumber < 10 ? '00' : (frameNumber < 100 ? '0' : '')) + frameNumber;
            this.bgImageSrc = "/common/images/intro/ezgif-frame-" + paddedNumber + ".png";
            this.introFrameCount++;

            if (this.introFrameCount > 24) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 33);
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating || this.isFlashing) return;

        if (this.isBaseMode) {
            this.playIntroAnimation();
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

    finalizeBaseTransition() {
        this.isBaseMode = false;
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png";
        this.currentImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 1;
        this.isAnimating = false;
    },

    runAlienToAlienAnimation(nextIndex) {
        this.isAnimating = true;
        this.nextImageSrc = this.alienList[nextIndex];
        this.currentOpacity = 1;
        this.nextOpacity = 0;
        let step = 0;

        this.animationInterval = setInterval(() => {
            step++;
            this.nextOpacity = (step / 10);
            this.currentOpacity = 1 - (step / 10);
            if (step >= 10) {
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

    // --- TRANSFORMATION LOGIC ---
    transform() {
        if (this.isBaseMode || this.isRecharging || this.isAnimating || this.isFlashing) return;

        // DURUM 1: Dönüşüm Başlıyor (Yeşil Efekt)
        if (!this.isTransformed) {
            console.info("Dönüşüm Başlatılıyor...");
            this.runFlashSequence();
        }
        // DURUM 2: Zaten Dönüşmüş (Şarj Moduna Geç)
        else {
            this.startRecharge();
        }
    },

    // --- YENİ SİNEMATİK FLASH ANİMASYONU ---
    runFlashSequence() {
        this.isFlashing = true;      // Yeşil katmanı aktif et
        this.flashOpacity = 0;       // Başlangıçta görünmez
        this.currentOpacity = 0;     // Uzaylıyı gizle

        let fadeStep = 0;

        // ADIM 1: FADE IN (Hızlıca Parlasın - 300ms)
        let fadeInInterval = setInterval(() => {
            fadeStep += 0.1;
            this.flashOpacity = fadeStep;

            if (this.flashOpacity >= 1) {
                clearInterval(fadeInInterval);
                this.flashOpacity = 1; // Tam yeşil

                // ADIM 2: HOLD (3 Saniye Bekle)
                setTimeout(() => {
                    this.startFadeOut();
                }, 3000);
            }
        }, 30);
    },

    startFadeOut() {
        // Tam bu anda (ekran yeşilken) arkadaki resmi değiştiriyoruz.
        // Böylece yeşil kalktığında alttan Beyaz Omnitrix çıkacak.
        this.bgImageSrc = "/common/images/omnitrix_whitebase.png";

        let fadeStep = 1.0;

        // ADIM 3: FADE OUT (Yavaşça Solsun - 1 Saniye)
        // 1 saniye = 1000ms. 30ms aralıklarla çalışırsa ~33 adım eder.
        // 1.0 / 33 ≈ 0.03 azaltmalıyız.

        let fadeOutInterval = setInterval(() => {
            fadeStep -= 0.03;
            this.flashOpacity = fadeStep;

            if (this.flashOpacity <= 0) {
                clearInterval(fadeOutInterval);
                this.flashOpacity = 0;
                this.isFlashing = false; // Yeşil katmanı kapat

                this.isTransformed = true; // Artık Beyaz Moddayız
                console.info("Mod: Beyaz Omnitrix");
            }
        }, 30);
    },

    startRecharge() {
        this.isRecharging = true;
        console.info("Şarj Modu Aktif");
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        setTimeout(() => {
            this.resetToInitialState();
            console.info("Sistem Resetlendi.");
        }, 5000);
    }
}