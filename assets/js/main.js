
    /* global $, btoa, localStorage, */

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

    function options() {
        $.get('optionsWindow.html', function(data) {
            var d = new Date();
            var optionsWindow = window.open('', '', 'width=480,height=720');
            optionsWindow.document.write(data);
            optionsWindow.document.body.setAttribute('data-create', btoa(d).toString());
        }, 'text');
    }

    function customFood(given) {
        var callback = given;
        $.get('customFood.html', function(data) {
            var d = new Date();
            var customFood = window.open('', '', 'width=480,height=720');
            customFood.document.write(data);
            customFood.document.body.setAttribute('data-create', btoa(d).toString());
            windowListener[btoa(d).toString()] = {};
            windowListener[btoa(d).toString()].callback = callback;
        }, 'text');
    }

    function customWorkout(given) {
        var callback = given;
        $.get('customWorkout.html', function(data) {
            var d = new Date();
            var customWorkout = window.open('', '', 'width=480,height=720');
            customWorkout.document.write(data);
            customWorkout.document.body.setAttribute('data-create', btoa(d).toString());
            windowListener[btoa(d).toString()] = {};
            windowListener[btoa(d).toString()].callback = callback;
        }, 'text');
    }

    function customMeal(given) {
        var callback = given;
        $.get('customMeal.html', function(data) {
            var d = new Date();
            var customFood = window.open('', '', 'width=480,height=720');
            customFood.document.write(data);
            customFood.document.body.setAttribute('data-create', btoa(d).toString());
            windowListener[btoa(d).toString()] = {};
            windowListener[btoa(d).toString()].callback = callback;
        }, 'text');
    }

    function addFood(given) {
        var time = given;
        customFood(function(data) {
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
        customWorkout(function(data) {
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
        customMeal(function(data) {
            nutrition.times[data] = [];
            addFood(data);
            updateGUI();
        });
    }

    function removeMeal(time) {
        delete nutrition.times[time];
        updateGUI();
    }

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

    function updateGUI() {
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
        $('#content').css('display', 'none');
        $('#loader').css('display', 'block');
        $('#content').html('<h2 class="title is-3 has-text-centered"><u id="date">' + nutrition.date + '</u></h2><br />');
        nutrition.final = {protein: 0, carbs: 0, fat: 0, calories: 0};
        for (var time in nutrition.times) {
            var element = $('#content').append('<div class="meal" data-time="' + time + '"><h4 class="title is-4">' + time.split(':')[0].replace('0', '') + ':' + time.split(':')[1] + '&nbsp;&nbsp;&nbsp;<a onclick="addFood(\'' + time + '\');"><i class="fas fa-plus fa-sm"></i></a></h4><div class="table-wrapper"><div class="table-scroll"><table class="table is-fullwidth has-regular-text"><thead><tr><th style="width:40%">Food</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Calories</th><th></th></tr></thead><tbody></tbody></table></div></div></div><br /><hr /><br />');
            var table = element.children().filter('div.meal[data-time="'+ time + '"]').children().filter('div.table-wrapper').children().filter('div.table-scroll').children().filter('table');
            var meal = nutrition.times[time];
            var total = {protein: 0, carbs: 0, fat: 0, calories: 0};
            for (var item in meal) {
                var data = meal[item];
                total.protein += Number(data.protein);
                total.carbs += Number(data.carbs);
                total.fat += Number(data.fat);
                total.calories += Number(data.calories);
                nutrition.final.protein += Number(data.protein);
                nutrition.final.carbs += Number(data.carbs);
                nutrition.final.fat += Number(data.fat);
                nutrition.final.calories += Number(data.calories);
                table.children().filter('tbody').append('<tr data-index="' + item.toString() + '" data-time="' + time + '"><th style="width: 40%"><abbr title="' + data.fullName + '">' + data.name + '</abbr></th><th>' + data.protein + 'g</th><th>' + data.carbs + 'g</th><th>' + data.fat + 'g</th><th>' + data.calories + 'cal</th><th><a onclick="removeFood(this)"><i class="fas fa-times"></i></a></th></tr>');
            }
            table.append('<tfoot><tr><th style="width: 40%">Total</th><th>' + total.protein + 'g</th><th>' + total.carbs + 'g</th><th>' + total.fat + 'g</th><th>' + total.calories + 'cal</th><th></th></tr></foot>');
        }
        if (nutrition.showWorkout === true) {
            console.log(nutrition);
            $('#content').append('<div id="workout"><h4 class="title is-4">Workouts&nbsp;&nbsp;&nbsp;<a onclick="addWorkout();"><i class="fas fa-plus fa-sm"></i></a></h4><div id="workout_prepend"></div><br /><hr /><br /></div>');
            if (nutrition.workout.length > 0) {
                $('#workout_prepend').prepend('<div class="table-wrapper"><div class="table-scroll"><table class="table is-fullwidth has-regular-text"><thead><tr><th style="width:40%">Description</th><th style="width:15%">Start Time</th><th style="width:15%">End Time</th><th style="width:15%"></th><th style="width:8.5%"></th><th style="width:8.5%"></th></tr></thead><tbody></tbody></table></div></div>');
                for (var exercise in nutrition.workout) {
                    console.log(exercise);
                    console.log(nutrition.workout[exercise]);
                    $('div#workout_prepend').children().filter('div.table-wrapper').children().filter('div.table-scroll').children().filter('table').children().filter('tbody').append('<tr data-index="' + exercise.toString() + '"><th style="width: 40%">' + nutrition.workout[exercise].description + '</th><th>' + nutrition.workout[exercise].start + '</th><th>' + nutrition.workout[exercise].end + '</th><th>&nbsp;</th><th>&nbsp;</th><th><a onclick="removeWorkout(this)"><i class="fas fa-times"></i></a></th></tr>');
                }
            }
        }
        if (Object.keys(nutrition.times).length > 0) {
            $('#content').append('<div id="today-stats"><h4 class="title is-4">Today\'s Stats&nbsp;&nbsp;&nbsp;<a onclick="downloadStats()"><i class="fas fa-download"></i></a></h4><div class="table-wrapper"><div class="table-scroll"><table class="table is-fullwidth has-regular-text" id="stats"><thead><tr><th style="width: 40%">Time</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Calories</th><th></th></tr></thead><tbody></tbody></table></div></div></div>');
        }
        for (var time in nutrition.times) {
            var table = $('#stats');
            var meal = nutrition.times[time];
            var total = {protein: 0, carbs: 0, fat: 0, calories: 0};
            for (var item in meal) {
                var data = meal[item];
                total.protein += Number(data.protein);
                total.carbs += Number(data.carbs);
                total.fat += Number(data.fat);
                total.calories += Number(data.calories);;
            }
            table.children().filter('tbody').append('<tr><th style="width: 40%">' + time + '</th><th>' + total.protein + 'g</th><th>' + total.carbs + 'g</th><th>' + total.fat + 'g</th><th>' + total.calories + 'cal</th><th><a onclick="removeMeal(\'' + time + '\')"><i class="fas fa-times"></i></a></th></tr>');
        }
        if (Object.keys(nutrition.times).length > 0) {
            table.append('<tfoot><tr><th>Total</th><th>' + nutrition.final.protein + 'g (' + Math.round((nutrition.final.protein * 4) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.carbs + 'g (' + Math.round((nutrition.final.carbs * 4) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.fat + 'g (' + Math.round((nutrition.final.fat * 9) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.calories + 'cal</th><th></th></tr></tfoot>');
        }
        $('#content').append('<br /><br /><div class="container has-text-centered"><button class="button is-primary is-medium" id="addMeal" onclick="addMeal()">&nbsp;&nbsp;<i class="fas fa-utensils"></i>&nbsp;&nbsp;<b>Add Meal</b>&nbsp;&nbsp;</button></div><br />');
        if (userData.length < 1) {
            userData[0] = nutrition;
        } else {
            userData[userData.length - 1] = nutrition;
        }
        localStorage.setItem('userData', JSON.stringify(userData));
        removeHash();
        $('#loader').css('display', 'none');
        $('#content').css('display', 'block');
    }

    $('#options').click(function() {
        options();
    });

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
