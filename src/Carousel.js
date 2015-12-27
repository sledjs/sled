export default class Carousel{
    constructor($core){
        this.$slides = $core.domModules.slides;
        this.slides = $core.modules.slides;

        if(this.$slides.children.length > 1) {
            [].forEach.call(this.slides.$slides.children, slide => slide.style.position = 'absolute');
            this.slides.change(1);

            if (this.$slides.children.length == 2) {
                let slide1 = this.$slides.children[0].cloneNode(true),
                    slide2 = this.$slides.children[1].cloneNode(true);

                setTransform(slide1.style, 'translateX(100%)');
                slide1.style.position = 'absolute';
                setTransform(slide2.style, 'translateX(100%)');
                slide2.style.position = 'absolute';
                this.$slides.appendChild(slide1);
                this.$slides.appendChild(slide2);
            }

            let autoSlider = $core.modules.autoSlider;
            if (autoSlider) this.autoSlider = autoSlider;

            this.slides.afterChange = function (can, val) {

                let slides = this.$slides.children;

                if (val > 0 && this.slides.slide > 1) {
                    setTransform(slides[0].style, 'translate(100%)');
                    setTransform(slides[0].style, 'translate(100%)');
                    this.$slides.insertBefore(slides[0], slides[slides.length]);
                    this.slides.slide--;
                } else if (val < 0) {
                    setTransform(slides[slides.length - 1].style, 'translate(-100%)');
                    this.$slides.insertBefore(slides[slides.length - 1], slides[0]);
                    this.slides.slide++;
                }

                //this.slides.change(1);
                //if(autoSlider.work) autoSlider.restart();
                return can;
            }.bind(this);
        }
    }
}
