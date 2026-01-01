export default {
    data: {
        currentIndex: 0,
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,
        imageScale: 1.0,

        // Görseller
        currentImageSrc: "",
        nextImageSrc: "",

        // Opaklık değerleri (0 ile 1 arası)
        currentOpacity: 1,
        nextOpacity: 0,

        alienList: [
            "/common/images/heatblast.png",
            "/common/images/greymater.png",
            "/common/images/xlr8.png",
            "/common/images/diamondhead.png"
        ],

        // Animasyon sayacı
        animationStep: 0,
        animationInterval: null
    },

    onInit() {
        this.currentImageSrc = this.alienList[this.currentIndex];
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

        let nextIndex = this.currentIndex;
        // Yön algılama
        if (e.direction === 'left' || e.direction === 2) {
            nextIndex = (this.currentIndex + 1) % this.alienList.length;
        } else if (e.direction === 'right' || e.direction === 1) {
            nextIndex = (this.currentIndex - 1 + this.alienList.length) % this.alienList.length;
        } else {
            return;
        }

        this.runManualAnimation(nextIndex);
    },

    runManualAnimation(nextIndex) {
        this.isAnimating = true;
        this.nextImageSrc = this.alienList[nextIndex];

        // Başlangıç değerleri
        this.currentOpacity = 1;
        this.nextOpacity = 0;
        this.animationStep = 0;

        // Her 30ms'de bir çalışan zamanlayıcı kuruyoruz (FPS mantığı)
        // Toplam 10 adımda geçiş yapacak (30ms * 10 = 300ms sürer)
        this.animationInterval = setInterval(() => {
            this.animationStep++;

            // Opaklığı 0.1 artır/azalt
            this.nextOpacity = (this.animationStep / 10);      // 0.1, 0.2, ... 1.0
            this.currentOpacity = 1 - (this.animationStep / 10); // 0.9, 0.8, ... 0.0

            // Animasyon bitti mi?
            if (this.animationStep >= 10) {
                clearInterval(this.animationInterval); // Zamanlayıcıyı durdur
                this.finalizeTransition(nextIndex);
            }
        }, 30);
    },

    finalizeTransition(nextIndex) {
        // Değerleri temizle ve sabitle
        this.currentIndex = nextIndex;
        this.currentImageSrc = this.alienList[nextIndex];

        this.currentOpacity = 1;
        this.nextOpacity = 0;

        this.isAnimating = false;
    },

    transform() {
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

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