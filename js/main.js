$(document).ready(function() {
  const $microfono = $('#microfonoFondo');
  let scale = 1;
  const maxScale = 4.5;

  $(window).on('scroll', function() {
    const scrollY = $(window).scrollTop();
    const maxScroll = $(document).height() - $(window).height();
    const progress = scrollY / maxScroll;
    scale = 1 + (maxScale - 1) * progress;
    $microfono.css('transform', 'translate(-50%, -50%) scale(' + scale + ')');
  });

  if ('IntersectionObserver' in window) {
    const elementos = document.querySelectorAll('.animado, .animado-izquierda, .animado-derecha');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
    elementos.forEach(el => observer.observe(el));
  } else {
    $('.animado, .animado-izquierda, .animado-derecha').addClass('visible');
  }

  function animarContadores() {
    $('.counter-number').each(function() {
      const $this = $(this);
      const target = parseInt($this.data('target'), 10);
      if ($this.data('animado')) return;
      const top = $this.offset().top;
      const winBottom = $(window).scrollTop() + $(window).height();
      if (top < winBottom) {
        $this.data('animado', true);
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(function() {
          current += increment;
          if (current >= target) {
            $this.text(target.toLocaleString('es-PE') + '+');
            clearInterval(timer);
          } else {
            $this.text(current.toLocaleString('es-PE'));
          }
        }, 25);
      }
    });
  }

  $(window).on('scroll load', animarContadores);
  $('[data-bs-toggle="tooltip"]').tooltip();
  $('[data-bs-toggle="popover"]').popover();

  if ($('#welcomeToast').length) {
    setTimeout(function() {
      const toast = new bootstrap.Toast(document.getElementById('welcomeToast'));
      toast.show();
    }, 1500);
  }

  $('a[href^="#"]').on('click', function(e) {
    const target = $(this).attr('href');
    if (target.length > 1 && $(target).length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 600);
    }
  });

  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) {
      $('#scrollTopBtn').fadeIn();
    } else {
      $('#scrollTopBtn').fadeOut();
    }
  });

  $('#scrollTopBtn').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  $('.filter-btn').on('click', function() {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('btn-accent').addClass('btn-outline-accent');
    $(this).addClass('btn-accent').removeClass('btn-outline-accent');

    if (filter === 'all') {
      $('.galeria-item').fadeIn(400);
    } else {
      $('.galeria-item').hide();
      $('.galeria-item[data-cat="' + filter + '"]').fadeIn(400);
    }
  });

  $('.galeria-item').on('click', function() {
    const src = $(this).find('img').attr('src');
    const caption = $(this).data('caption') || '';
    $('#lightboxImg').attr('src', src);
    $('#lightboxCaption').text(caption);
    const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    modal.show();
  });

  const $form = $('#contactForm');
  if ($form.length) {
    $form.on('submit', function(e) {
      e.preventDefault();
      if (this.checkValidity()) {
        const $bar = $('#sendProgress');
        $bar.parent().removeClass('d-none');
        $bar.css('width', '0%').text('0%');
        let p = 0;
        const interval = setInterval(function() {
          p += 10;
          $bar.css('width', p + '%').text(p + '%');
          if (p >= 100) {
            clearInterval(interval);
            $form[0].reset();
            $form.removeClass('was-validated');
            $bar.parent().addClass('d-none');
            const successToast = new bootstrap.Toast(document.getElementById('successToast'));
            successToast.show();
          }
        }, 150);
      } else {
        $form.addClass('was-validated');
      }
    });
  }

});
