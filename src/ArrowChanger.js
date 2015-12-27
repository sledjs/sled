export default class ArrowChanger{
    constructor($core) {
      document.onkeydown = _=> {
        switch (_.which) {
          case 37:
            $core.modules.slides.change(-1);
            break;
          case 39:
            $core.modules.slides.change(1);
            break;
        }
        if ((_.which == 37 || _.which == 39) && $core.modules.autoSlider) $core.modules.autoSlider.restart(5000);
      };
    }
}
