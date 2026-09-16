/* =========================================================
   CDC CARE DIAGNOSTIC CENTRE - FRONTEND JAVASCRIPT
   Replace the URL below with your deployed Google Apps Script
   Web App URL ending in /exec.
   ========================================================= */

const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE";

const WHATSAPP_NUMBER = "923001535542";
const CLINIC_NAME = "CDC CARE DIAGNOSTIC CENTRE";

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupSmoothNavigation();
  setupWhatsAppButtons();
  setupServiceButtons();
  setupForms();
  setupDateMinimum();
});

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

function setupSmoothNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupWhatsAppButtons() {
  document.querySelectorAll("[data-whatsapp]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const message = button.dataset.message ||
        `Hello ${CLINIC_NAME}, I would like to inquire about your medical/diagnostic services.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    });
  });
}

function setupServiceButtons() {
  const appointmentService = document.getElementById("appointmentService");

  document.querySelectorAll(".inquire-btn").forEach(button => {
    button.addEventListener("click", () => {
      const service = button.dataset.service || "";
      if (appointmentService && service) {
        const option = [...appointmentService.options].find(o => o.text === service);
        if (option) appointmentService.value = option.value;
      }
      document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-service-link]").forEach(button => {
    button.addEventListener("click", () => {
      const service = button.dataset.serviceLink || "";
      if (appointmentService && service) {
        const option = [...appointmentService.options].find(o => o.text === service);
        if (option) appointmentService.value = option.value;
      }
    });
  });
}

function setupDateMinimum() {
  const dateInput = document.querySelector('input[name="preferredDate"]');
  if (dateInput) {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().split("T")[0];
    dateInput.min = local;
  }
}

function setupForms() {
  document.querySelectorAll(".lead-form").forEach(form => {
    form.addEventListener("submit", handleFormSubmit);
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = form.querySelector(".form-status");
  const button = form.querySelector(".submit-btn");

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus(status, "Please complete all required fields.", "error");
    return;
  }

  // Basic honeypot spam protection.
  const honeypot = form.querySelector('input[name="website"]');
  if (honeypot && honeypot.value.trim() !== "") {
    setStatus(status, "Unable to submit this request.", "error");
    return;
  }

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_")) {
    setStatus(status, "The website backend is not configured yet. Please add the Google Apps Script /exec URL in script.js.", "error");
    return;
  }

  if (button.disabled) return;

  const originalText = button.innerHTML;
  button.disabled = true;
  button.style.opacity = "0.7";
  button.innerHTML = "Submitting...";

  const formData = new FormData(form);
  const data = {
    formType: formData.get("formType") || "Contact",
    name: formData.get("name")?.trim() || "",
    email: formData.get("email")?.trim() || "",
    phone: formData.get("phone")?.trim() || "",
    preferredDate: formData.get("preferredDate") || "",
    preferredTime: formData.get("preferredTime") || "",
    service: formData.get("service") || "",
    inquiryType: formData.get("inquiryType") || "",
    message: formData.get("message")?.trim() || "",
    source: `${CLINIC_NAME} Website`,
    website: ""
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    const raw = await response.text();
    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("The backend returned an invalid response.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to submit the request.");
    }

    setStatus(
      status,
      "Thank you. Your request has been submitted successfully. CDC CARE DIAGNOSTIC CENTRE will contact you.",
      "success"
    );

    form.reset();
    setupDateMinimum();
  } catch (error) {
    console.error("Form submission error:", error);
    setStatus(
      status,
      "We could not submit your request. Please check the backend URL or contact the centre by phone or WhatsApp.",
      "error"
    );
  } finally {
    button.disabled = false;
    button.style.opacity = "1";
    button.innerHTML = originalText;
  }
}

function setStatus(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status ${type}`;
}

/*
  OPTIONAL: You can use this helper elsewhere on the page
  if you want a dynamic WhatsApp message for a selected service.
*/
function openWhatsAppForService(serviceName) {
  const message =
    `Hello ${CLINIC_NAME}, I would like to inquire about ${serviceName}.`;
  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}
