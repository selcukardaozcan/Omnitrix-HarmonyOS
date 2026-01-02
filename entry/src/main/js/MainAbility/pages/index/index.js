export default {
    data: {
        currentIndex: 0,

        // Modlar
        isBaseMode: true,
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,
        isFlashing: false,

        imageScale: 1.0,

        // Görseller
        bgImageSrc: "/common/images/omnitrix_base.png",

        currentImageSrc: "",
        nextImageSrc: "",

        currentOpacity: 0,
        nextOpacity: 0,

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

        animationStep: 0,
        animationInterval: null,
        introFrameCount: 1 // Kare sayacı
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
        this.introFrameCount = 1;
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating || this.isFlashing) return;

        // --- DÜZELTME BURADA YAPILDI ---
        if (this.isBaseMode) {
            // Eskiden runBaseToAlienAnimation çağırıyordun,
            // şimdi video karesi oynatan fonksiyonu çağırıyoruz:
            this.playIntroAnimation();
            return;
        }
        // -------------------------------

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

    // --- KARE KARE VİDEO OYNATICI ---
    playIntroAnimation() {
        this.isAnimating = true;
        this.introFrameCount = 1;

        // 33ms = Saniyede yaklaşık 30 kare
        this.animationInterval = setInterval(() => {

            // Dosya ismi formatlama (1 -> 001, 10 -> 010)
            let frameNumber = this.introFrameCount;
            let paddedNumber = (frameNumber < 10 ? '00' : (frameNumber < 100 ? '0' : '')) + frameNumber;

            // DİKKAT: Dosya yolun /common/images/intro/ezgif-frame-001.png olmalı
            this.bgImageSrc = "/common/images/intro/ezgif-frame-" + paddedNumber + ".png";

            this.introFrameCount++;

            // 24 Kare olduğu için 24'te bitiriyoruz
            if (this.introFrameCount > 24) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 33);
    },

    finalizeBaseTransition() {
        this.isBaseMode = false;

        // Animasyon bitince kalıcı arka planı koy
        this.bgImageSrc = "/common/images/omnitrixsecond_base.png";

        // Uzaylıyı göster
        this.currentImageSrc = this.nextImageSrc || this.alienList[this.currentIndex];
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

    // --- DÖNÜŞÜM VE ŞARJ ---
    transform() {
        if (this.isBaseMode || this.isRecharging || this.isAnimating || this.isFlashing) return;

        if (!this.isTransformed) {
            console.info("Dönüşüm Başladı: Yeşil Ekran");
            this.isFlashing = true;
            this.currentOpacity = 0;

            setTimeout(() => {
                this.isFlashing = false;
                this.bgImageSrc = "/common/images/omnitrix_whitebase.png";
                this.isTransformed = true;
                console.info("Mod: Beyaz Omnitrix");
            }, 2000);
        }
        else {
            this.startRecharge();
        }
    },

    startRecharge() {
        this.isRecharging = true;
        console.info("Şarj Modu Aktif");
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        setTimeout(() => {
            this.resetToInitialState();
            console.info("Sistem Resetlendi.");
        }, 5000); // 5 saniye yaptık
    }
}