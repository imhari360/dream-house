/* Dream House interactions
   IMPORTANT: replace WHATSAPP_NUMBER with your business WhatsApp number,
   including country code but without +, spaces, or dashes. Example: 919876543210
*/
// replace your business whatsapp number
const WHATSAPP_NUMBER = "91XXXXXXXXX";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta");
  const year = document.getElementById("year");
  const form = document.getElementById("enquiry-form");
  const status = document.getElementById("form-status");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  let previousFocus = null;

  if (year) year.textContent = new Date().getFullYear();

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    mainNav?.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });
  document.addEventListener("click", event => {
    if (mainNav?.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle?.contains(event.target)) closeMenu();
  });

  // Scroll reveal animations. Content remains visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Highlight the navigation item for the section currently in view.
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-link").forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Gallery lightbox
  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImage) return;
    previousFocus = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt || "Expanded gallery image";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  }
  function closeLightbox() {
    if (!lightbox?.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lightboxImage) lightboxImage.src = "";
    previousFocus?.focus?.();
  }
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      openLightbox(item.dataset.full || img?.src, img?.alt);
    });
  });
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  // Static-site enquiry form: prepares a WhatsApp message. No data is stored or sent automatically.
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const interest = String(formData.get("interest") || "Property details");
    const message = String(formData.get("message") || "").trim();

    const enquiry = [
      "Hello Dream House, I would like to make a property enquiry.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Interested in: ${interest}`,
      message ? `Message: ${message}` : ""
    ].filter(Boolean).join("\n");

    if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) {
      if (status) {
        status.textContent = "Form validated. Please set your real WhatsApp number in script.js (country code + 10 digits) to enable enquiry submission.";
      }
      return;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiry)}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!newWindow) window.location.href = url;
    if (status) status.textContent = "Your enquiry message is ready in WhatsApp. Please review and send it there.";
  });
});
