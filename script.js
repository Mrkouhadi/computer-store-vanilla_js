// laptop CLASS : represents a laptop
class Laptop {
    constructor(brand, processor, ram, price, id) {
        this.brand = brand;
        this.processor = processor;
        this.ram = ram;
        this.price = price;
        this.id = id;
    }
}

// UI class : handle UI class
class UI {
    static displayLaptop() {
        const laptops = Stock.getLaptops();
        laptops.forEach((laptop) => UI.addLaptopToList(laptop));
    }
    static addLaptopToList(laptop){
            const list = document.querySelector('#laptop-list');

            const row = document.createElement('tr');

            row.innerHTML = `
                                <td>${laptop.brand}</td>
                                <td>${laptop.processor}</td>
                                <td>${laptop.ram} GB</td>
                                <td>${laptop.price} $</td>
                                <td>${laptop.id} </td>
                                <td> <a href="#" class="btn btn-danger btn-sm delete">X</a> </td>
                            `

            list.appendChild(row);
    }
    // method of removing a laptop when clicking the red x button
    static deleteLaptop(el){
        if(el.classList.contains('delete')){
            // delete the parentelment of the paranetElement of the link X (icon).. tr => button >> i
               el.parentElement.parentElement.remove();
        }
    }

    // show an alert when submitting empty form or one of the form's input is empty
    static showAlert(message, className){
        // create this HTML block: <div class="alert alert-sucess"> You have to fill in all input of the form ! </div>
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        div.style.textAlign = 'center'; // just centering the message in the div we just created.
        const container = document.querySelector('.container');
        const form = document.querySelector('#laptop-form');
        container.insertBefore(div, form);

        //delete the alert after 2 seconds (2000 ms)
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    // method ofclearing the input AFTER submitting the form
    static clearInputs() {
        document.querySelector('#brand').value = '';
        document.querySelector('#processor').value = '';
        document.querySelector('#ram').value = '';
        document.querySelector('#price').value = '';
        document.querySelector('#id').value = '';
    }
}


// store class: handles Localstorage

class Stock {

    static getLaptops() {
        let laptops;
        if(localStorage.getItem('laptops') === null){
            laptops = [];
        }else{
            laptops = JSON.parse(localStorage.getItem('laptops'));
        }
        return laptops;
    }

    static addLaptop(laptop) {
        const laptops = Stock.getLaptops();
        // laptops.push(laptop); // [...laptops, laptop]
        localStorage.setItem('laptops', JSON.stringify([...laptops, laptop]));
    }

    static removeLaptop(id){
        const laptops = Stock.getLaptops();

        laptops.forEach((laptop, index) => {
            if(laptop.id === id){
                laptops.splice(index, 1);
            }
        });
        localStorage.setItem('laptops', JSON.stringify(laptops));
    }
}

// display laptop (when content is loaded) Event listener
document.addEventListener('DOMContentLoaded', UI.displayLaptop);

// Add a laptop
document.querySelector('#laptop-form').addEventListener('submit', (event) => {
    // Prevent Default
    event.preventDefault();
    // get Form values
    const brand = document.querySelector('#brand').value;
    const processor = document.querySelector('#processor').value;
    const ram = document.querySelector('#ram').value;
    const price = document.querySelector('#price').value;
    const id = document.querySelector('#id').value;

    // Validation: add a laptop
    if(brand === '' || processor === '' || ram === '' || price === '' || id === ''){
        UI.showAlert(' You have to fill in all inputs of the form ! ', "danger");
    }else{

        // Instantiate laptop
        const laptop = new Laptop(brand, processor, ram, price, id);

        // Add latop to UI
        UI.addLaptopToList(laptop);

        // add laptop to STOCK(local storage)
        Stock.addLaptop(laptop);

        // show the alert
        UI.showAlert(' Nice ! You just added a laptop to the list !', "info");

        // Clear the UI inputs
        UI.clearInputs();
    }
});

//remove a laptop
document.querySelector('#laptop-list').addEventListener('click', (event) => {
    // remove it from the UI
    UI.deleteLaptop(event.target);

    // remove it from the stock (localstorage)
    Stock.removeLaptop(event.target.parentElement.previousElementSibling.textContent.trim());

    // show the alert
    UI.showAlert(' You have just deleted a laptop from the list ! ', "success");
})
