
    /* global $, Chart, opener, localStorage */
    
    $('#download').click(function() {
        var canvas = document.getElementById('myChart');
        var img = canvas.toDataURL('image/png');
        var encodedUri = encodeURI(img);
        var link = document.createElement('a');
        link.style.display = 'none';
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Journal Trend Graph.png');
        document.body.appendChild(link); 
        link.click();
    });
    
    function calculateTrend(data) {
        var a = 0, b = 0, b_1 = 0, b_2 = 0, c = 0, d = 0, e = 0, f = 0, g = [];
        for (var i = 0; i < data.length; i++) {
            a = a + (data[i] * (i + 1));
            b_1 = b_1 + (i + 1);
            b_2 = b_2 + (data[i]);
            c = c + ((i + 1) * (i + 1));
            d = d + (i + 1);
            g.push(null);
        }
        e = ((a * data.length) - (b_1 * b_2)) / ((c * data.length) - (d * d));
        f = (b_2 - (b_1 * e)) / data.length;
        g[0] = Math.round(f);
        g[g.length - 1] = Math.round((data.length * e) + f);
        console.log([a, b, c, d, e, f, g]);
        return g;
    }
    
    var abbr = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var protein = [], carbs = [], fat = [], dates = [];
    var userData = opener.opener.userData;
    for (var i = 0; i < userData.length; i++) {
        var nutrition = userData[i];
        dates.push(abbr[months.indexOf(nutrition.date.split(' ')[1])] + ' ' + nutrition.date.split(' ')[2]);
        protein.push(Math.round(nutrition.final.protein * 4 / nutrition.final.calories * 100));
        carbs.push(Math.round(nutrition.final.carbs * 4 / nutrition.final.calories * 100));
        fat.push(Math.round(nutrition.final.fat * 9 / nutrition.final.calories * 100));
    }
    var protein_trend = calculateTrend(protein);
    var carbs_trend = calculateTrend(carbs);
    var fat_trend = calculateTrend(fat);
    console.log([dates, protein, carbs, fat, protein_trend, carbs_trend, fat_trend]);
    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Meal Protein Content',
                data: protein,
                borderColor: ['rgba(229, 67, 52, 1)'],
                backgroundColor: ['rgba(229, 67, 52, 1)'],
                borderWidth: 2.25
            }, {
                label: 'Meal Carbohydrate Content',
                data: carbs,
                borderColor: ['rgba(51, 114, 232, 1)'],
                backgroundColor: ['rgba(51, 114, 232, 1)'],
                borderWidth: 2.25
            }, {
                label: 'Meal Fat Content',
                data: fat,
                borderColor: ['rgba(50, 232, 90, 1)'],
                backgroundColor: ['rgba(50, 232, 90, 1)'],
                borderWidth: 2.25
            }, {
                label: 'Meal Protein Content (Trend)',
                data: protein_trend,
                borderColor: ['rgba(229, 67, 52, 1)'],
                backgroundColor: ['rgba(0, 0, 0, 0)'],
                borderWidth: 2.25,
                borderDash: [17, 10],
                spanGaps: true
            }, {
                label: 'Meal Carbohydrate Content (Trend)',
                data: carbs_trend,
                borderColor: ['rgba(51, 114, 232, 1)'],
                backgroundColor: ['rgba(0, 0, 0, 0)'],
                borderWidth: 2.25,
                borderDash: [17, 10],
                spanGaps: true
            }, {
                label: 'Meal Fat Content (Trend)',
                data: fat_trend,
                borderColor: ['rgba(50, 232, 90, 1)'],
                backgroundColor: ['rgba(0, 0, 0, 0)'],
                borderWidth: 2.25,
                borderDash: [17, 10],
                spanGaps: true
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0,
                    fill: false
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    padding: 25,
                    usePointStyle: true
                }
            }
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
    } else
    if (localStorage.getItem('theme') === 'dark') {
        $('link[href="./assets/css/bulma.css"]').attr('href', './assets/css/bulma-dark.css');
        $('meta[name="theme-color"]').attr('content', '#375A7F');
        $('meta[name="msapplication-navbutton-color"]').attr('content', '#375A7F');
        $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', 'black');
    }