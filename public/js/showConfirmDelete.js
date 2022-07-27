const deleteCampgroundForm = document.querySelector('#deleteCampgroundForm');
const deleteReviewForms = document.querySelectorAll('.delete-review-form');
const modalTitle = document.querySelector('#modalTitle');

// Prompt to confirm Deleting a campground
if (deleteCampgroundForm) {
  deleteCampgroundForm.title = 'Delete Campground';
  deleteCampgroundForm.addEventListener('submit', e => {
    e.preventDefault(); // prevent form submitting
  
    const modal = new bootstrap.Modal('#confirmModal');
    modalTitle.textContent = e.currentTarget.title;
    modal.show();
  
    const confirmBtn = document.querySelector('#confirmBtn');
    confirmBtn.addEventListener('click', e => {
      deleteCampgroundForm.submit();
    });
  });
}

// Prompt to confirm Deleting a review
if (deleteReviewForms) {
  deleteReviewForms.forEach(form => {
    form.title = 'Delete Review';
    form.addEventListener('submit', e => {
      e.preventDefault(); // prevent form submitting
  
      const modal = new bootstrap.Modal('#confirmModal');
      modalTitle.textContent = e.currentTarget.title;
      modal.show();
  
      const confirmBtn = document.querySelector('#confirmBtn');
      confirmBtn.addEventListener('click', e => {
        form.submit();
      });
    });
  });
}
