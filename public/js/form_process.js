// let itemName = document.getElementById('name')
// let itemDesc = document.getElementById('description')
// import itemCommands from '../data/items.js'

// if (myForm) {
//     myForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         if (itemName.value && itemDesc.value) {
//             try{
//                 await itemCommands.addItem(id, body.name, body.description)
//             }
//         }else{
//             theErrors.hidden = false 
//                 theErrors.innerHTML = "Please input a name and description"
//                 myForm.reset() 
//                 arrayInput.focus()
//         }
//     })
// };

const addItemForm = document.getElementById('addItemForm');
const myError = document.getElementById('error');
const deleteButton = document.querySelectorAll('.deleteWishlistBtn');

if (addItemForm) {
    addItemForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!name || !description) {
            myError.hidden = false;
            myError.innerHTML = 'Please enter both the item name and description.';
            return;
        }

        if (typeof name !== 'string' || name.length === 0 || name.length < 2 || name.length > 20) {
            myError.hidden = false;
            myError.innerHTML = 'Item name should be a valid non-empty string that is between 2 and 20 characters.';
            return;
        }

        if (typeof description !== 'string' || description.length === 0 || description.length < 2 || description.length > 50) {
            myError.hidden = false;
            myError.innerHTML = 'Item description should be a valid non-empty string that is between 2 and 50 characters.';
            return;
        }

        for (let x of name) {
            const check = x.charCodeAt(0);
            if (!(check >= 65 && check <= 90) && !(check >= 97 && check <= 122) && !(check >= 48 && check <= 57) && check !== 32) {
                myError.hidden = false;
                myError.innerHTML = 'Item name can only contain letters a-z, A-Z, spaces, or positive whole numbers.';
                return;
            }
        }

        for (let x of description) {
            const check = x.charCodeAt(0);
            if (!(check >= 65 && check <= 90) && !(check >= 97 && check <= 122) && !(check >= 48 && check <= 57) && check !== 32){
                myError.hidden = false;
                myError.innerHTML = 'Item description can only contain letters a-z, spaces, A-Z, or positive whole numbers.';
                return;
            }
        }

        myError.hidden = true;
        addItemForm.submit();
});}