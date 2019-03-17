
    /* global $, btoa, copyToClipboard, localStorage */
    
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
    
    function downloadCSV(array, filename) {
        const rows = array;
        let csvContent = "data:text/csv;charset=utf-8," + rows.map(e=>e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.style.display = "none";
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename + ".csv");
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
            csv.push(['Description', 'Start Time', 'End Time']);
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
        $('#content').css('display', 'none');
        $('#loader').css('display', 'block');
        $('#content').html('<h2 class="title is-3 has-text-centered"><u id="date">' + nutrition.date + '</u></h2><br />');
        nutrition.final = {protein: 0, carbs: 0, fat: 0, calories: 0};
        for (var time in nutrition.times) {
            var element = $('#content').append('<div class="meal" data-time="' + time + '"><h4 class="title is-4">' + time + '&nbsp;&nbsp;&nbsp;<a onclick="addFood(\'' + time + '\');"><i class="fas fa-plus fa-sm"></i></a></h4><table class="table is-fullwidth has-regular-text"><thead><tr><th style="width:40%">Food</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Calories</th><th></th></tr></thead><tbody></tbody></table></div>');
            var table = $(element).children().filter('div.meal[data-time="'+ time + '"]').children().filter('table');
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
        if (nutrition.workout.length > 0) {
            var element = $('#content').append('<br /><hr /><br /><div id="workout"><h4 class="title is-4">Workouts</h4><table class="table is-fullwidth has-regular-text"><thead><tr><th style="width:40%">Description</th><th style="width:15%">Start Time</th><th style="width:15%">End Time</th><th style="width:15%"></th><th style="width:8.5%"></th><th style="width:8.5%"></th></tr></thead><tbody></tbody></table></div>');
        }
        for (var exercise in nutrition.workout) {
            var table = $(element).children().filter('div#workout').children().filter('table');
            table.children().filter('tbody').append('<tr data-index="' + exercise.toString() + '"><th style="width: 40%">' + nutrition.workout[exercise].description + '</th><th>' + nutrition.workout[exercise].start + '</th><th>' + nutrition.workout[exercise].end + '</th><th>&nbsp;</th><th>&nbsp;</th><th><a onclick="removeWorkout(this)"><i class="fas fa-times"></i></a></th></tr>');
        }
        if (Object.keys(nutrition.times).length > 0) {
            $('#content').append('<br /><hr /><br /><div id="stats"><h4 class="title is-4">Today\'s Stats</h4><table class="table is-fullwidth has-regular-text"><thead><tr><th style="width: 40%">Time of Meal</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Calories</th><th></th></tr></thead><tbody></tbody></table></div>');
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
            table.children().filter('table').children().filter('tbody').append('<tr><th style="width: 40%">' + time + '</th><th>' + total.protein + 'g</th><th>' + total.carbs + 'g</th><th>' + total.fat + 'g</th><th>' + total.calories + 'cal</th><th></th></tr>');
        }
        if (Object.keys(nutrition.times).length > 0) {
            table.children().filter('table').append('<tfoot><tr><th>Total</th><th>' + nutrition.final.protein + 'g (' + Math.round((nutrition.final.protein * 4) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.carbs + 'g (' + Math.round((nutrition.final.carbs * 4) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.fat + 'g (' + Math.round((nutrition.final.fat * 9) / nutrition.final.calories * 100) + '%)</th><th>' + nutrition.final.calories + 'cal</th><th><a onclick="downloadStats()"><i class="fas fa-download"></i></a></th></tr></tfoot>');
        }
        $('#content').append('<br /><br /><div class="container has-text-centered"><button class="button is-primary is-medium" id="addMeal" onclick="addMeal()"><i class="fas fa-utensils"></i>&nbsp;&nbsp;<b>Add Meal</b></button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="button is-primary is-medium" id="addWorkout" onclick="addWorkout()"><i class="fas fa-dumbbell"></i>&nbsp;&nbsp;<b>Add Workout</b></button></div><br />');
        localStorage.setItem('nutrition', JSON.stringify(nutrition));
        $('#loader').css('display', 'none');
        $('#content').css('display', 'block');
    }
    
    $('#share').click(function() {
        $.ajax({
            url: 'https://api.myjson.com/bins',
            type: 'POST',
            data: JSON.stringify(nutrition),
            contentType:'application/json; charset=utf-8',
            dataType:'json',
            success: function(data, textStatus, jqXHR){
                window.location.href = '#/' + data.uri.split('bins/')[1] + '/';
                copyToClipboard(window.location.href);
                document.title = 'edit page · journal';
                alert('Permalink copied to clipboard.');
            },
            error: function(data) {
                alert('An error occured while saving your data.');
            }
        });
    });
    
    var windowListener = {};
    var nutrition;
    if (window.location.hash) {
        if (window.location.hash.search('/') !== -1) {
            $('#loader').css('display', 'block');
            $.getJSON('https://api.myjson.com/bins/' + window.location.hash.split('/')[1], function(data) {
                nutrition = data;
                updateGUI();
            });
            $('#loader').css('display', 'none');
        } else {
            alert('Error.');
            window.location.href = window.location.href.split('#')[0];
        }
    } else {
        if (localStorage.getItem('nutrition') === null) {
            nutrition = {date: '', times: {}, workout: []};
        } else {
            nutrition = JSON.parse(localStorage.getItem('nutrition'));
        }
        var d = new Date();
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var date = weekdays[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate().toString();
        var a = new Date(date);
        var b = new Date(nutrition.date);
        if (Number(a) !== Number(b)) {
            nutrition = {date: date, times: {}, workout: []};
        }
        updateGUI();
    }
    