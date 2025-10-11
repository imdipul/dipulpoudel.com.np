// Enhanced Slider System for GitHub Pages
(function() {
  'use strict';
  
  // Slider Configuration
  const sliders = [
    {
      name: 'first',
      container: '#first-slider',
      slides: '#first-slider .slide',
      dots: '#first-slider .slider-dots',
      currentIndex: 0,
      interval: null,
      isTransitioning: false,
      timing: 3500
    },
    {
      name: 'second', 
      container: '#second-slider',
      slides: '#second-slider .slide',
      dots: '#second-slider .slider-dots',
      currentIndex: 0,
      interval: null,
      isTransitioning: false,
      timing: 4000
    },
    {
      name: 'third',
      container: '#third-slider',
      slides: '#third-slider .slide', 
      dots: '#third-slider .slider-dots',
      currentIndex: 0,
      interval: null,
      isTransitioning: false,
      timing: 4500
    }
  ];

  // Initialize All Sliders
  function initializeAllSliders() {
    sliders.forEach((slider, sliderIndex) => {
      try {
        const slides = document.querySelectorAll(slider.slides);
        const dotsContainer = document.querySelector(slider.dots);
        const container = document.querySelector(slider.container);
        
        if (slides.length > 0 && dotsContainer) {
          generateDots(dotsContainer, slides.length, sliderIndex);
          updateSliderDisplay(sliderIndex);
          startSliderShow(sliderIndex);
          
          if (container) {
            container.addEventListener('mouseenter', () => stopSliderShow(sliderIndex));
            container.addEventListener('mouseleave', () => startSliderShow(sliderIndex));
          }
        }
      } catch (error) {
        console.error(`Error initializing slider ${sliderIndex}:`, error);
      }
    });
  }

  // Generate dots dynamically
  function generateDots(dotsContainer, slideCount, sliderIndex) {
    if (dotsContainer && slideCount > 0) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.onclick = () => goToSlide(i, sliderIndex);
        dotsContainer.appendChild(dot);
      }
    }
  }

  // Change slide function
  function changeSliderSlide(direction, sliderIndex) {
    if (!sliders[sliderIndex] || sliders[sliderIndex].isTransitioning) return;
    
    try {
      const slider = sliders[sliderIndex];
      const slides = document.querySelectorAll(slider.slides);
      
      if (slides.length === 0) return;
      
      slider.isTransitioning = true;
      stopSliderShow(sliderIndex);
      
      const prevIndex = slider.currentIndex;
      slider.currentIndex += direction;
      
      if (slider.currentIndex >= slides.length) {
        slider.currentIndex = 0;
      } else if (slider.currentIndex < 0) {
        slider.currentIndex = slides.length - 1;
      }
      
      performSlideTransition(sliderIndex, prevIndex, slider.currentIndex);
      
      setTimeout(() => {
        slider.isTransitioning = false;
        startSliderShow(sliderIndex);
      }, 1200);
    } catch (error) {
      console.error(`Error changing slide for slider ${sliderIndex}:`, error);
    }
  }

  // Go to specific slide
  function goToSlide(slideIndex, sliderIndex = 0) {
    if (!sliders[sliderIndex] || sliders[sliderIndex].isTransitioning) return;
    
    try {
      const slider = sliders[sliderIndex];
      slider.isTransitioning = true;
      stopSliderShow(sliderIndex);
      
      const prevIndex = slider.currentIndex;
      slider.currentIndex = slideIndex;
      
      performSlideTransition(sliderIndex, prevIndex, slider.currentIndex);
      
      setTimeout(() => {
        slider.isTransitioning = false;
        startSliderShow(sliderIndex);
      }, 1200);
    } catch (error) {
      console.error(`Error going to slide ${slideIndex} for slider ${sliderIndex}:`, error);
    }
  }

  // Perform slide transition
  function performSlideTransition(sliderIndex, fromIndex, toIndex) {
    if (!sliders[sliderIndex]) return;
    
    try {
      const slider = sliders[sliderIndex];
      const slides = document.querySelectorAll(slider.slides);
      const dotsContainer = document.querySelector(slider.dots);
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
      
      if (slides.length === 0) return;
      
      slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        if (index === toIndex) {
          slide.classList.add('active');
        } else if (index === fromIndex) {
          slide.classList.add('prev');
        }
      });
      
      dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === toIndex) {
          dot.classList.add('active');
        }
      });
    } catch (error) {
      console.error(`Error performing transition for slider ${sliderIndex}:`, error);
    }
  }

  // Update display
  function updateSliderDisplay(sliderIndex) {
    if (!sliders[sliderIndex]) return;
    
    try {
      const slider = sliders[sliderIndex];
      const slides = document.querySelectorAll(slider.slides);
      const dotsContainer = document.querySelector(slider.dots);
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
      
      slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        if (index === slider.currentIndex) {
          slide.classList.add('active');
        }
      });
      
      dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === slider.currentIndex) {
          dot.classList.add('active');
        }
      });
    } catch (error) {
      console.error(`Error updating display for slider ${sliderIndex}:`, error);
    }
  }

  // Start slideshow
  function startSliderShow(sliderIndex) {
    if (!sliders[sliderIndex]) return;
    
    try {
      const slider = sliders[sliderIndex];
      clearInterval(slider.interval);
      slider.interval = setInterval(() => {
        if (!slider.isTransitioning) {
          autoChangeSlide(sliderIndex);
        }
      }, slider.timing);
    } catch (error) {
      console.error(`Error starting slideshow for slider ${sliderIndex}:`, error);
    }
  }

  // Auto change slide
  function autoChangeSlide(sliderIndex) {
    if (!sliders[sliderIndex]) return;
    
    try {
      const slider = sliders[sliderIndex];
      const slides = document.querySelectorAll(slider.slides);
      
      const prevIndex = slider.currentIndex;
      slider.currentIndex++;
      if (slider.currentIndex >= slides.length) {
        slider.currentIndex = 0;
      }
      
      performSlideTransition(sliderIndex, prevIndex, slider.currentIndex);
    } catch (error) {
      console.error(`Error auto-changing slide for slider ${sliderIndex}:`, error);
    }
  }

  // Stop slideshow
  function stopSliderShow(sliderIndex) {
    if (!sliders[sliderIndex]) return;
    
    try {
      const slider = sliders[sliderIndex];
      clearInterval(slider.interval);
    } catch (error) {
      console.error(`Error stopping slideshow for slider ${sliderIndex}:`, error);
    }
  }

  // Global functions for HTML onclick events
  window.changeSlide = function(direction) { 
    changeSliderSlide(direction, 0); 
  };
  
  window.currentSlide = function(n) { 
    goToSlide(n - 1, 0); 
  };
  
  window.changeSecondSlide = function(direction) { 
    changeSliderSlide(direction, 1); 
  };
  
  window.currentSecondSlide = function(n) { 
    goToSlide(n - 1, 1); 
  };
  
  window.changeThirdSlide = function(direction) { 
    changeSliderSlide(direction, 2); 
  };
  
  window.currentThirdSlide = function(n) { 
    goToSlide(n - 1, 2); 
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllSliders);
  } else {
    initializeAllSliders();
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    try {
      if (e.key === 'ArrowLeft') {
        changeSliderSlide(-1, 0);
      } else if (e.key === 'ArrowRight') {
        changeSliderSlide(1, 0);
      }
    } catch (error) {
      console.error('Error handling keyboard navigation:', error);
    }
  });

})();