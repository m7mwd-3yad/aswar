/* ===================================================================
   شركة اسوار الكنانة للمقاولات العامة
   JavaScript — تفاعلات معرض الأعمال وفلترة الأقسام والنوافذ المنبثقة
   =================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Gallery Category Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      galleryItems.forEach(item => {
        const itemCat = item.dataset.category;
        if (filterVal === 'all' || itemCat === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Gallery Items WhatsApp Instant Inquiry ── */
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title || 'تصميم من معرض الأعمال';
      const msg = `مرحباً شركة اسوار الكنانة، أرغب بالاستفسار عن تفاصيل وتكلفة هذا المشروع: (${title})`;
      const url = `https://wa.me/966501910554?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  });

  /* ── Official Documents Modal ── */
  const modal = document.getElementById('preview-modal');
  const modalClose = document.getElementById('modal-close');
  const btnShowDocs = document.getElementById('btn-show-docs');
  const modalImg = document.getElementById('modal-image');
  const modalHeading = document.getElementById('modal-heading');
  const modalDesc = document.getElementById('modal-desc');

  function openDocsModal() {
    if (!modal) return;
    if (modalHeading) modalHeading.textContent = 'الوثائق الرسمية — إثبات العنوان الوطني والسجل التجاري';
    if (modalImg) modalImg.src = 'assets/docs/address_proof.png';
    if (modalDesc) modalDesc.textContent = 'إثبات العنوان الوطني المعتمد لشركة اسوار الكنانة للمقاولات العامة — رقم الإثبات: 1088401155 | السجل: 3133277033 (حائل)';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnShowDocs?.addEventListener('click', openDocsModal);
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Smooth Scroll for Anchor Links ── */
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
