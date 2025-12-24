if (typeof localforage === 'undefined') {
    window.localforage = {
        setItem: function(key, value) {
            return Promise.resolve(localStorage.setItem(key, JSON.stringify(value)));
        },
        getItem: function(key) {
            return Promise.resolve(JSON.parse(localStorage.getItem(key)));
        },
        removeItem: function(key) {
            return Promise.resolve(localStorage.removeItem(key));
        }
    };
}
