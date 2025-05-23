(function () {
    const edit_form= document.getElementById('item_edit_form')
     const comment_form= document.getElementById('item_comment_form')
      if(comment_form){
        const comment_item =document.getElementById('comment');
        const error_tag = document.getElementById('comment-error');
        comment_form.addEventListener('submit', (event) => {
            event.preventDefault();
            try{
            if(typeof comment_item.value!="string"){
                throw "Comments must be a string!"
            }
            comment_item.value=comment_item.value.trim();
            if(comment_item.value.length==0){
                throw "Comments can non be empty or just spaces!"
            }
            let comment= "";
            let colon= 0;
            error_tag.hidden = true;
            for(let i=0; i<comment_item.value.length; i++){
                if(comment_item.value[i]===":"){
                    colon=i;
                    break;
                }
            }
            for(let x=colon+1; x<comment_item.value.length; x++){
                comment= comment+ comment_item.value[x];
            }

            
            if (typeof comment !== 'string' || comment.length === 0 || comment.length < 2 || comment.length > 50) {
                throw 'A comment should be a valid non-empty string that is between 2 and 50 characters.';
            }
            for (let x of comment) {
            const check = x.charCodeAt(0);
            if (!(check >= 65 && check <= 90) && !(check >= 97 && check <= 122) && !(check >= 48 && check <= 57) && check !== 32){
                throw 'Comments can only contain letters a-z, spaces, A-Z, or positive whole numbers.';
            }
        }
            error_tag.hidden = true;
            }
            catch (e){
                const message = typeof e === 'string' ? e : e.message;
                error_tag.textContent = message;
                error_tag.hidden=false;
                return;
            }
            comment_form.submit();
        })


    }
    if(edit_form){
        const name_item =document.getElementById('name');
        const description_item = document.getElementById('description');
            const error_tag = document.getElementById('edit-error');
        edit_form.addEventListener('submit', (event) => {
            event.preventDefault();
            error_tag.hidden = true;
            let name= name_item.value;
            let description= description_item.value;
            try{
            if (typeof name !== 'string'){
                throw  'Item name should be a valid non-empty string that is between 2 and 20 characters.';
            }
            name=name.trim();
            if (name.length === 0 || name.length < 2 || name.length > 20) {
                throw  'Item name should be a valid non-empty string that is between 2 and 20 characters.';
            }
            if(typeof description !== 'string'){
                throw 'Item description should be a valid non-empty string that is between 2 and 50 characters.';
            }
            description=description.trim()
            if ( description.length === 0 || description.length < 2 || description.length > 50) {
                throw 'Item description should be a valid non-empty string that is between 2 and 50 characters.';
            }
            for (let x of name) {
            const check = x.charCodeAt(0);
            if (!(check >= 65 && check <= 90) && !(check >= 97 && check <= 122) && !(check >= 48 && check <= 57) && check !== 32) {
                throw 'Item name can only contain letters a-z, A-Z, spaces, or positive whole numbers.';
            }
        }

        for (let x of description) {
            const check = x.charCodeAt(0);
            if (!(check >= 65 && check <= 90) && !(check >= 97 && check <= 122) && !(check >= 48 && check <= 57) && check !== 32){
                throw 'Item description can only contain letters a-z, spaces, A-Z, or positive whole numbers.';
            }
        }
            error_tag.hidden = true;
            }
            catch (e){
                const message = typeof e === 'string' ? e : e.message;
                error_tag.textContent = message;
                error_tag.hidden=false;
                return;
            }
            edit_form.submit();
        })


    }
})()

    
