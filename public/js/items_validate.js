(function () {
    const items_form=document.getElementById('items_search_form');
    if(items_form){
        const search_bar_input=document.getElementById('item_search');
        const error_tag = document.getElementById('items-error');


        items_form.addEventListener('submit', (event) => {
            event.preventDefault();
            error_tag.hidden = true;
            let search=search_bar_input.value
            try{
                if(typeof search!="string") throw "Error: search query must be of type string"
                search=search.trim();
                if(search.length==0) throw "Error: search query can not be empty or just spaces"
                if(search.length>100) throw "Error: search query is too long!"
                error_tag.hidden = true;
            }
            catch (e){
                const message = typeof e === 'string' ? e : e.message;
                error_tag.textContent = message;
                error_tag.hidden=false;
                return;
            }
            items_form.submit();
        })
    }
})()