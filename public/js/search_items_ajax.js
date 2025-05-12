(function () {
    let items_search_form=document.getElementById('items_search_form')
    let item_search_bar=document.getElementById('item_search')
    let item_list=document.getElementById('item_list')
    const error_tag = document.getElementById('items-error');

    items_search_form.addEventListener('submit', (event) => {
        event.preventDefault()
        error_tag.hidden = true;
        let search=item_search_bar.value
        try{
            if(search.length>0 && search.trim().length==0) throw "Error: you can not input just empty spaces"
            search=search.trim();
            if(search.length>256) throw "Error: search query is too long!"
            error_tag.hidden = true;
        }
        catch (e){
            const message = typeof e === 'string' ? e : e.message;
            error_tag.textContent = message;
            error_tag.hidden=false;
            return;
        }



          fetch('/items/search',{method: 'POST',headers: {'Content-Type': 'application/json'},body:JSON.stringify({item_search: search})})
          .then(function (response) {
            if(!response.ok) throw "Error: internal server error";
            return response.json()
          })
          .then(function (items) {
            item_list.innerHTML=''
            if(items && items.length>0){
                for(let item in items){
                    let available="No"
                    if(!items[item].CurrentRequest) available="Yes"
                    let html = `<div class="item"><h3>${items[item].name}</h3><p>Owner: ${items[item].ownerName}</p><p>Available: ${available}</p><p>Description: ${items[item].description}</p><a class = 'pageButton' href = '/item/${items[item]._id}'>Read More</a></div>`
                    item_list.insertAdjacentHTML('beforeend',html)
                }
            }
            else{
                throw "No results found!"
            }
          })
          .catch( function (e){
            const message = typeof e === 'string' ? e : e.message;
            error_tag.textContent = message;
            error_tag.hidden=false;
          }
          )
    });
})();