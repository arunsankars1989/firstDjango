$(document).ready(function () {
    $('#animationContainer').hide();
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            const csrfField = $('#csrf');
            if (csrfField.length > 0) {
                const csrfToken = csrfField.find('input[name="csrfmiddlewaretoken"]').val()
                xhr.setRequestHeader('X-CSRFToken', csrfToken);
            }
        }
    });
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
        },
        openModal: (modalContainer) => {
            modalContainer.modal('show');
        },
        closeModal: (modalContainer) => {
            modalContainer.modal('hide');
        },
        confirmAction: (title, text, icon, confirmAction, cancelAction) => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: title,
                html: text,
                icon: icon,
                showCancelButton: true,
                confirmButtonText: "Confirm!",
                cancelButtonText: "Cancel!",
                reverseButtons: true,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('inside confirm')
                    typeof confirmAction === 'function' && confirmAction();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    typeof cancelAction === 'function' && cancelAction();
                }
            });
        }
    }


    $(document).ajaxStart(() => {
        app.showLoader();
    });

    $(document).ajaxComplete(() => {
        app.hideLoader();
    })
})