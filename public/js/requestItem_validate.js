(function () {
    const requestItemForm = document.getElementById("requestItemForm")
    if(requestItemForm){
        const description_input=document.getElementById('description');
        const error_tag = document.getElementById('error-request-item');
        requestItemForm.addEventListener('submit', (event) => {
            event.preventDefault();
            error_tag.hidden = true;
            let description=description_input.value;
            try{
                if(!description){
                    throw "Error: request description not given";
                }
                if(typeof description !="string"){
                    throw "Error: description must be a string";
                }
                description=description.trim();
                if(description.length==0){
                    throw "Error: description can not be left empty or be just empty spaces";
                }
                if(description.length>500){
                    throw "Error: description must be under 500 characters";
                }
            }
            catch (e){
                const message = typeof e === 'string' ? e : e.message;
                error_tag.textContent = message;
                error_tag.hidden=false;
                return;
            }
            requestItemForm.submit()
        }
        )
    }
    

})();