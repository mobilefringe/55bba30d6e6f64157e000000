function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="//kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    
    var current_year = moment().year();
    $("#current_year").text(current_year);
    
    $('#close_subscribe').click(function(e){
        $('#success_subscribe').fadeOut();
        $('#newsletter_form').trigger('reset');
    });
    // $('#newsletter_form').submit(function(e){
    //     e.preventDefault();
    //     if ($("#newsletter_agree").prop("checked") != true){
    //         alert("Please agree to receive newsletters from Midtown.");
    //         $("#newsletter_agree").focus();
    //         return false;
    //     }
    //     $.getJSON(
    //         this.action + "?callback=?",
    //         $(this).serialize(),
    //         function (data) {
    //             if (data.Status === 400) {
    //                 alert("Please try again later.");
    //             } else { // 200
    //                 $("#success_subscribe").fadeIn();
    //             }
    //         }
    //     );
    // });
    var path = window.location.pathname
    var collapse_shopping = ["/stores", "/hours", "/parking"];
    var collapse_promos = ["/promotions_and_events"];
    var collapse_style = ["/blogs", "/fashions/midtown2-shop-the-look"];
    var collapse_guest = ["/pages/midtown2-gift-cards", "/pages/midtown2-accessibility"];
    var collapse_contact = ["/jobs", "/pages/midtown2-contact-us", "/pages/midtown2-leasing"];
    
    if ($.inArray(path, collapse_shopping) >= 0){
        $('#dropdownMenu1').addClass('active_menu');
    }
    if ($.inArray(path, collapse_promos) >= 0){
        $('#promos_menu').addClass('active_menu');
    }
    if ($.inArray(path, collapse_style) >= 0){
        $('#dropdownMenu2').addClass('active_menu');
    }
    if ($.inArray(path, collapse_guest) >= 0){
        $('#dropdownMenu3').addClass('active_menu');
    }
    if ($.inArray(path, collapse_contact) >= 0){
        $('#dropdownMenu4').addClass('active_menu');
    }
    
    $('#close_blog_search').click(function(){
        $(this).hide();
        $('#blog_results').html('');
        $('#blog_search').val('');
        $('#blog_results').hide();
    });
    
    
}


function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        console.log('indiv stores')
        var cat_id = $(this).attr('data-id');
        console.log(cat_id)
        $('#show_all_stores').removeClass('active_store_nav');
        $('#cat_dd').addClass('active_store_nav');
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.hide();
        $('.store_initial').hide();
        $('#cat_name span').text($(this).text());
        $('#cat_name').css('display', 'block');
        $('#main_store_list, #store_list_container2').addClass("full_width");
        
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            
            console.log(val.getAttribute('data-cat'))
            
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
            }
        });
        $('html, body').animate({scrollTop : 0},800);
        e.preventDefault();
    });
    
    $('.show_all_stores').click(function(e){
        console.log('all stores')
        $('#show_all_stores').addClass('active_store_nav');
        $('#cat_dd').removeClass('active_store_nav');
        $('#main_store_list, #store_list_container2').removeClass("full_width");
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
    
        var rows = $('.cats_row');
        rows.show();

        $.each($('.store_initial'), function(i, val){
            if ($(val).text().trim().length > 0){
                $(val).show();
            } 
        });
        
        $('#cat_name').hide();
        e.preventDefault();
    });
    
}


function show_content(){
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
}

function pinIt() {
    var e = document.createElement('script');
    e.setAttribute('type','text/javascript');
    e.setAttribute('charset','UTF-8');
    e.setAttribute('src','https://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
    document.body.appendChild(e);
    return false;
}

function get_day(id){
    switch(id) {
        case 0:
            return ("Sunday")
            break;
        case 1:
            return ("Monday")
            break;
        case 2:
            return ("Tuesday")
            break;
        case 3:
            return ("Wednesday")
            break;
        case 4:
            return ("Thursday")
            break;
        case 5:
            return ("Friday")
            break;
        case 6:
            return ("Saturday")
            break;
    }
}


function convert_hour(d){
    
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "pm"
    } else {
        i = "am"
    }
    return h+":"+m+" "+i;
}



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function get_month (id){
    var month = ""
    switch(id) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
            
    }
    return month;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



