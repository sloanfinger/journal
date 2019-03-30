    
    /* global $, windowListener */
    
    $('#go').click(function() {
        var time = $('#time').val().split(':');
        var hour = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var ampm = ['am', 'pm'];
        windowListener[$('#window').attr('data-create')].callback(hour[Number(time[0])].toString() + ':' + time[1] + ampm[Math.floor(Number(time[0]) / 12)]);
    });