document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Password Visibility Toggle (WCAG 4.1.2 Name, Role, Value Compliance)
  // ==========================================================================
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('password-toggle');

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isPasswordType = passwordInput.getAttribute('type') === 'password';
      
      // Toggle string structural field type state
      passwordInput.setAttribute('type', isPasswordType ? 'text' : 'password');
      
      // Update accessible state criteria
      passwordToggle.setAttribute('aria-pressed', isPasswordType ? 'true' : 'false');
      passwordToggle.setAttribute('aria-label', isPasswordType ? 'Hide password text' : 'Show password as plain text');
      passwordToggle.textContent = isPasswordType ? 'Hide' : 'Show';
    });
  }

  // ==========================================================================
  // 2. Accessible Form Evaluation & Validation System (WCAG 3.3.1 & 3.3.2)
  // ==========================================================================
  const signupForm = document.getElementById('landing-signup-form');
  const errorSummary = document.getElementById('form-errors');

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      // Prevent structural execution pipeline until manual clean state matches are validated
      event.preventDefault();
      
      const emailInput = document.getElementById('email');
      const errors = [];
      
      // Clear out older inline programmatic structural assertions if active
      errorSummary.classList.add('hidden');
      errorSummary.innerHTML = '';
      emailInput.removeAttribute('aria-invalid');
      passwordInput.removeAttribute('aria-invalid');

      // Email Format and Empty Matching Validation Checks
      if (!emailInput.value.trim()) {
        errors.push({
          fieldId: 'email',
          message: 'The School Email Address field cannot be left blank.'
        });
      } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
        errors.push({
          fieldId: 'email',
          message: 'Please enter a structurally valid email address format (e.g., student@university.edu).'
        });
      }

      // Password Integrity Length Rule Validation Checks
      if (!passwordInput.value.trim()) {
        errors.push({
          fieldId: 'password',
          message: 'The Security Password creation field cannot be left blank.'
        });
      } else if (passwordInput.value.length < 8) {
        errors.push({
          fieldId: 'password',
          message: 'Your Security Password must contain at least 8 structural characters.'
        });
      }

      // Render Errors or Process Success
      if (errors.length > 0) {
        // Construct error elements structurally
        const title = document.createElement('h3');
        title.id = 'error-summary-title';
        title.textContent = `There were ${errors.length} validation errors processing your signup request:`;
        errorSummary.appendChild(title);

        const list = document.createElement('ul');
        errors.forEach(err => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          
          // Accessible Focus Navigation Pattern: Links inside error summary jump to the field
          link.href = `#${err.fieldId}`;
          link.textContent = err.message;
          
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetField = document.getElementById(err.fieldId);
            if (targetField) {
              targetField.focus();
            }
          });

          item.appendChild(link);
          list.appendChild(item);

          // Mark specific invalid properties semantically on underlying inputs
          const badInput = document.getElementById(err.fieldId);
          if (badInput) {
            badInput.setAttribute('aria-invalid', 'true');
          }
        });

        errorSummary.appendChild(list);
        errorSummary.classList.remove('hidden');
        
        // Shift context container focus to screen reader alert message automatically
        errorSummary.focus();
      } else {
        // Successful execution branch simulation
        alert('Registration validated! Welcome to your FlowNote workspace trials.');
        signupForm.reset();
      }
    });
  }
});