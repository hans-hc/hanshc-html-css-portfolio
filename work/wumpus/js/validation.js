/*
* Hansen Cheng
* March 30 2025
*/
//Function to validate the form inputs
function validateForm() {
    //Retrieve email, name, and error display elements from the form
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const emailError = document.getElementById('email-error');
    const nameError = document.getElementById('name-error');
    const errorImage = document.getElementById('error-image'); //Retrieve the error image element

    //Reset previous error messages and hide the error image
    emailError.textContent = '';
    nameError.textContent = '';
    if (errorImage) {
        errorImage.style.display = 'none';
    }

    //If the email does not contain an "@" symbol, display an error and show the error image
    if (email.indexOf('@') === -1) {
        emailError.textContent = 'Email address must include an "@" symbol.';
        if (errorImage) errorImage.style.display = 'block';
        return false;
    }

    //If the email does not contain a dot (".") after the "@" symbol, display an error and show the error image
    const parts = email.split('@');
    if (parts.length < 2 || parts[1].indexOf('.') === -1) {
        emailError.textContent = 'Email address must include a dot (".") after the "@" symbol.';
        if (errorImage) errorImage.style.display = 'block';
        return false;
    }

    //Use a regular expression to validate the email format (allows minimal valid formats like "a@b.c")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{1,}$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address (e.g., example@domain.com).';
        if (errorImage) errorImage.style.display = 'block';
        return false;
    }

    //If the name field is empty, display an error
    if (name === '') {
        nameError.textContent = 'Please enter your name.';
        return false;
    }

    //If all validations pass, return true
    return true;
}

//When the DOM is fully loaded, attach the submit event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    //Retrieve the form element.
    const form = document.getElementById('playerForm');
    if (form) {
        //Attach an event listener to the form's submit event to prevent submission if validation fails
        form.addEventListener('submit', (e) => {
            if (!validateForm()) {
                e.preventDefault();
            }
        });
    }
});
