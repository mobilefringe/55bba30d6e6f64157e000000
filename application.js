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

function renderContest(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses

    collection.alt_photo_url = getImageURL(collection.photo_url);
    collection.property_name = getPropertyDetails().name;
    var rendered = Mustache.render(template_html,collection);
    item_rendered.push(rendered);
    
    $(container).show();
    $(container).html(item_rendered.join(''));
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
                val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
        }
        //var categories = getStoreCategories();
        var current_initial = val.name[0];
        if(val.categories != null){
            var category = getCategoryDetails(val.categories[0]);
        }
        if (category != undefined){
            val.categories_list = category.name
        }
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial;
            store_initial = current_initial;
            if (val.initial == "A"){
                val.show = "display:inline-block;margin-left:10px;";
            } else {
                val.show = "display:inline-block;";
            }
        }
        if (val.promotions != null){
            val.promotion_exist = "visibility:show";
        } else {
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
            val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
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
        } else {
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
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMMM D, YYYY")
        }
        else{
            val.dates = start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY");
        }
        
        val.closing_date = end.format("MMMM D, YYYY");
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
        var today = moment();
        var webDate = moment(val.show_on_web_date);
        if (today.tz(getPropertyTimeZone()) >= webDate.tz(getPropertyTimeZone())) {
            var rendered = Mustache.render(template_html,val);
        }
        
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
                    var open_time = in_my_time_zone(moment(val.open_time), "h:mm a");
                    var close_time = in_my_time_zone(moment(val.close_time), "h:mm a");
                    val.h = open_time + " - " + close_time;
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
                holiday = moment(val.holiday_date);
                val.formatted_date = in_my_time_zone(holiday, "MMMM D");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = in_my_time_zone(moment(val.open_time), "h:mm a");
                    var close_time = in_my_time_zone(moment(val.close_time), "h:mm a");
                    val.h = open_time + " - " + close_time;   
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
                        val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
                        val.store_image = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
                    } else {
                        val.alt_promo_image_url = (store_details.store_front_url_abs); 
                        val.store_image = store_details.store_front_url_abs;
                    }
                    
                    val.store_name = store_details.name;
                } else {
                    val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
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
    
            var start = moment(val.start_date).tz(getPropertyTimeZone());
            var end = moment(val.end_date).tz(getPropertyTimeZone());
            if (start.format("DMY") == end.format("DMY")){
                val.dates = start.format("MMMM D")
            } else {
                val.dates = start.format("MMMM D") + " - " + end.format("MMMM D")
            }
        }
        if(type == "jobs"){
            val.alt_promo_image_url = (val.promo_image_url_abs);
            if (val.jobable_type == "Store") {
                var store_details = getStoreDetailsByID(val.jobable_id);
                if ((store_details.store_front_url_abs).indexOf('missing.png') > -1) {
                    val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
                } else {
                    val.alt_promo_image_url = (store_details.store_front_url_abs);    
                }
                val.store_name = store_details.name;
                val.store_slug = store_details.slug;
            } else {
                val.store_name = "Midtown Plaza";
            }
            var start = moment(val.start_date).tz(getPropertyTimeZone());
            var end = moment(val.end_date).tz(getPropertyTimeZone());
            val.closing_date = end.format("MMMM D, YYYY")
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
            var start = moment(val.start_date).tz(getPropertyTimeZone());
            var end = moment(val.end_date).tz(getPropertyTimeZone());
            if (start.format("DMY") == end.format("DMY")){
                val.dates = start.format("MMMM D")
            } else {
                val.dates = start.format("MMMM D") + " - " + end.format("MMMM D")
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
            if((val.promo_image_url).indexOf('missing.png') > -1){
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                    
                    if(val.promo_image_url_abs == null || val.promo_image_url_abs.indexOf('missing.png') > -1){
                        if(store_details.store_front_url.indexOf('missing.png') > -1){
                            val.image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
                        } else {
                            val.image_url = getImageURL(store_details.store_front_url);
                        }
                    }
                }
            } else {
                if (val.promotionable_type == "Store") {
                    var store_details = getStoreDetailsByID(val.promotionable_id);
                    val.store_detail_btn = store_details.slug ;
                    val.store_name = store_details.name;
                }
                val.image_url = getCloudinaryImageUrl(val.promo_image_url);
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
                    val.image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
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
        } else {
            val.description_short = val.description;
        }
    
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMMM D")
        } else {
            val.dates = start.format("MMMM D") + " - " + end.format("MMMM D")
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
        if ((val.promo_image_url).indexOf('missing.png') > -1){
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                val.url=store_details.slug;
                val.alt_promo_image_url = val.promo_image_url_abs;
                if(val.promo_image_url_abs == null || val.promo_image_url_abs.indexOf('missing.png') > -1){
                    if(store_details.store_front_url.indexOf('missing.png') > -1){
                        val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
                    } else {
                        val.alt_promo_image_url = getImageURL(store_details.store_front_url);
                    }
                }
            } 
        } else {
            if (val.promotionable_type == "Store") {
                var store_details = getStoreDetailsByID(val.promotionable_id);
                val.store_detail_btn = store_details.slug ;
                val.store_name = store_details.name;
                val.url=store_details.slug;
            }
            val.alt_promo_image_url = getCloudinaryImageUrl(val.promo_image_url);
        }
        if (val.store_name == undefined){
            val.store_name = "Midtown Plaza";
        }
        
        if(val.url == "" || val.url === null || val.url === undefined){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMMM D")
        }
        else{
            val.dates = start.format("MMMM D") + " - " + end.format("MMMM D")
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
                val.alt_promo_image_url = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
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
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
            val.dates = start.format("MMMM D")
        }
        else{
            val.dates = start.format("MMMM D") + " - " + end.format("MMMM D")
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
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
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
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format("MMMM D, YYYY")
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
        if (val){
            val.image_url = "//mallmaverick.cdn.speedyrails.net" + val.fashion_images[0].photo_url;
        
            if(val.description.length > 50){
                val.description_short = val.description.substring(0,50) + "...";
            }
            else{
                val.description_short = val.description;
            }
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
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/599dcb2e6e6f6420d91e0300/image/png/1506519164000/Midtown_logo-vert-blk.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        var date_blog = moment(val.publish_date).tz(getPropertyTimeZone());
        val.published_on = date_blog.format("MMMM D, YYYY")
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
        val.month = d.format("MMMM");
        val.weekday = d.format("DD");
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = in_my_time_zone(moment(val.open_time), "h:mma");
            var close_time = in_my_time_zone(moment(val.close_time), "h:mma");
            val.h = open_time + " - " + close_time;
        } else {
            val.h = "Closed";
        }
        if (val.is_holiday == true){
            val.day = val.holiday_name + ", ";
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
        if(val.posts != null){
            var rendered = Mustache.render(template_html,val);
        }
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPopUp(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    if(collection.photo_link == "" || collection.photo_link === null){
       collection.css = "style=cursor:default;";
       collection.no_link = "return false";
    }
    collection.image_url_abs = "//mallmaverick.cdn.speedyrails.net" + collection.photo_url
    var rendered = Mustache.render(template_html,collection);
    item_rendered.push(rendered);
    $(container).html(item_rendered.join(''));
}




