export default {
    data: {
        currentIndex: 0,
        isTransformed: false,
        isRecharging: false, // YENİ DEĞİŞKEN
        imageScale: 1.0,
        alienList: [

            "/common/images/heatblast.png",

            "/common/images/greymater.png",

            "/common/images/xlr8.png",

            "/common/images/diamondhead.png"

        ]    // Senin listen aynı kalsın
    },

    handleSwipe(e) {
        // Eğer dönüşmüşse VEYA şarj oluyorsa işlem yapma (Blokla)
        if (this.isTransformed || this.isRecharging) {
            console.info("Omnitrix kilitli!");
            return;
        }

        // ... (Senin kaydırma kodların burada) ...
        if (e.direction === 'left' || e.direction === 2) {
            this.currentIndex = (this.currentIndex + 1) % this.alienList.length;
        } else if (e.direction === 'right' || e.direction === 1) {
            this.currentIndex = (this.currentIndex - 1 + this.alienList.length) % this.alienList.length;
        }
    },

    transform() {
        if (this.isTransformed || this.isRecharging) return;

        console.info("Dönüşüm Başladı!");
        this.isTransformed = true;
        this.imageScale = 1.3;

        // 3 Saniye Aktif Kal (Yeşil)
        setTimeout(() => {
            this.isTransformed = false;
            this.imageScale = 1.0;

            // AKTİFLİK BİTTİ, ŞİMDİ SOĞUMA BAŞLASIN (Kırmızı)
            this.startRecharge();
        }, 3000);
    },

    startRecharge() {
        this.isRecharging = true;
        console.info("Soğuma Modu Aktif (Kırmızı)");

        // 5 Saniye Sonra Normale Dön
        setTimeout(() => {
            this.isRecharging = false;
            console.info("Omnitrix Hazır!");
        }, 5000); // 5000ms = 5 saniye
    }
}