    
    /* global $, windowListener */
    
    $('#go').click(function() {
        var start = $('#start').val().split(':');
        var end = $('#end').val().split(':');
        var hour = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var ampm = ['am', 'pm'];
        var exercise = {
            description: $('#description').val(),
            start: hour[Number(start[0])].toString() + ':' + start[1] + ampm[Math.floor(Number(start[0]) / 12)],
            end: hour[Number(end[0])].toString() + ':' + end[1] + ampm[Math.floor(Number(end[0]) / 12)]
        };
        windowListener[$('#window').attr('data-create')].callback(exercise);
        window.close();
    });