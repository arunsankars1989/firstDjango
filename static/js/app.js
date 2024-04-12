$(document).ready(function () {
    $('#animationContainer').hide();
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    window.app = {
        showLoader: () => {
            $('#animationContainer').show();
            let animationData;
            $.getJSON('/static/js/plugins/loader.json', function (data) {
                animationData = data;
                const animationContainer = document.getElementById('animationGif');
                lottie.loadAnimation({
                    container: animationContainer,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData
                });
            });
        },
        hideLoader: () => {
            $('#animationContainer').hide();
        },
        showToastr: (status, message) => {
            toastr[status](message);
        }
    }

    $(document).ajaxStart(() => {
        app.showLoader();
    });

    $(document).ajaxComplete(() => {
        app.hideLoader();
    })
})