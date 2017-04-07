function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="//kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    $('#close_subscribe').click(function(e){
        $('#success_subscribe').fadeOut();
        $('#newsletter_form').trigger('reset');
    });
    $('#newsletter_form').submit(function(e){
        e.preventDefault();
        if ($("#newsletter_agree").prop("checked") != true){
            alert("Please agree to receive newsletters from Midtown Plaza.");
            $("#newsletter_agree").focus();
            return false;
        }
        $.getJSON(
            this.action + "?callback=?",
            $(this).serialize(),
            function (data) {
                if (data.Status === 400) {
                    alert("Please try again later.");
                } else { // 200
                    $("#success_subscribe").fadeIn();
                }
            }
        );
    });
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

function show_content(){
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
}

function pinIt(){
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
    contest_data.address = $('#address').val();
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


