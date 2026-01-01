export default {
    data: {
        // Durum Değişkenleri
        currentIndex: 0,
        isTransformed: false,
        isRecharging: false,
        isAnimating: false,

        // YENİ: Başlangıçta Omnitrix 'Baz' modunda (Uzaylı yok)
        isBaseMode: true,

        imageScale: 1.0,

        // Görseller
        currentImageSrc: "", // Başlangıçta boş
        nextImageSrc: "",

        // YENİ: Başlangıçta mevcut uzaylı görünmez (0)
        currentOpacity: 0,
        nextOpacity: 0,

        alienList: [
            "/common/images/heatblast.png",
            "/common/images/greymater.png",
            "/common/images/xlr8.png",
            "/common/images/diamondhead.png"
        ],

        // Animasyon zamanlayıcıları
        animationStep: 0,
        animationInterval: null
    },

    onInit() {
        // Uygulama açıldığında ilk uzaylıyı belleğe al ama GÖSTERME (Opacity 0)
        this.currentImageSrc = this.alienList[this.currentIndex];
        this.currentOpacity = 0; // Kilit nokta burası: Görünmez başlıyor
        this.isBaseMode = true;
    },

    handleSwipe(e) {
        if (this.isTransformed || this.isRecharging || this.isAnimating) return;

        // EĞER BAZ MODUNDAYSA (İLK AÇILIŞ)
        if (this.isBaseMode) {
            // Sağa da çeksen sola da çeksen ilk uzaylıyla açılsın
            this.runBaseToAlienAnimation();
            return;
        }

        // NORMAL MOD (UZAYLILAR ARASI GEÇİŞ)
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

    // YENİ: Hiçlikten Uzaylıya Geçiş Animasyonu
    runBaseToAlienAnimation() {
        this.isAnimating = true;
        this.nextImageSrc = this.alienList[this.currentIndex]; // İlk uzaylıyı hazırla

        this.currentOpacity = 0; // Mevcut (Boş) zaten görünmez
        this.nextOpacity = 0;
        this.animationStep = 0;

        this.animationInterval = setInterval(() => {
            this.animationStep++;

            // Sadece gelen uzaylıyı parlat (Fade In)
            this.nextOpacity = (this.animationStep / 10);

            if (this.animationStep >= 10) {
                clearInterval(this.animationInterval);
                this.finalizeBaseTransition();
            }
        }, 30);
    },

    finalizeBaseTransition() {
        // Artık Baz modundan çıktık, uzaylı modundayız
        this.isBaseMode = false;

        // Gelen uzaylıyı ana uzaylı yap
        this.currentImageSrc = this.nextImageSrc;
        this.currentOpacity = 1;
        this.nextOpacity = 0;

        this.isAnimating = false;
    },

    // Mevcut: Uzaylıdan Uzaylıya Geçiş (Cross-Fade)
    runAlienToAlienAnimation(nextIndex) {
        this.isAnimating = true;
        this.nextImageSrc = this.alienList[nextIndex];

        this.currentOpacity = 1;
        this.nextOpacity = 0;
        this.animationStep = 0;

        this.animationInterval = setInterval(() => {
            this.animationStep++;

            // Biri sönerken diğeri yanar
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
        // Baz modundaysan (uzaylı yoksa) dönüşemezsin!
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