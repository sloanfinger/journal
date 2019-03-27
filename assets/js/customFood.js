
    /* global $, opener, localStorage */
    
    var nutritionData;
    
    function check(number) {
        if (isNaN(number)) {
            return 0;
        } else {
            return number;
        }
    }
    
    function selectNDBNO(ndbno) {
        $.getJSON('https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=w4yRdn0HhrHoZJFtsV648gwSA0cCytx9S6uxTzFp&nutrients=203&nutrients=204&nutrients=205&ndbno=' + ndbno, function(response) {
            console.log(response);
            var data = response.report.foods[0];
            console.log(data);
            nutritionData = data;
            $('#serving').val(data.measure);
            $('#section2').css('display', 'none');
            $('#section3').css('display', 'block');
        }); 
    }
    
    $('.scan_upc').click(function() {
        
    });
    
    $('#go').click(function() {
        $(this).addClass('is-loading');
        $.getJSON('https://api.nal.usda.gov/ndb/search/?format=json&q=' + encodeURIComponent($('#search').val()) + '&sort=' + $('#sort').children('option').filter(':selected').attr('val') + '&max=' +  $('#results').val() + '&offset=0&ds=' +  $('#type').children('option').filter(':selected').attr('val') + '&api_key=w4yRdn0HhrHoZJFtsV648gwSA0cCytx9S6uxTzFp', function(response) {
            console.log(response);
            if (response.errors) {
                alert('Your search yielded no results.');
                $('#go').removeClass('is-loading');
            } else {
                var data = response.list.item;
                for (var i = 0; i < data.length; i++) {
                    var given = data[i].name;
                    var name = [];
                    var words = given.split(', UPC: ')[0].split(' ');
                    for (var j = 0; j < words.length; j++) {
                        console.log(words[j]);
                        name.push(words[j][0].toUpperCase() + words[j].substr(1).toLowerCase());
                    }
                    $('#select').append('<tr style="cursor: pointer"><th onclick="selectNDBNO(\'' + data[i].ndbno + '\')">' + name.join(' ') + '</th></tr>');
                }
                $('#section1').css('display', 'none');
                $('#section2').css('display', 'block');
            }
        });
    });
    
    $('#go2').click(function() {
        var name = [];
        var name2 = [];
        var words = nutritionData.name.split(',')[0].split(' ');
        var words2 = nutritionData.name.split(', UPC: ')[0].split(' ');
        for (var i = 0; i < words.length; i++) {
            name.push(words[i][0].toUpperCase() + words[i].substr(1).toLowerCase());
        }
        for (var j = 0; j < words.length; j++) {
            name2.push(words[j][0].toUpperCase() + words2[j].substr(1).toLowerCase());
        }
        if (nutritionData.nutrients.length < 3) {
            alert('Nutrition data unavaliable.');
            window.close();
        } else {
            var data = {
                name: name.join(' '),
                fullName: name2.join(' '),
                protein: check(Math.round(Number(nutritionData.nutrients[0].value) * Number($('#eaten').val()))).toString(),
                carbs: check(Math.round(Number(nutritionData.nutrients[2].value) * Number($('#eaten').val()))).toString(),
                fat: check(Math.round(Number(nutritionData.nutrients[1].value) * Number($('#eaten').val()))).toString(),
                calories: (check(Math.round(Number(nutritionData.nutrients[0].value) * Number($('#eaten').val()))) * 4 + check(Math.round(Number(nutritionData.nutrients[2].value) * Number($('#eaten').val()))) * 4 + check(Math.round(Number(nutritionData.nutrients[1].value) * Number($('#eaten').val()))) * 9).toString(),
                serving: nutritionData.measure,
                eaten: $('#eaten').val().toString()
            };
            opener.windowListener[document.body.getAttribute('data-create')].callback(data);
            window.close();
        }
    });
    
    $('#go3').click(function() {
        var name = [];
        var name2 = [];
        var words = $('#name').val().split(',')[0].split(' ');
        var words2 = $('#name').val().split(' ');
        for (var i = 0; i < words.length; i++) {
            name.push(words[i][0].toUpperCase() + words[i].substr(1).toLowerCase());
        }
        for (var j = 0; j < words2.length; j++) {
            name2.push(words2[j][0].toUpperCase() + words2[j].substr(1).toLowerCase());
        }
        var nutrition = {
            name: name.join(' '),
            fullName: name2.join(' '),
            protein: check(Math.round(Number($('#protein').val()) * Number($('#eaten2').val()))).toString(),
            carbs: check(Math.round(Number($('#carbs').val()) * Number($('#eaten2').val()))).toString(),
            fat: check(Math.round(Number($('#fat').val()) * Number($('#eaten2').val()))).toString(),
            calories: (check(Math.round(Number($('#protein').val()) * Number($('#eaten2').val()))) * 4 + check(Math.round(Number($('#carbs').val()) * Number($('#eaten2').val()))) * 4 + check(Math.round(Number($('#fat').val()) * Number($('#eaten2').val()))) * 9).toString(),
            serving: $('#serving2').val(),
            eaten: $('#eaten2').val().toString()
        };
        opener.windowListener[document.body.getAttribute('data-create')].callback(nutrition);
        window.close();
    });
    
    $('#return').click(function() {
        $(this).addClass('is-loading');
        $('#go').removeClass('is-loading');
        $('#section2').css('display', 'none');
        $('#section1').css('display', 'block');
        $(this).removeClass('is-loading');
        $('#select').html('');
    });
    
    $('#custom').click(function() {
       $('#section1').css('display', 'none');
       $('#section4').css('display', 'block');
    });
    
    $('#nutrition').click(function() {
       $('#section4').css('display', 'none');
       $('#section1').css('display', 'block');
    });
    

    if (localStorage.getItem('theme') === null) {
        localStorage.setItem('theme', 'light');
    } else
    if (localStorage.getItem('theme') === 'light') {
        $('link[href="./assets/css/bulma-dark.css"]').attr('href', './assets/css/bulma.css');
        $('meta[name="theme-color"]').attr('content', '#34495E');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#34495E');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black-translucent');
    } else
    if (localStorage.getItem('theme') === 'dark') {
        $('link[href="./assets/css/bulma.css"]').attr('href', './assets/css/bulma-dark.css');
        $('meta[name="theme-color"]').attr('content', '#375A7F');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#375A7F');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black');
    }