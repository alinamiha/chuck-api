// console.log(fetch('https://api.chucknorris.io/jokes/random', { "method": "GET" })
//     .then((resp) => {
//         return resp.json()
//     }).then((cat) => {
//     })
// );



class Application {

    constructor() {

        /** Data fields */
        this.basePath = 'https://api.chucknorris.io/jokes/';
        this.categories = [];
        this.jokeList = [];
        this.favouritesList = []
            // this.jokeList = [{
            //     categories: [],
            //     "icon_url" : "https://assets.chucknorris.host/img/avatar/chuck-norris.png",
            //     "id" : "hRigJET1RBiUplTW2n6rpQ",
            //     "url" : "",
            //     "updated_at" : "2022-02-02",
            //     "value" : "Chuck Norris can burp Haiku verse in hex."
            // }];
        this.query = '';


        /** Menu elements */
        const self = this;
        this.menu = document.querySelector(".menu");
        this.menuItems = document.querySelectorAll(".menu-item");
        this.hamburger = document.querySelector(".hamburger");
        this.closeIcon = document.querySelector(".close-icon");
        this.menuIcon = document.querySelector(".menu-icon");

        /** Search options */
        this.submitButton = document.getElementById("submit-button");
        this.searchInput = document.getElementById("search-input");
        this.searchOptions = document.querySelectorAll(".search-options__item-input");

        /** Category elements */
        this.categoriesOptionsContainer = document.querySelector(".categories-options");

        /** Joke elements */
        this.jokeListTemplate = document.querySelector(".joke-list");

        /** Favourite elements */
        this.favouriteListTemplate = document.querySelector(".favourite-list");

        this.getCategories();

        /** Event handlers */
        this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
        this.submitButton.addEventListener("click", this.searchJokes.bind(this));
        this.searchInput.addEventListener("click", this.handleSearchOptionsChanged.bind(this));
        this.searchOptions.forEach((searchOption) => {
            searchOption.addEventListener("click", self.handleSearchOptionsChanged.bind(self))
        });
        this.favorites = JSON.parse(window.localStorage.getItem('favorites')) || [];
        this.printFavourites(this.favorites)
    }

    toggleMenu() {
        if (this.menu.classList.contains("show-menu")) {
            this.menu.classList.remove("show-menu");
            this.closeIcon.style.display = "none";
            this.menuIcon.style.display = "block";
        } else {
            this.menu.classList.add("show-menu");
            this.closeIcon.style.display = "block";
            this.menuIcon.style.display = "none";
        }
    }

    choseCategory(event) {
        this.categoryItems.forEach((categoryItem) => {
            categoryItem.classList.remove('categories-options__item_active')
        })

        this.currentCategory = event.target.getAttribute('data-name')

        event.target.classList.add('categories-options__item_active')
    }

    searchJokes() {
        this.currentSearchOption = document.querySelector(".search-options__item-input:checked");

        switch (this.currentSearchOption.getAttribute('id')) {
            case 'random':
                this.getRandomJoke()
                break;
            case 'categories':
                this.getJokesByCategory(this.currentCategory)
                break;
            case 'query':
                this.getJokesByQuery(this.searchInput.value)
                break;
        }
    }

    handleSearchOptionsChanged() {
        this.currentSearchOption = document.querySelector(".search-options__item-input:checked");

        this.categoriesOptionsContainer.classList.add('hide')
        this.searchInput.classList.add('hide')

        switch (this.currentSearchOption.getAttribute('id')) {
            case 'categories':
                this.categoriesOptionsContainer.classList.remove('hide')
                break;
            case 'query':
                this.searchInput.classList.remove('hide')
                break;
        }
    }

    getRandomJoke() {
        const self = this;
        fetch(this.basePath + 'random').then(response => {
            return response.json()
        }).then(joke => {
            self.jokeList = [joke];
            self.printJokes();
        })
    }

    getJokesByCategory(category) {

        const self = this;
        fetch(this.basePath + 'random?category=' + category).then(response => {
            return response.json()
        }).then(joke => {
            self.jokeList = [joke];
            self.printJokes();
        })
    }

    getJokesByQuery(query) {

        if (query.trim().length === 0) {
            return;
        }

        const self = this;
        fetch(this.basePath + 'search?query=' + query).then(response => {
            return response.json()
        }).then(data => {
            self.jokeList = data.result;
            self.printJokes();
        })
    }

    addToFavorite(query) {

    }

    getCategories() {
        const self = this;
        fetch(this.basePath + 'categories').then(response => {
            return response.json()
        }).then(categories => {
            self.categories = categories;
            self.currentCategory = categories[0] || null;
            self.printCategories();
            this.categoryItems = document.querySelectorAll(".categories-options__item");
            this.categoryItems.forEach((categoryItem) => {
                categoryItem.addEventListener("click", self.choseCategory.bind(self))
            });
        })
    }

    printCategories() {

        let categoriesTemplate = ``;

        this.categories.forEach((category) => {
            categoriesTemplate += (`<div class="categories-options__item" data-name="` + category + `">
                    ` + (category.charAt(0).toUpperCase() + category.slice(1)) + `</div>`);
        })

        this.categoriesOptionsContainer.innerHTML = categoriesTemplate;
    }

