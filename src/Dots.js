export default class Dots {
    constructor($core) {
      let domModules = $core.domModules;

      if (domModules.dots) {
        [this.$dots, this.slides] = [domModules.dots, $core.modules.slides];

        this.slides.broadcast.push(_=> this.lightDot(_));

        this.fillDots();
      }
    }

    makeDot() {
      let dot = document.createElement('div');
      dot.className = 'dot';
      this.$dot = dot;
    }

    lightDot(which) {
      let id = which || this.slides.slide;
      let $dots = this.$dots.children;

      if (this.$prevDot != undefined) $dots[this.$prevDot].style.background = '#eee';

      $dots[id].style.background = mainColor;
      this.$prevDot = id;
    }

    fillDots() {
      let dotsId = this.slides.$slides.children.length;
      let $dots = [];

      this.$dots.innerHTML = '';
      if (!this.$dot) this.makeDot();

      while (dotsId--) $dots.push(this.$dot.cloneNode());

      $dots.forEach(($dot, id) => {
        $dot.onclick = _=> this.slides.changeTo(id);
        this.$dots.appendChild($dot);
      });

      this.lightDot();
    }
}
