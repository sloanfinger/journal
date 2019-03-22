    
    /* global $, opener, copyToClipboard, btoa, localStorage */
    
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
    
    $('#theme').on('change', function() {
        opener.localStorage.setItem('theme', $(this).val().toLowerCase());
        if (localStorage.getItem('theme') === null) {
            localStorage.setItem('theme', 'light');
        } else
        if (localStorage.getItem('theme') === 'light') {
            $('link[href="./assets/css/bulma-dark.css"]').attr('href', './assets/css/bulma.css');
            $('meta[name="theme-color"]').attr('content', '#34495E');
            $('meta[name="msapplication-navbutton-color"]').attr('content', '#34495E');
            $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black-translucent');
            $('#theme').children().filter('option[val="Light"]').attr('selected', 'selected');
        } else
        if (localStorage.getItem('theme') === 'dark') {
            $('link[href="./assets/css/bulma.css"]').attr('href', './assets/css/bulma-dark.css');
            $('meta[name="theme-color"]').attr('content', '#375A7F');
            $('meta[name="msapplication-navbutton-color"]').attr('content', '#375A7F');
            $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black');
            $('#theme').children().filter('option[val="Dark"]').attr('selected', 'selected');
        }
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
    
    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', 'light');
    } else
    if (localStorage.getItem('theme') === 'light') {
        $('link[href="./assets/css/bulma-dark.css"]').attr('href', './assets/css/bulma.css');
        $('meta[name="theme-color"]').attr('content', '#34495E');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#34495E');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black-translucent');
        $('#theme').children().filter('option[val="Light"]').attr('selected', 'selected');
    } else
    if (localStorage.getItem('theme') === 'dark') {
        $('link[href="./assets/css/bulma.css"]').attr('href', './assets/css/bulma-dark.css');
        $('meta[name="theme-color"]').attr('content', '#375A7F');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#375A7F');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black');
        $('#theme').children().filter('option[val="Dark"]').attr('selected', 'selected');
    }
    
    if (localStorage.getItem('userData')) {
        if (!JSON.parse(localStorage.getItem('userData'))[JSON.parse(localStorage.getItem('userData')).length - 1].showWorkout) {
            $('#workout').children().filter('option[val="No"]').attr('selected', 'selected');
        } else {
            $('#workout').children().filter('option[val="Yes"]').attr('selected', 'selected');
        }
    }