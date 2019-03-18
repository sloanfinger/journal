    
    /* global $, opener, copyToClipboard, btoa */
    
    var nutrition = opener.nutrition;
    
    $('#trendGraph').click(function() {
        $.get('trendGraph.html', function(data) {
            var d = new Date();
            var trendGraph = window.open('', '', 'width=720,height=480');
            trendGraph.document.write(data);
            trendGraph.document.body.setAttribute('data-create', btoa(d).toString());
        }, 'text');
    });
    
    $('#clickToCopy').click(function() {
        opener.window.location.href = $('#permalink').val();
        copyToClipboard(opener.window.location.href);
        $(this).children().filter('i').attr('class', 'fas fa-check');
        setTimeout(function() {
            $('#clickToCopy').children().filter('i').attr('class', 'fas fa-paste');
        }, 2000);
    });
    
    $('#workout').on('change', function() {
        if ($(this).val() == 'No') {
            nutrition.showWorkout = false;
        } else {
            nutrition.showWorkout = true;
        }
        opener.nutrition = nutrition;
        opener.updateGUI();
    });
    
    $.ajax({
        url: 'https://api.myjson.com/bins',
        type: 'POST',
        data: JSON.stringify(nutrition),
        contentType:'application/json; charset=utf-8',
        dataType:'json',
        success: function(data, textStatus, jqXHR){
            $('#permalink').val(opener.window.location.href + '#/' + data.uri.split('bins/')[1] + '/');
            $('#permalink').removeClass('is-loading');
            $('#clickToCopy').removeClass('is-loading');
        },
        error: function(data) {
            alert('An error occured while saving your data.');
        }
    });