    
    /* global $, opener, copyToClipboard */
    
    $('#workout').on('change', function() {
        if ($(this).val() == 'No') {
            nutrition.showWorkout = false;
        } else {
            nutrition.showWorkout = true;
        }
        opener.nutrition = nutrition;
        opener.updateGUI();
    });
    
    $('#share').click(function() {
        $.ajax({
            url: 'https://api.myjson.com/bins',
            type: 'POST',
            data: JSON.stringify(nutrition),
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            success: function(data, textStatus, jqXHR){
                opener.window.location.href = '#/' + data.uri.split('bins/')[1] + '/';
                copyToClipboard(opener.window.location.href);
                alert('Permalink copied to clipboard.');
            },
            error: function(data) {
                alert('An error occured while saving your data.');
            }
        });
    });
    
    var nutrition = opener.nutrition;