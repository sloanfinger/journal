    
    /* global $, opener */
    
    $('#go').click(function() {
        opener.windowListener[document.body.getAttribute('data-create')].callback($('#hour').val() + $('#minute').val() + $('#ampm').val().toLowerCase());
        window.close();
    })