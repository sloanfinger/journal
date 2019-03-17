    
    /* global $, opener */
    
    $('#go').click(function() {
        var exercise = {
            description: $('#description').val(),
            start: $('#start').val(),
            end: $('#end').val()
        };
        opener.windowListener[document.body.getAttribute('data-create')].callback(exercise);
        window.close();
    });