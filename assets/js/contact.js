// ==========================================================================
// TENUTA VALMORA - VALIDAZIONE FORM CONTATTI
// Requisito: Il form non può essere inviato se non compilati almeno Nome e La tua mail
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('contact-name-error');
  const emailError = document.getElementById('contact-email-error');
  const successBox = document.getElementById('contact-success-box');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errori precedenti
    if (nameError) nameError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    nameInput.style.borderColor = '';
    emailInput.style.borderColor = '';

    // Validazione Nome
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      isValid = false;
      if (nameError) {
        nameError.textContent = 'Il campo "Nome" è obbligatorio.';
        nameError.style.display = 'block';
      }
      nameInput.style.borderColor = '#C0392B';
    }

    // Validazione La tua mail
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      isValid = false;
      if (emailError) {
        emailError.textContent = 'Il campo "La tua mail" è obbligatorio.';
        emailError.style.display = 'block';
      }
      emailInput.style.borderColor = '#C0392B';
    } else if (!validateEmail(emailVal)) {
      isValid = false;
      if (emailError) {
        emailError.textContent = 'Inserisci un indirizzo email valido (es. nome@dominio.it).';
        emailError.style.display = 'block';
      }
      emailInput.style.borderColor = '#C0392B';
    }

    // Se non valido, blocca l'invio
    if (!isValid) {
      return;
    }

    // Se valido: simula invio con successo
    const submitBtn = document.getElementById('contact-submit-btn');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Invio in corso...</span>';
    }

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        const clientNameDisplay = document.getElementById('success-client-name');
        const clientEmailDisplay = document.getElementById('success-client-email');
        if (clientNameDisplay) clientNameDisplay.textContent = nameVal;
        if (clientEmailDisplay) clientEmailDisplay.textContent = emailVal;
      }
    }, 800);
  });
});
