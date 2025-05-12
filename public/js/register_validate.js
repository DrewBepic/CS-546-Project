(function () {
    const register_form= document.getElementById('register_form')
      if(register_form){
        const register_name =document.getElementById('name');
        const register_email =document.getElementById('email');
        const register_password=document.getElementById('password');
        const register_confirmpassword =document.getElementById('confirmPassword');
        const error_tag = document.getElementById('register-error');
        register_form.addEventListener('submit', (event) => {
            event.preventDefault();
            error_tag.hidden = true;
            let name= register_name.value;
            let email= register_email.value;
            let password= register_password.value;
            let passConfirm= register_confirmpassword.value;
            try{
           if (!name || !email || !password || !passConfirm)  throw 'Error: All fields need to have valid values';

            if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof passConfirm !== 'string') {
                throw 'Error: One of the properties is of incorrect type and must be a string';
            }
            name = name.trim()
            email = email.trim().toLowerCase()
            if (name.length === 0 || email.length === 0 || password.length === 0 || passConfirm.length === 0) {
                throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';
            }
            if (passConfirm !== password) {
                throw "Error: Passwords do not match"
            }
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
            register_form.submit();
        })
    }
})()

    
