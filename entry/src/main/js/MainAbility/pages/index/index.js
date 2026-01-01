import prompt from '@system.prompt';

export default {
    data: {
        currentIndex: 0,
        isTransformed: false,
        imageScale: 1.0,
        // Resim isimlerinin klasördekilerle birebir aynı olduğundan emin ol (Case-sensitive)
        alienList: [
            "/common/images/heatblast.png",
            "/common/images/greymater.png",
            "/common/images/xlr8.png",
            "/common/images/diamondhead.png"
        ]
    },

    onShow() {
        // Döner düğme verisi alabilmek için sayfaya odaklanıyoruz
        this.$element('container').focus();
    },

    handleRotation(e) {
        if (this.isTransformed) return; // Dönüşmüş haldeyken kadran dönmesin

        if (e.rotate > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.alienList.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.alienList.length) % this.alienList.length;
        }
    },

    handleKey(e) {
        // 66: Genelde Enter/Crown Press tuşudur
        if (e.code === 66 && e.action === 0) {
            this.transform();
        }
    },

    transform() {
        if (this.isTransformed) return;

        this.isTransformed = true;
        this.imageScale = 1.3; // İkonu biraz büyüt

        // 3 saniye sonra geri dön (Omnitrix soğuma süresi gibi)
        setTimeout(() => {
            this.isTransformed = false;
            this.imageScale = 1.0;
        }, 3000);
    }
}