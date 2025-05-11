(function () {
    const login_form=document.getElementById("loginForm");
    if(login_form){
        const email_input = document.getElementById('email');
        const password_input = document.getElementById('password');
        const error_tag = document.getElementById('error');

        login_form.addEventListener('submit', (event) => {
            event.preventDefault();
            error_tag.hidden = true;
            let email=email_input.value;
            let password=password_input.value;
            try{
                if (!email || !password)
                    throw 'Error: All fields need to have non-empty values';
                if (typeof email !== 'string' || typeof password !== 'string') {
                    throw 'Error: One of the properties is of incorrect type and must be a string';
                }
                email = email.trim().toLowerCase()
                password=password.trim();
                if (email.length === 0 || password.length === 0){
                    throw 'Error: At least one of the properties is invalid and cannot be an empty string or just spaces';
                }
                error_tag.hidden = true;
                
            }
            catch (e){
                const message = typeof e === 'string' ? e : e.message;
                error_tag.textContent = message;
                error_tag.hidden=false;
                return;
            }
            login_form.submit();
        })
    }
})();