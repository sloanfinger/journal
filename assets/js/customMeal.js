    
    /* global $, opener, localStorage */
    
    $('#go').click(function() {
        opener.windowListener[document.body.getAttribute('data-create')].callback($('#hour').val() + $('#minute').val() + $('#ampm').val().toLowerCase());
        window.close();
    });
    
    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', 'light');
    } else
    if (localStorage.getItem('theme') === 'light') {
        $('link[href="./assets/css/bulma-dark.css"]').attr('href', './assets/css/bulma.css');
    } else
    if (localStorage.getItem('theme') === 'dark') {
        $('link[href="./assets/css/bulma.css"]').attr('href', './assets/css/bulma-dark.css');
    }