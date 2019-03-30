    
    /* global $, localStorage, nutrition, userData */
    
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
        $('#content').html('<h2 class="title is-2"><b><u id="date">' + nutrition.date + '</u></b></h2><br />');
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
        if (userData.length < 1) {
            userData[0] = nutrition;
        } else {
            userData[userData.length - 1] = nutrition;
        }
        $('#content').append('<br /><br /><br /<br />')
        localStorage.setItem('userData', JSON.stringify(userData));
        removeHash();
        $('#loader').css('display', 'none');
        $('#content').css('display', 'block');
    }