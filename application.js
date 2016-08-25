/*Created 2015-07-31  by Rajbir Karan Singh*/

function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
       if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
       }
       if (start <= today){
         if (val.end_date){
             end = new Date (val.end_date);
             end.setDate(end.getDate() + 1);
             if (end >= today){
               item_list.push(val);  
             }
             
         } else {
             item_list.push(val);
         }
       }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
       
    });
    $(home_banner).html(item_rendered.join(''));
    
}

function renderStoreList(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                val.alt_store_front_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
            
        }
        //var categories = getStoreCategories();
        var current_initial = val.name[0];
        var category = getCategoryDetails(val.categories[0]);
        if (category != undefined){
            val.categories_list = category.name
        }
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        }
        else{
            val.initial = current_initial;
            store_initial = current_initial;
            if (val.initial == "A"){
                val.show = "display:inline-block;margin-top:24px";
            }
            else{
                val.show = "display:inline-block;";
            }
        }
        if (val.promotions.length > 0){
            val.promotion_exist = "visibility:show";
        }
        else{
            val.promotion_exist = "visibility:hidden";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        val.category_list = getCategoriesNamesByStoreSlug(slug);
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        val.property_map = getPropertyDetails().mm_host + getPropertyDetails().map_url;
        // renderStoreExtras($('#jobs_container'), $('#jobs_template'), "jobs", val.jobs);
        if (val.website != null && val.website.length > 0){
            val.show = "display:inline-block";
        }
        else{
            val.show = "display:none";
        }
        if(val.description.length > 0){
            val.desc_pad = "padding_10";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    
    $(container).html(item_rendered.join(''));
    $(".modal-backdrop").remove();
}

function renderStoreExtras(container, template, type, ids){
    if (ids.length > 0 && type == "promos") {
        $('#promotion_extra').show();
    }
    if (ids.length > 0 && type == "jobs") {
        $('#employment_extra').show();
    }
    if (type == "promos"){
        var collection = getPromotionsForIds(ids);
    }
    else if (type =="jobs"){
        var collection = getJobsForIds(ids)
    }
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        //specifying the timezone so date wont go back 1.day
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        val.closing_date = get_month(end.getMonth()) + " " + end.getDate() + ", " + end.getFullYear();
        if (val.contact_name == ""){
            val.contact_name = "N/A" ;               
        }
        if (val.contact_email == ""){
            val.contact_email = "N/A";              
        }
        if(val.contact_email == "N/A" && val.contact_name == "N/A"){
            val.hide_contact = "display:none";
        }
        
        if (val.promo_image_url_abs != undefined){
            val.image_url = val.promo_image_url_abs;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    }) ;
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                case 0:
                    val.day = "Sunday";
                    break;
                case 1:
                    val.day = "Monday";
                    break;
                case 2:
                    val.day = "Tuesday";
                    break;
                case 3:
                    val.day = "Wednesday";
                    break;
                case 4:
                    val.day = "Thursday";
                    break;
                case 5:
                    val.day = "Friday";
                    break;
                case 6:
                    val.day = "Saturday";
                    break;
                
            }
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = new Date (val.open_time);
                var close_time = new Date (val.close_time);
                val.open_time = convert_hour(open_time);
                val.close_time = convert_hour(close_time);    
                val.h = val.open_time+ " - " + val.close_time;
            } else {
                "Closed";
            }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = new Date (val.holiday_date + "T06:00:00Z");
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = get_month(holiday.getMonth()) + " " +holiday.getDate();
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = new Date (val.open_time);
                    var close_time = new Date (val.close_time);
                    val.open_time = convert_hour(open_time);
                    val.close_time = convert_hour(close_time);    
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = val.open_time+ " - " + val.close_time;
                } else {
                    val.h = "Closed";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
};

