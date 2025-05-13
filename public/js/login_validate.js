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
                if (email.length === 0 || password.length === 0){
                    throw 'Error: At least one of the properties is invalid and cannot be an empty string or just spaces';
                }
                if(email.length<5) throw 'Error: email length too short'
                if(email.length>320) throw 'Error: email length too long';
                if(!email.includes('@') || !email.includes('.')) throw 'Error: invalid email format'
                let str = password.trim();
                let lower = str.toLocaleLowerCase();
                let upper = str.toLocaleUpperCase();
                let lowercase = 0;
                let uppercase = 0;
                let numbers = 0;
                let spaces = 0;
                let otherCharacters = 0;
                let i = 0;
                while (i < str.length) {
                    if (str[i] === " ") {
                        spaces++;
                    }
                    else if (str[i] >= '0' && str[i] <= '9') {
                        numbers++;
                    }
                    else if (str[i] === upper[i] && str[i] !== lower[i]) {
                        uppercase++;
                    }
                    else if (str[i] === lower[i] && str[i] !== upper[i]) {
                        lowercase++;
                    }
                    else {
                        otherCharacters++;
                    }
                    i++;
                }
                if (spaces > 0 || str.length < 8) {
                    throw 'Password does not meet the requirements. Please enter a valid password.'
                }
                if (uppercase < 1 || numbers < 1 || otherCharacters < 1) {
                    throw 'Password needs to contain at least one uppercase character, one number, and one special character.'
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