function search_blog(keyword){
    var blogs = getBlogList();
    var all_posts = [];
    $.each(blogs, function(i, val){
        if(val.posts.length > 0){
            var b = {};
            b.name = val.name;
            b.posts = [];
            $.each(val.posts, function(k, l){
                var publish_date = new Date(l.publish_date);
                var today = new Date();
                if (publish_date <= today){
                    if(l.title.toLowerCase().indexOf(keyword) >= 0 
                    | l.body.toLowerCase().indexOf(keyword) >= 0){
                        b.posts.push(l);
                    }else{
                        $.each( l.tag, function( index2, value2 ) {
                            if(value2.toLowerCase().indexOf(keyword) >= 0){
                                b.posts.push(l);
                                return false;
                            }
                        });
                    }
                }
            });
            if(b.posts.length >0){
                all_posts.push(b);
            }
        }
    });
    return all_posts;
}


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function blog_searcher(){
    $('#blog_search').keyup(function(){
        if ($('#blog_search').val() == ""){
            $('#blog_results').html('');
            $('#blog_results').hide();
            $('#close_blog_search').hide();
        }
        else{
            $('#close_blog_search').show();
            $('#blog_results').html('');
            var val = $(this).val().toLowerCase();
            results = search_blog(val);
            $.each(results, function(i, v){
                var h2 = "<h2 id='open_"+ i +"' class='li_open'>(" +v.posts.length + ") " + v.name +"<i class='pull-right fa fa-chevron-down'></i></h2>";
                var div = "<div class='blog_search_results' id='collapse_open_"+ i  + "'>";
                $.each(v.posts, function(j,k){
                    var date_blog = new Date((k.publish_date + " 05:00:00").replace(/-/g,"/"));
                    k.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
                    div = div + "<h4><a href='/posts/" + k.slug + "'>" + k.title + "<br /><span>Published on: " + k.published_on +"</span></a></h4>";
                });
                div = div + "</div>";
                $('#blog_results').append(h2);
                $('#blog_results').append(div);
                $('#blog_results').show();
            });
            $('.li_open').click(function(){
                var collapse = "#collapse_" + $(this).attr('id');
                var collapse_js = "collapse_" + $(this).attr('id');
                if (document.getElementById(collapse_js).classList.contains("open")){
                    $(collapse).slideUp('fast');
                    $(collapse).removeClass('open');
                }
                else{
                    $(collapse).addClass('open');
                    $(collapse).slideDown('fast');
                }
            });
        }
    });
}

function load_more(num){
    var n = parseInt(num);
    for(i=n; i < n+5; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= getAllPublishedPosts().length+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function in_my_time_zone(hour, format){
    return hour.tz(getPropertyTimeZone()).format(format)
}

function submit_contest(slug) {
    var contest_entry = {};
    var contest_data = {};
    contest_data.first_name = $('#first_name').val();
    contest_data.last_name = $('#last_name').val();
    contest_data.mailing_address = $('#address').val();
    contest_data.city = $('#city').val();
    contest_data.province = $('#province').val();
    contest_data.postal_code = $('#postal_code').val();
    contest_data.phone = $('#phone').val();
    contest_data.email = $('#email').val();
    contest_data.newsletter = $('#newsletter_signup').prop("checked");
    
    contest_entry.contest = contest_data;
    
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host.replace("http:", "");
    var action = host + "/contests/" + slug + "/create_js_entry"
    $.ajax({
        url : action,
        type: "POST",
        data : contest_entry,
        success: function(data){
           $('#succes_msg').show();
           $('.contest_btn').prop('disabled', false);
           $('#contest_form').trigger('reset');
        },
        error: function (data){
            alert('An error occured while processing your request. Please try again later!')
        }
    });
}

// function floorList() {
//     var floor_list = [];
//     var floor_1 = {};
//     floor_1.id = "first-floor";
//     floor_1.title = "Level One";
//     floor_1.map =  getPNGMapURL().split("?")[0];
//     floor_1.z_index = null;
//     floor_1.show = true;
//     floor_list.push(floor_1);
//     return floor_list;
// }

function floorList() {
    var floor_list = [];
    var floor_1 = {};
    floor_1.id = "first-floor";
    floor_1.title = "Level One";
    floor_1.map =  getSVGMapURL().split("?")[0];
    // getSVGMapURL().split("?")[0];
    floor_1.z_index = 1;
    floor_1.show = true;
    floor_list.push(floor_1);
    return floor_list;
}
    
function svgList() {
    return _.map(getStoresList(), 'svgmap_region');
}
        
function dropPin(svgmap_region) {
    self = map.data('mapplic');
    self.showLocation(svgmap_region);
    $('.stores_table').hide();
}
var map = null;

function init_map(reg){
    map = $('#mapsvg_main').mapSvg({
        source: getSVGMapURL(),    // Path to SVG map
        colors: {stroke: '#aaaaaa', selected: '#f57b2b', hover: "#f57b2b"},
        disableAll: true,
        regions: reg,
        tooltipsMode: 'custom',
        loadingText: "loading...",
        zoom: true,
        zoomButtons: {'show': true,'location': 'left' },
        pan: true,
        cursor: 'pointer',
        responsive: true,
        height:2500,
        width:2500,
        zoomLimit: [0,10],
        // viewBox:[420,420,1650,1650]
    });
    // source: getSVGMapURL(),
    // colors: {stroke: '#fff', selected: "#D8836C", hover: "#a6a6a6"},
    // disableAll: true,
    // regions: regions,
    // height:1700,
    // width:2300,
    // tooltipsMode:'custom',
    // zoom:true,
    // zoomButtons: {'show': true, 'location': 'left'},
    // pan:true,
    // cursor:'pointer',
    // responsive:true,
    // zoomLimit: [0,5]
}

function drop_pin(id){
    map.marksHide();
    var coords = map.get_coords(id);
    var height = parseInt(coords["height"]);
    var width = parseInt(coords["width"]);
    var x_offset = (parseInt(width) / 2);
    var y_offset = (parseInt(height) /2);
    map.setMarks([{ xy: [coords["x"] - 46 + x_offset, coords["y"] - 110 + y_offset],
        attrs: {
            src:  '//codecloud.cdn.speedyrails.net/sites/57f66e416e6f6465fe050000/image/png/1452532624000/pin_93.png'
        }
    }]);
    map.setViewBox(id);
    
	map.selectRegion(id);
	console.log("id", id)
    $('#btnZoomIn').click()
}

