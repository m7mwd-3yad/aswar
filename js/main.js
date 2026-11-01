/* ===================================================================
   شركة اسوار الكنانة للمقاولات العامة
   JavaScript — تفاعلات الـ GRP والـ GRC، مشغل الفيديو التفاعلي،
   حاسبة السعر الفوري، فلترة المعرض، القائمة الجانبية للهاتف والنوافذ المنبثقة
   =================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     1. MOBILE DRAWER MENU
  ════════════════════════════════════════════ */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

  function openDrawer() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !mobileOverlay) return;
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileOverlay?.addEventListener('click', closeDrawer);

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ═══════════════════════════════════════════
     2. GALLERY CATEGORY FILTER
  ════════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      galleryItems.forEach(item => {
        const itemCat = item.dataset.category || '';
        if (filterVal === 'all' || itemCat.includes(filterVal)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ═══════════════════════════════════════════
     3. IMAGE PREVIEW MODAL (Gallery & Details)
  ════════════════════════════════════════════ */
  const previewModal = document.getElementById('preview-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-image');
  const modalHeading = document.getElementById('modal-heading');
  const modalDesc = document.getElementById('modal-desc');
  const modalWaBtn = document.getElementById('modal-wa-btn');
  const btnShowDocs = document.getElementById('btn-show-docs');

  function openPreview(imgSrc, title, desc, waMessage) {
    if (!previewModal) return;
    if (modalImg) modalImg.src = imgSrc;
    if (modalHeading) modalHeading.textContent = title;
    if (modalDesc) modalDesc.textContent = desc || 'صورة واقعية من أعمال شركة اسوار الكنانة للمقاولات العامة بالمملكة العربية السعودية.';
    if (modalWaBtn) {
      const msg = waMessage || `مرحباً شركة اسوار الكنانة، أرغب بالاستفسار عن تفاصيل وتكلفة هذا العمل: (${title})`;
      modalWaBtn.href = `https://wa.me/966501910554?text=${encodeURIComponent(msg)}`;
    }
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    if (!previewModal) return;
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Gallery items click to open preview
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img || item.querySelector('img')?.src;
      const title = item.dataset.title || 'مشروع منفذ';
      const cat = item.dataset.category || '';
      const desc = `تنفيذ وتوريد ${cat.includes('grp') ? 'خامة الـ GRP الفايبر جلاس المعماري' : 'واجهات الـ GRC الخرسانة المسلحة'} بأعلى مواصفات الجودة والضمان.`;
      openPreview(imgSrc, title, desc);
    });
  });

  // Expand buttons in showcase
  document.querySelectorAll('.btn-open-gallery').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.dataset.img;
      const title = btn.dataset.title;
      openPreview(imgSrc, title);
    });
  });

  // Official Docs button
  btnShowDocs?.addEventListener('click', () => {
    openPreview(
      'assets/docs/address_proof.png',
      'الوثائق الرسمية — إثبات العنوان الوطني والسجل التجاري',
      'إثبات العنوان الوطني المعتمد لشركة اسوار الكنانة للمقاولات العامة — رقم الإثبات: 1088401155 | السجل التجاري: 3133277033 (حائل)',
      'مرحباً شركة اسوار الكنانة، اطلعت على وثائقكم الرسمية وأود الاستفسار عن أعمالكم'
    );
  });

  modalClose?.addEventListener('click', closePreview);
  previewModal?.addEventListener('click', (e) => {
    if (e.target === previewModal) closePreview();
  });

  /* ═══════════════════════════════════════════
     4. INTERACTIVE 4-STEP PRICE ESTIMATOR (CALCULATOR)
  ════════════════════════════════════════════ */
  let selectedMaterial = 'جي ار بي (GRP) فايبر جلاس';
  let selectedProject = 'فيلا سكنية خاصة';
  let selectedElement = 'واجهات خارجية كاملة';
  const inputArea = document.getElementById('input-area');
  const inputCity = document.getElementById('input-city');
  const summaryText = document.getElementById('calc-summary-text');
  const btnSubmitQuote = document.getElementById('btn-submit-quote');

  function setupOptionGroup(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const chips = container.querySelectorAll('.calc-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        callback(chip.dataset.value);
        updateQuoteSummary();
      });
    });
  }

  setupOptionGroup('opt-material', (val) => { selectedMaterial = val; });
  setupOptionGroup('opt-project', (val) => { selectedProject = val; });
  setupOptionGroup('opt-elements', (val) => { selectedElement = val; });

  inputArea?.addEventListener('input', updateQuoteSummary);
  inputCity?.addEventListener('input', updateQuoteSummary);

  function updateQuoteSummary() {
    const areaVal = inputArea?.value ? `${inputArea.value} م²` : 'غير محددة';
    const cityVal = inputCity?.value?.trim() || 'حائل';

    if (summaryText) {
      summaryText.innerHTML = `طلب تسعير: <strong>${selectedMaterial}</strong> لمشروع: <strong>${selectedProject}</strong> — العناصر: <strong>${selectedElement}</strong> — المساحة: <strong>${areaVal}</strong> — المدينة: <strong>${cityVal}</strong>.`;
    }

    if (btnSubmitQuote) {
      const waMsg = `مرحباً شركة اسوار الكنانة للمقاولات العامة،
أرغب بطلب عرض سعر ومقايسة تفصيلية بالمواصفات التالية:
• الخامة المطلوبة: ${selectedMaterial}
• نوع المشروع: ${selectedProject}
• العناصر والأعمال: ${selectedElement}
• المساحة التقريبية: ${areaVal}
• المدينة: ${cityVal}
يرجى تزويدي بالأسعار التقريبية والتفاصيل. شكراً لكم.`;

      btnSubmitQuote.href = `https://wa.me/966501910554?text=${encodeURIComponent(waMsg)}`;
    }
  }

  // Initial call
  updateQuoteSummary();

  /* ═══════════════════════════════════════════
     5. INTERACTIVE VIDEO SHOWCASE PLAYER MODAL
  ════════════════════════════════════════════ */
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const btnPlayGrpVideo = document.getElementById('btn-play-grp-video');
  const btnPlayGrcVideo = document.getElementById('btn-play-grc-video');
  const videoTabBtns = document.querySelectorAll('.video-tab-btn');
  const videoCurrentFrame = document.getElementById('video-current-frame');
  const videoPlayCenter = document.getElementById('video-play-center');
  const ctrlPlayBtn = document.getElementById('ctrl-play-btn');
  const ctrlProgress = document.getElementById('ctrl-progress');
  const ctrlTime = document.getElementById('ctrl-time');
  const ctrlSoundBtn = document.getElementById('ctrl-sound-btn');
  const videoTitle = document.getElementById('video-modal-title');
  const videoDesc = document.getElementById('video-modal-desc');

  const videoData = {
    grp: {
      frame: 'assets/images/real_site_facade_1.jpg',
      title: 'فيديو توضيحي من موقع العمل: طريقة تثبيت وتركيب تكسيات GRP',
      desc: 'يوضح هذا المقطع الميداني خصائص ألواح الفايبر جلاس (GRP) وخفتها العالية وسهولة رفعها وتثبيتها الميكانيكي على الهياكل والواجهات بدون مجهود وبدون أي وزن إضافي على المبنى.'
    },
    grc: {
      frame: 'assets/images/real_site_columns.jpg',
      title: 'فيديو توضيحي: طريقة تثبيت وتركيب ألواح وزخارف وأعمدة الـ GRC',
      desc: 'شاهد في هذا المقطع طريقة تثبيت ألواح وكرانيش وأعمدة الـ GRC بنظام التثبيت الميكانيكي بالحديد المجلفن، وكيف تمنح الواجهة صلابة صخرية ونقوشاً إسلامية وكلاسيكية فائقة الفخامة والدقة.'
    }
  };

  let currentVideoType = 'grp';
  let isPlaying = false;
  let playInterval = null;
  let progressPercent = 0;

  function setVideoType(type) {
    currentVideoType = type;
    const data = videoData[type];
    if (!data) return;

    if (videoCurrentFrame) videoCurrentFrame.src = data.frame;
    if (videoTitle) videoTitle.textContent = data.title;
    if (videoDesc) videoDesc.textContent = data.desc;

    videoTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.videoType === type);
    });

    pauseVideo();
    progressPercent = 0;
    updateProgressUI();
  }

  function playVideo() {
    isPlaying = true;
    if (videoPlayCenter) videoPlayCenter.style.display = 'none';
    if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

    if (playInterval) clearInterval(playInterval);
    playInterval = setInterval(() => {
      progressPercent += 1.5;
      if (progressPercent >= 100) {
        progressPercent = 0;
        pauseVideo();
      }
      updateProgressUI();
    }, 200);
  }

  function pauseVideo() {
    isPlaying = false;
    if (playInterval) clearInterval(playInterval);
    if (videoPlayCenter) videoPlayCenter.style.display = 'flex';
    if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  function togglePlay() {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  function updateProgressUI() {
    if (ctrlProgress) ctrlProgress.style.width = `${progressPercent}%`;
    const totalSec = 90;
    const curSec = Math.floor((progressPercent / 100) * totalSec);
    const curMin = Math.floor(curSec / 60);
    const remSec = curSec % 60;
    const curStr = `${String(curMin).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
    if (ctrlTime) ctrlTime.textContent = `${curStr} / 01:30`;
  }

  function openVideoModal(type = 'grp') {
    setVideoType(type);
    if (videoModal) {
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playVideo();
    }
  }

  function closeVideoModal() {
    pauseVideo();
    if (videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  btnPlayGrpVideo?.addEventListener('click', () => openVideoModal('grp'));
  btnPlayGrcVideo?.addEventListener('click', () => openVideoModal('grc'));

  videoTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setVideoType(btn.dataset.videoType);
    });
  });

  videoPlayCenter?.addEventListener('click', togglePlay);
  ctrlPlayBtn?.addEventListener('click', togglePlay);
  ctrlSoundBtn?.addEventListener('click', () => {
    const isMuted = ctrlSoundBtn.innerHTML.includes('slash');
    ctrlSoundBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
  });

  videoModalClose?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePreview();
      closeVideoModal();
      closeDrawer();
    }
  });

  /* ═══════════════════════════════════════════
     6. SMOOTH SCROLL FOR ANCHOR LINKS
  ════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
