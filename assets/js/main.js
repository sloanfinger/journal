
    /* global $, btoa, localStorage, updateGUI */

    function removeHash() {
        var scrollV, scrollH, loc = window.location;
        if ('pushState' in window.history)
            window.history.pushState('', document.title, loc.pathname + loc.search);
        else {
            scrollV = document.body.scrollTop;
            scrollH = document.body.scrollLeft;
            loc.hash = '';
            document.body.scrollTop = scrollV;
            document.body.scrollLeft = scrollH;
        }
    }

    function openWindow(name, given) {
        var callback = function(data) {
            if (data !== false) {
                given(data);
            }
            $('#window').css('display', 'none');
            $('#loader').css('display', 'block');
            $('#addMeal').html('<b style="font-size: 1.2em"><i class="fas fa-utensils"></i>&nbsp;&nbsp;&nbsp;Add Meal</b>');
            $('#addMeal').attr('onclick', 'addMeal()');
            $('#window').html('');
            $('#window').removeAttr('data-create');
            $('#loader').css('display', 'none');
            $('#content').css('display', 'block');
        };
        $('#content').css('display', 'none');
        $('#loader').css('display', 'block');
        $.get(name + '.html', function(data) {
            var d = new Date();
            var $window = $('#window');
            $window.append(data);
            $window.attr('data-create', btoa(d).toString());
            $('#addMeal').attr('onclick', 'windowListener[$("#window").attr("data-create")].callback(false)');
            $('#addMeal').html('<b style="font-size: 1.2em"><i class="fas fa-times"></i>&nbsp;&nbsp;&nbsp;Exit Window</b>');
            $('#loader').css('display', 'none');
            $('#window').css('display', 'block');
            windowListener[btoa(d).toString()] = {};
            windowListener[btoa(d).toString()].callback = callback;
        }, 'text');
    }
    
    function addFood(given) {
        var time = given;
        openWindow('customFood', function(data) {
            nutrition.times[time].push(data);
            updateGUI();
        });
    }

    function removeFood(given) {
        var $parent = $(given).parent();
        var element = $parent.parent();
        if (nutrition.times[element.data('time')].length === 1) {
            delete nutrition.times[element.data('time')];
        } else {
            nutrition.times[element.data('time')].splice(element.data('index'), 1);
        }
        updateGUI();
    }

    function addWorkout() {
        openWindow('customWorkout', function(data) {
            nutrition.workout.push(data);
            updateGUI();
        });
    }

    function removeWorkout(given) {
        var $parent = $(given).parent();
        var element = $parent.parent();
        nutrition.workout.splice(element.data('index'), 1);
        updateGUI();
    }

    function addMeal() {
        openWindow('customMeal', function(data) {
            nutrition.times[data] = [];
            updateGUI();
        });
    }

    function removeMeal(time) {
        delete nutrition.times[time];
        updateGUI();
    }
    
    $('#options').click(function() {
        openWindow('optionsWindow', function(){});
    });
    
    function downloadCSV(array, filename) {
        const rows = array;
        let csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e=>e.join(',')).join('\n');
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.style.display = 'none';
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename + '.csv');
        document.body.appendChild(link);
        link.click();
    }

    function downloadStats() {
        var csv = [];
        for (var time in nutrition.times) {
            csv.push([time]);
            csv.push(['Food', 'Protein', 'Carbs', 'Fat', 'Calories']);
            var total = {protein: 0, carbs: 0, fat: 0, calories: 0};
            for (var item in nutrition.times[time]) {
                var data = nutrition.times[time][item];
                total.protein += Number(data.protein);
                total.carbs += Number(data.carbs);
                total.fat += Number(data.fat);
                total.calories += Number(data.calories);
                csv.push(['"' + data.fullName + '"', data.protein + 'g', data.carbs + 'g', data.fat + 'cal', data.calories + 'cal']);
            }
            csv.push(['Total', data.protein + 'g', data.carbs + 'g', data.fat + 'cal', data.calories + 'cal']);
            csv.push([]);
        }
        if (nutrition.workout.length > 0) {
            csv.push(['Workouts']);
            csv.push(['Description', 'Start', 'End']);
            for (var exercise in nutrition.workout) {
                var data = nutrition.workout[exercise];
                csv.push([data.description, data.start, data.end]);
            }
            csv.push([]);
        }
        csv.push(['Today\'s Stats']);
        for (var time in nutrition.times) {
            var total = {protein: 0, carbs: 0, fat: 0, calories: 0};
            for (var item in nutrition.times[time]) {
                var data = nutrition.times[time][item];
                total.protein += Number(data.protein);
                total.carbs += Number(data.carbs);
                total.fat += Number(data.fat);
                total.calories += Number(data.calories);
            }
            csv.push([time, data.protein + 'g', data.carbs + 'g', data.fat + 'cal', data.calories + 'cal']);
        }
        csv.push(['Total',  nutrition.final.protein + 'g (' + Math.round((nutrition.final.protein * 4) / nutrition.final.calories * 100) + '%)',  nutrition.final.carbs + 'g (' + Math.round((nutrition.final.carbs * 4) / nutrition.final.calories * 100) + '%)',  nutrition.final.fat + 'g (' + Math.round((nutrition.final.fat * 9) / nutrition.final.calories * 100) + '%)', data.calories + 'cal']);
        downloadCSV(csv, nutrition.date);
    }
    
    var windowListener = {};
    var userData = [];
    var nutrition;
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
    if (window.location.hash) {
        if (window.location.hash.search('/') !== -1) {
            $('#loader').css('display', 'block');
            $.getJSON('https://api.myjson.com/bins/' + window.location.hash.split('/')[1], function(data) {
                userData[0] = data;
                nutrition = userData[0];
                updateGUI();
            });
            $('#loader').css('display', 'none');
        } else {
            alert('Error.');
            window.location.href = window.location.href.split('#')[0];
        }
    } else {
        if (localStorage.getItem('userData') === null) {
            nutrition = {date: '', times: {}, workout: [], showWorkout: false};
        } else
        if (localStorage.getItem('userData') === '') {
            nutrition = {date: '', times: {}, workout: [], showWorkout: false};
        } else
        if (JSON.parse(localStorage.getItem('userData')).length === 0) {
            userData = [{date: date, times: {}, workout: [], showWorkout: false}];
            nutrition = userData[0];
        } else
        if (JSON.parse(localStorage.getItem('userData')).length === 30) {
            userData.splice(-1 * (userData.length - 1));
            userData[29] = {date: date, times: {}, workout: [], showWorkout: false};
            nutrition = userData[29];
        } else {
            userData = JSON.parse(localStorage.getItem('userData'));
            nutrition = userData[userData.length - 1];
        }
        var d = new Date();
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var date = weekdays[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate().toString();
        var a = new Date(date);
        var b = new Date(nutrition.date);
        if (Number(a) > Number(b) || nutrition.date === '') {
            userData[userData.length] = {date: date, times: {}, workout: [], showWorkout: false};
            nutrition = userData[userData.length - 1];
        }
        updateGUI();
    }
