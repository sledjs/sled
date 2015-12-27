export default class dualView{
    constructor($core){
        this.dots = $core.modules.dots;
        this.slides = $core.modules.slides;
        this.$slides = this.slides.$slides;

        this.slide = document.createElement('div');
        this.slide.className = 'slide';
        this.slide.style.position = 'absolute';

        this.mq = window.matchMedia('(min-width: 800px)');

        this.mq.addListener( mq => mq.matches ? this.dualView() : this.oneView() );
        this.mq.matches ? this.dualView() : null;
    }
    oneView(){
        let $slides = this.$slides,
            arr = [];

        [].forEach.call( $slides.getElementsByClassName('slide'), slide => arr.push(slide));

        [].forEach.call($slides.children, $slide => {
            $slides.appendChild($slide.children[0]);
            $slides.appendChild($slide.children[0]);
        });
        arr.forEach( _=>_.remove() );
        [].forEach.call($slides.children, $slide => {
            $slide.className = 'slide';
            $slide.style.position = 'absolute';
        });

        this.slides.slide = 0;
        $slides.className = 'slides';
        $slides.children[0].style.position = 'relative';
        if(this.dots)
            this.dots.fillDots();
    }
    dualView(){
        let $slides = this.$slides,
            arr = [],
            prev;

        $slides.className += ' dualView';

        [].forEach.call($slides.children, $slide => arr.push($slide) );

        arr.forEach(($slide, i) => {
            $slide.className = '';
            $slide.style.position = 'relative';

            if(i % 2 == 0){
                let slid = this.slide.cloneNode(true);

                prev = slid;
                slid.appendChild($slide);
                $slides.appendChild(slid);
            }else{
                prev.appendChild($slide);
            }
        });

        this.slides.slide = 0;
        $slides.children[0].style.position = 'relative';
        if(this.dots)
            this.dots.fillDots();
    }
}