    printJokes() {

        let jokesTemplate = ``;

        this.jokeList.forEach((joke) => {

            const dateUpdated = new Date(joke.updated_at);
            const today = new Date();
            const diffTime = Math.abs(today - dateUpdated);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            let categoriesTemplate = ``;

            joke.categories.forEach((category) => {
                categoriesTemplate += `
                <span class="card-category text-uppercase">` + category + `</span>
                `;
            })

            jokesTemplate += `
                <div class="joke-card card" data-id="` + joke.id + `">
                    <div class="d-flex justify-content-end">
                        <img class="card-favorite" src="src/img/empty-heart.svg" alt="">
                        <img class="card-favorite d-none" src="src/img/heart.svg" alt="">
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <div class="card-message__icon d-flex justify-content-center">
                                <img src="src/img/message.svg" alt="">
                            </div>
                        </div>
                        <div class="col-10">
                            <div class="card-content">
                                <div class="card-id">
                                    <span>ID: <a href="` + joke.url + `">` + joke.id + `<img src="src/img/link.svg" alt=""></a></span>
                                </div>
                                <div class="card-text">
                                    <p>` + joke.value + `</p>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span class="card-date">Last update: ` + diffHours + ` hours ago</span>
                                    <div class="card-categories d-flex">
                                    ` + categoriesTemplate + `
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })

        this.jokeListTemplate.innerHTML = jokesTemplate;

        this.favoriteBtns = document.querySelectorAll(".card-favorite");
        this.favoriteBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleFavoriteBtnClick.bind(this))
        })
    }

    printFavourites(favourites) {

        let jokesTemplate = ``;

        favourites.forEach((joke) => {

            const dateUpdated = new Date(joke.updated_at);
            const today = new Date();
            const diffTime = Math.abs(today - dateUpdated);
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

            let categoriesTemplate = ``;

            joke.categories.forEach((category) => {
                categoriesTemplate += `
                <span class="card-category text-uppercase">` + category + `</span>
                `;
            })

            jokesTemplate += `
                <div class="joke-card favourite-card card" data-id="` + joke.id + `">
                    <div class="d-flex justify-content-end">
                        <img class="card-favorite d-none" src="src/img/empty-heart.svg" alt="">
                        <img class="card-favorite" src="src/img/heart.svg" alt="">
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <div class="card-message__icon d-flex justify-content-center">
                                <img src="src/img/message.svg" alt="">
                            </div>
                        </div>
                        <div class="col-10">
                            <div class="card-content">
                                <div class="card-id">
                                    <span>ID: <a href="` + joke.url + `">` + joke.id + `<img src="src/img/link.svg" alt=""></a></span>
                                </div>
                                <div class="card-text">
                                    <p>` + joke.value + `</p>
                                </div>
                                <span class="card-date">Last update: ` + diffHours + ` hours ago</span>
                                <div class="card-categories d-flex">
                                ` + categoriesTemplate + `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })

        this.favouriteListTemplate.innerHTML = jokesTemplate;

        this.favoriteBtns = document.querySelectorAll(".card-favorite");
        this.favoriteBtns.forEach((btn) => {
            btn.addEventListener('click', this.handleDeleteFavoriteBtnClick.bind(this))
        })
    }

    handleFavoriteBtnClick(event) {

        const id = event.target.closest('.joke-card').getAttribute('data-id')
        const joke = this.jokeList.find((joke) => {
            return joke.id === id;
        })


        const favorites = JSON.parse(window.localStorage.getItem('favorites')) || [];
        const filteredJokes = favorites.filter((favJoke) => {
            return favJoke.id !== joke.id;
        })

        if (filteredJokes.length === favorites.length) {
            filteredJokes.push(joke)
        }

        window.localStorage.setItem('favorites', JSON.stringify(filteredJokes));
        this.printFavourites(filteredJokes)

    }

    handleDeleteFavoriteBtnClick(event) {

        const id = event.target.closest('.joke-card').getAttribute('data-id')
        const joke = this.favorites.find((joke) => {
            return joke.id === id;
        })


        const favorites = JSON.parse(window.localStorage.getItem('favorites')) || [];
        const filteredJokes = favorites.filter((favJoke) => {
            return favJoke.id !== joke.id;
        })

        if (filteredJokes.length === favorites.length) {
            filteredJokes.push(joke)
        }

        window.localStorage.setItem('favorites', JSON.stringify(filteredJokes));
        this.printFavourites(filteredJokes)

    }

    getCookie(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

    setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    //  setCookie(name,value,days) {
    //     var expires = "";
    //     if (days) {
    //         var date = new Date();
    //         date.setTime(date.getTime() + (days*24*60*60*1000));
    //         expires = "; expires=" + date.toUTCString();
    //     }
    //
    //     document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    // }
    //
    // getCookie(name) {
    //     var nameEQ = name + "=";
    //     var ca = document.cookie.split(';');
    //     for(var i=0;i < ca.length;i++) {
    //         var c = ca[i];
    //         while (c.charAt(0)==' ') c = c.substring(1,c.length);
    //         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    //     }
    //     return null;
    // }
}

const app = new Application();