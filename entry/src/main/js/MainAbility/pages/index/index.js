export default {
    data: {
        currentIndex: 0,

        // DURUMLAR
        isBaseMode: true,
        isTransformed: false,
        isRecharging: false,
        isTransforming: false,

        bgImageSrc: "/common/images/omnitrix_base.png",
        overlayImageSrc: "/common/images/omnitrixsecondbase_empty.png",

        alienList: [
            "/common/images/heatblast.png",
            "/common/images/stinkfly.png",
            "/common/images/diamondhead.png",
            "/common/images/xlr8.png",
            "/common/images/ripjaws.png",
            "/common/images/fourarms.png",
            "/common/images/greymatter.png",
            "/common/images/upgrade.png",
            "/common/images/ghostfreak.png",
            "/common/images/wildmutt.png"
        ],
    },

    onInit() {
        this.resetToInitialState();
    },

    handleSwipe(e) {
        // Şarjdaysa kaydırmayı da engelle
        if (this.isBaseMode || this.isTransformed || this.isRecharging || this.isTransforming) return;

        if (e.direction === 'left') {
            this.nextAlien();
        } else if (e.direction === 'right') {
            this.prevAlien();
        }
    },

    nextAlien() {
        if (this.currentIndex < this.alienList.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
    },

    prevAlien() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.alienList.length - 1;
        }
    },

    transform() {
        // 1. Durum: Şarjdaysa (Kırmızı) -> DOKUNMAYI YOK SAY (Etkisiz Hale Getir)
        if (this.isRecharging) {
            return; // Hiçbir şey yapma, 5 saniyenin dolmasını bekle
        }

        // 2. Durum: Kapalıysa -> Uzaylı Seçimi
        if (this.isBaseMode) {
            this.isBaseMode = false;
            this.bgImageSrc = "/common/images/omnitrixsecond_base.png";
            return;
        }

        // 3. Durum: Dönüşüm Efekti (Yeşil Işık - 2 Saniye)
        if (!this.isTransformed && !this.isTransforming) {
            this.isTransforming = true;

            setTimeout(() => {
                this.isTransforming = false;
                this.isTransformed = true;
                this.bgImageSrc = "/common/images/omnitrix_whitebase.png";
            }, 2000);
        }

        // 4. Durum: Dönüşmüşse -> Şarja Geç
        else if (this.isTransformed) {
            this.startRecharge();
        }
    },

    startRecharge() {
        this.isRecharging = true;
        this.bgImageSrc = "/common/images/omnitrix_redbase.png";

        // 5 SANİYE ZORUNLU BEKLEME
        // Kullanıcı tıklasa bile çıkamaz (transform fonksiyonunda engelledik)
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
        this.isTransforming = false;
    }
}