function renderGeneral(container, template, collection, type){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if (type == "promos"){
            if ((val.promo_image_url_abs).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                        val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                        val.store_image = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                    } else {
                        val.alt_promo_image_url = (store_details.store_front_url_abs); 
                        val.store_image = store_details.store_front_url_abs;
                    }
                    
                    val.store_name = store_details.name;
                } else {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                }
                
            } else {
                val.alt_promo_image_url = (val.promo_image_url_abs);
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug;
                    val.store_name = store_details.name;
                    val.store_image = store_details.store_front_url_abs;
                }
        
            }
            
            
            start = new Date (val.start_date);
            end = new Date (val.end_date);
        
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
            
        }
        if(type == "jobs"){
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.jobable_type == "Store") {
                var store_details = getStoreDetailsByID(val.jobable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs);    
                }
                val.store_name = store_details.name;
                val.store_slug = store_details.slug;
            }
            else{
                val.store_name = "Midtown Plaza";
            }
            start = new Date (val.start_date );
            end = new Date (val.end_date);
            val.closing_date = get_month(end.getMonth()) + " " + end.getDate() + ", " + end.getFullYear();
            if (val.contact_name == ""){
                val.contact_name = "N/A" ;               
            }
            if (val.contact_email == ""){
                val.contact_email = "N/A";              
            }
            if(val.contact_email == "N/A" && val.contact_name == "N/A"){
                val.hide_contact = "display:none";
            }
        }
        if(type=="events"){
            start = new Date (val.start_date);
            end = new Date (val.end_date);
            if (start.toDateString() == end.toDateString()) {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
            } else {
                val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
            }
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderPromosEvents(container, template, collection){
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future use
    $.each( collection , function( key, val ) {
        if (val.type=="promotions"){
            val.image_url = val.promo_image_url_abs;
            if ((val.promo_image_url).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                    if(store_details.store_front_url.indexOf('missing.png') > -1){
                        val.image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                    }
                    else{
                        val.image_url = getImageURL(store_details.store_front_url);
                    }
                    
                } else {
                    val.image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                }
                
            } else {
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                    
                }
                val.image_url = getImageURL(val.promo_image_url);
            }
        }
        if (val.type=="events"){
            val.image_url = val.event_image_url_abs;
            if ((val.event_image_url).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.image_url = getImageURL(store_details.store_front_url);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                    
                } else {
                    val.image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                }
                
            } else {
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                    
                }
                val.image_url = getImageURL(val.event_image_url);
                val.store_name = "Midtown Plaza";
                
            }
        }
        if(val.description.length > 50){
            val.description_short = val.description.substring(0,50) + "...";
        }
        else{
            val.description_short = val.description;
        }
        
        
        
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function renderPromoDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        console.log(val)
        if ((val.promo_image_url).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                val.url=store_details.slug;
                if(store_details.store_front_url.indexOf('missing.png') > -1){
                    val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
                }
                else{
                    val.alt_promo_image_url = getImageURL(store_details.store_front_url);
                }
                
            } else {
                val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
            }
            
        } else {
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                val.url=store_details.slug;
                
            }
            val.alt_promo_image_url = getImageURL(val.promo_image_url);
        }
        if (val.store_name == undefined){
            val.store_name = "Midtown Plaza";
        }
        
        if(val.url == "" || val.url === null || val.url === undefined){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        //specifying the timezone so date wont go back 1.day
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.event_image_url).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.alt_promo_image_url = getImageURL(store_details.store_front_url);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                
            } else {
                val.alt_promo_image_url = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
            }
            
        } else {
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                
            }
            val.alt_promo_image_url = getImageURL(val.event_image_url);
            val.store_name = "Midtown Plaza";
            
        }
        //specifying the timezone so date wont go back 1.day
        start = new Date (val.start_date);
        end = new Date (val.end_date);
        
        if (start.toDateString() == end.toDateString()) {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        } else {
            val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        }
        
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderFashion(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    item_list.push(collection);
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( item_list , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderFashionImages(container, template, collection){
    counter = 1;
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        val.image_url = getPropertyDetails().mm_host + val.photo_url;
        if( counter % 3 === 0){
            val.cc= "style=clear:both";
        }
        else{
            val.cc="";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter+=1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 200){
            val.description_short = val.body.substring(0,200) + "...";
        }
        else{
            val.description_short = val.body;
        }
        if(val.body.length > 50){
            val.description_shorter = val.body.substring(0,50) + "...";
        }
        else{
            val.description_shorter = val.body;
        }
        val.counter = counter;
        var date_blog = new Date(val.publish_date);
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        if (val.tag != undefined){
            val.tag_list = val.tag.join(', ');
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}
function renderFashion(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        val.image_url = "http://cdn.mallmaverick.com" + val.fashion_images[0].photo_url;
        if(val.description.length > 50){
            val.description_short = val.description.substring(0,50) + "...";
        }
        else{
            val.description_short = val.description;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/55bba30d6e6f64157e000000/eed38d089cd6373b1b6fe6579119ae92/46998083431386.Gxbjj42J5GPwa7QBEyyM_height640.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        var date_blog = new Date(val.publish_date);
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        var next_p = getNextPublishedPostBySlug(val.slug);
        var prev_p = getPrevPublishedPostBySlug(val.slug);
        if (next_p == undefined){
            val.next_post_show = "display:none";
        }
        else{
            val.next_post = next_p.title;
            val.next_slug = next_p.slug;
            val.next_post_show = "display:inline-block";
        }
        if (prev_p == undefined){
            val.prev_post_show = "display:none";
        }
        else{
            val.prev_post = prev_p.title;
            val.prev_slug = prev_p.slug;
            val.prev_post_show = "display:inline-block";
        }
        
        if (val.tag != undefined){
            val.tag_list = val.tag.join(', ');
        }
        if(val.author.length > 0){
            val.author = "By " + val.author;
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

function init_side(){
    var posts = getAllPublishedPosts();
    var published_posts = posts.sortBy(function(o){ return new Date(o.publish_date) }).reverse()[0];
    var list = [];
    list.push(published_posts);
    if(published_posts !=undefined){
        renderPosts("#home_blog_container", "#home_blog_template", list);
    }
    
    var today_hours = getTodaysHours();
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours)
}

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        val.day = get_day(val.day_of_week);
        var d = moment().tz(getPropertyTimeZone());
        val.month = get_month(d.getMonth());
        val.weekday = addZero(d.getDate());
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = in_my_time_zone(moment(val.open_time), "h:mma");
            var close_time = in_my_time_zone(moment(val.close_time), "h:mma");
            val.h = open_time + " - " + close_time;
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}


function renderBlogs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if(val.posts.length > 0){
            var rendered = Mustache.render(template_html,val);
        }
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}






