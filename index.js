const element = document.getElementById('slider'); // element for init slider
const speed = 3000; // animation speed
const controls = true; // for show slider controls
const pager = true; // for show slider pager
const pause = false; // stop slides autoplay
const melt = true; // slow slider fade
const dotAppear = false; // slider appear from dot
const slideshow = false; // slider appear carousel

class Slider {
  constructor(params) {
    this.element = params.element;
    this.slide = [...element.getElementsByTagName('div')]; // img container
    this.controlBar = document.createElement('div'); // control bar for dots
    this.speed = params.speed;
    this.controls = params.controls;
    this.pager = params.pager;
    this.pause = params.pause;
    this.melt = params.melt;
    this.dotAppear = params.dotAppear;
    this.slideshow = params.slideshow;
    this.current = 0;
  }

  createPager() { // creating radiobutton method, bar of radiobuttons
    for (let i = 0; i < this.slide.length; i += 1) {
      const button = document.createElement('button');

      button.className = 'button';
      this.controlBar.append(button);
    }
    this.element.append(this.controlBar);
    this.controlBar.className = 'controlBar';
    this.radioBtn = [...this.controlBar.getElementsByTagName('button')];
    this.showSlide(this.current);
  }

  createArrows() { // create arrows
    this.btnPrev = document.createElement('img');
    this.btnNext = document.createElement('img');
    this.btnPrev.src = '../assets/icons/icons-arrow.png';
    this.btnNext.src = '../assets/icons/icons-arrow.png';
    this.btnPrev.className = 'prevBtn';
    this.btnNext.className = 'nextBtn';
    this.element.append(this.btnPrev);
    this.element.append(this.btnNext);
  }

  hideSlides() { // hide slides
    for (let i = 0; i < this.slide.length; i += 1) {
      this.slide[i].className = 'slide';
    }
  }

  showSlide() { // show current slide
    this.slide[this.current].className = 'active';
    this.element.style.width = `${this.slide[this.current].firstChild.width + 10}px`;
  }

  fillActiveButton() { // fill active dot with color
    for (const i in this.slide) {
      if (this.slide[i].classList.contains('active')) {
        this.radioBtn[i].style.backgroundColor = '#FFF';
      } else {
        this.radioBtn[i].style.backgroundColor = '#000';
      }
    }
  }

  changeSlide() {
    this.hideSlides();
    this.showSlide();
    this.fillActiveButton();
  }

  moveForward() {
    this.current += 1;
    if (this.current === this.slide.length) {
      this.current = 0;
      this.changeSlide();
      if (this.melt) this.doMeltForward();
      if (this.slideshow) this.doSlideshowForward();
      if (this.dotAppear) this.dotAppearSlide();
    } else {
      this.changeSlide();
      if (this.melt) this.doMeltForward();
      if (this.slideshow) this.doSlideshowForward();
      if (this.dotAppear) this.dotAppearSlide();
    }
  }

  moveBackward() {
    this.current -= 1;
    if (this.current < 0) {
      this.current = this.slide.length - 1;
      this.changeSlide();
      if (this.melt) this.doMeltBackward();
      if (this.slideshow) this.doSlideshowBackward();
      if (this.dotAppear) this.dotAppearSlide();
    } else {
      this.changeSlide();
      if (this.melt) this.doMeltBackward();
      if (this.slideshow) this.doSlideshowBackward();
      if (this.dotAppear) this.dotAppearSlide();
    }
  }

  addArrowsListener() {
    this.btnNext.addEventListener('click', () => {
      this.moveForward();
    });
    this.btnNext.addEventListener('mouseenter', () => {
      if (!this.pause) {
        clearInterval(this.autoplayID);
      }
    });
    this.btnNext.addEventListener('mouseleave', () => {
      if (!this.pause) {
        this.autoplay();
      }
    });
    this.btnPrev.addEventListener('click', () => {
      this.moveBackward();
    });
    this.btnPrev.addEventListener('mouseenter', () => {
      if (!this.pause) {
        clearInterval(this.autoplayID);
      }
    });
    this.btnPrev.addEventListener('mouseleave', () => {
      if (!this.pause) {
        this.autoplay();
      }
    });
  }

  addPagerListener() {
    for (let i = 0; i < this.radioBtn.length; i += 1) {
      this.radioBtn[i].addEventListener('click', () => {
        this.current = i;
        this.changeSlide();
      });
    }
    this.controlBar.addEventListener('mouseenter', () => {
      if (!this.pause) {
        clearInterval(this.autoplayID);
      }
    });
    this.controlBar.addEventListener('mouseleave', () => {
      if (!this.pause) {
        this.autoplay();
      }
    });
  }

  addTouchListener() {
    let startPoint;
    let finalPoint;

    this.element.addEventListener('touchstart', (event) => {
      startPoint = event.changedTouches[0];
    }, false);
    this.element.addEventListener('touchend', (event) => {
      finalPoint = event.changedTouches[0];

      const xAbs = Math.abs(startPoint.pageX - finalPoint.pageX);
      const yAbs = Math.abs(startPoint.pageY - finalPoint.pageY);

      if (xAbs > 20 || yAbs > 20) {
        if (xAbs > yAbs) {
          clearInterval(this.autoplayID);
          if (finalPoint.pageX < startPoint.pageX) {
            this.moveForward();
          } else {
            this.moveBackward();
          }
          if (!this.pause) this.slideLoop();
        }
      }
    }, false);
  }

  // Animations

  autoplay() {
    this.autoplayID = setInterval(() => this.moveForward(), this.speed);
  }

  doMeltForward() {
    this.slide[this.current].classList.add('melt-current');
    this.slide[(this.current - 1 < 0 ? this.slide.length - 1 : this.current - 1)].classList.add('melt-previous');
  }

  doMeltBackward() {
    this.slide[this.current].classList.add('melt-current');
    this.slide[(this.current + 1 < this.slide.length ? this.current + 1 : 0)].classList.add('melt-previous');
  }

  doSlideshowForward() {
    this.slide[this.current].classList.add('slideshow-current', 'slide-in-from-right');
    this.slide[(this.current - 1 < 0 ? this.slide.length - 1 : this.current - 1)].classList.add('slideshow-previous', 'slide-out-to-left');
  }

  doSlideshowBackward() {
    this.slide[this.current].classList.add('slideshow-current', 'slide-in-from-left');
    this.slide[(this.current + 1 < this.slide.length ? this.current + 1 : 0)].classList.add('slideshow-previous', 'slide-out-to-right');
  }

  dotAppearSlide() {
    this.slide[this.current].classList.add('dot-current');
  }

  init() { // initialize
    this.hideSlides();
    this.showSlide(this.current);
    this.addTouchListener();
    if (this.controls) {
      this.createArrows();
      this.addArrowsListener();
    }
    if (this.pager) {
      this.createPager();
      this.fillActiveButton();
      this.addPagerListener();
    }
    if (!this.pause) {
      this.autoplay();
    }
  }
}

const slider = new Slider({
  element,
  speed,
  controls,
  pager,
  pause,
  melt,
  dotAppear,
  slideshow,
});

slider.init();
