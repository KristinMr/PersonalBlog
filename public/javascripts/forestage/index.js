$(function() {
    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
        $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    }

    var accordion = new Accordion($('#accordion'), false);


    $(".submenu li a").click(function  () {
        $(".submenu li a").removeClass("add");
        $(this).addClass("add");
        var name=$(this).html();
        var text=$(this).parent().parent().siblings("div").text();
        // $(".breadcrumb .active").remove();
        $("#bread").html("");
        $("#bread").append("<li><a href=''><i class='fa fa-home'></i>首页</a></li>");
        $("#bread").append("<li><a>"+text+"</a></li>");
        $("#bread").append("<li><a href='#'>"+name+"</a></li>");
        $(".breadcrumb li:last").addClass("active");
    });


});


