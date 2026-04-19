(function ($) {
  "use strict";

  $(".hero-carousel")?.owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000, // 5 seconds
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: ["&#10094;", "&#10095;"], // left/right arrows
    animateOut: "fadeOut",
    smartSpeed: 800,

    // 👇 Fix for mobile scroll issue
    touchDrag: false,
    mouseDrag: false,

    responsive: {
      0: {
        touchDrag: false,
        mouseDrag: false,
      },
      768: {
        touchDrag: true,
        mouseDrag: true,
      },
    },
  });

  // bootstrap dropdown hover

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($("#loader").length > 0) {
        $("#loader").removeClass("show");
      }
    }, 1);
  };
  loader();

  // Stellar - REMOVED: causes layout thrashing on scroll
  // $(window).stellar();

  // $("nav .dropdown").hover(
  //   function () {
  //     var $this = $(this);
  //     $this.addClass("show");
  //     $this.find("> a").attr("aria-expanded", true);
  //     $this.find(".dropdown-menu").addClass("show");
  //   },
  //   function () {
  //     var $this = $(this);
  //     $this.removeClass("show");
  //     $this.find("> a").attr("aria-expanded", false);
  //     $this.find(".dropdown-menu").removeClass("show");
  //   }
  // );

  // $("#dropdown04").on("show.bs.dropdown", function () {
  //   console.log("show");
  // });

  // $("#dropdown04").on("click", function (e) {
  //   e.preventDefault();
  //   console.log("click");
  //   $("#sub-dropdown").toggleClass("show");
  // });

  // home slider
  $(".home-slider").owlCarousel({
    loop: true,
    autoplay: true,
    margin: 10,
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    nav: true,
    autoplayHoverPause: true,
    items: 1,
    navText: [
      "<span class='ion-chevron-left'></span>",
      "<span class='ion-chevron-right'></span>",
    ],
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 1,
        nav: true,
      },
    },
  });

  // owl carousel
  var majorCarousel = $(".js-carousel-1");
  majorCarousel.owlCarousel({
    loop: true,
    autoplay: false,
    stagePadding: 0,
    margin: 10,
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    nav: false,
    dots: false,
    autoplayHoverPause: false,
    items: 3,
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        nav: true,
        loop: false,
      },
    },
  });

  // cusotm owl navigation events
  $(".custom-next").click(function (event) {
    event.preventDefault();
    // majorCarousel.trigger('owl.next');
    majorCarousel.trigger("next.owl.carousel");
  });
  $(".custom-prev").click(function (event) {
    event.preventDefault();
    // majorCarousel.trigger('owl.prev');
    majorCarousel.trigger("prev.owl.carousel");
  });

  // owl carousel
  var major2Carousel = $(".js-carousel-2");
  major2Carousel.owlCarousel({
    loop: true,
    autoplay: true,
    stagePadding: 7,
    margin: 20,
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    nav: false,
    autoplayHoverPause: true,
    items: 4,
    navText: [
      "<span class='ion-chevron-left'></span>",
      "<span class='ion-chevron-right'></span>",
    ],
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });

  var contentWayPoint = function () {
    var i = 0;
    $(".element-animate").waypoint(
      function (direction) {
        if (
          direction === "down" &&
          !$(this.element).hasClass("element-animated")
        ) {
          i++;

          $(this.element).addClass("item-animate");
          setTimeout(function () {
            $("body .element-animate.item-animate").each(function (k) {
              var el = $(this);
              setTimeout(function () {
                var effect = el.data("animate-effect");
                if (effect === "fadeIn") {
                  el.addClass("fadeIn element-animated");
                } else if (effect === "fadeInLeft") {
                  el.addClass("fadeInLeft element-animated");
                } else if (effect === "fadeInRight") {
                  el.addClass("fadeInRight element-animated");
                } else {
                  el.addClass("fadeInUp element-animated");
                }
                el.removeClass("item-animate");
              }, k * 100);
            });
          }, 100);
        }
      },
      { offset: "95%" },
    );
  };
  contentWayPoint();
})(jQuery);

// WhatsApp button functionality
const whatsAppTexts = {
  default: {
    text: "Hi, I am interested in your PG accommodation. Could you please provide more details?",
    label: "Any query? Contact us on WhatsApp",
  },
  lvmr_shamshi: {
    text: "Hi, I am interested in LVMR Shamshi Premium PG. Could you please provide more details?",
    label: "Contact us on WhatsApp",
  },
  lvmr_mohal: {
    text: "Hi, I am interested in LVMR Mohal Premium PG. Could you please provide more details?",
    label: "Contact us on WhatsApp",
  },
  lvmr_kullu: {
    text: "Hi, I am interested in LVMR Kullu Premium PG. Could you please provide more details?",
    label: "Contact us on WhatsApp",
  },
};

const pageId = document.documentElement.id;
const { text, label } = whatsAppTexts[pageId] || whatsAppTexts.default;
const btns = document.querySelectorAll(".whatsapp-btn");
const phone = "918278778256";
btns.forEach((button) => {
  const message = encodeURIComponent(text);
  button.href = `https://wa.me/${phone}?text=${message}`;

  const labelElement = button.querySelector("span");
  if (labelElement) {
    labelElement.innerText = label;
  }
});
