$(document).ready(function () {
    window.login = {
        form: $('#loginForm'),
        resetLoginForm: () => {
            login.form[0].reset()
        },
        signUpForm: $('#signUpForm'),
        resetSignUpForm: () => {
            login.signUpForm[0].reset();
        },
        submitLogin: (form, e) => {
            e.preventDefault();
            const formData = new FormData(form);

            $.ajax({
                url: '/submit-login/',
                type: 'POST',
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.status === 'success') {
                        login.resetLoginForm();
                        window.location.href = '/vege';
                        return;
                    }
                    app.showToastr(res.status, res.message);
                },
                error: function () {
                    app.showToastr('error', 'Failed to login!');
                }
            });
        },
        submitRegister: (form, e) => {
            e.preventDefault();
            const formData = new FormData(form);

            $.ajax({
                url: '/submit-register/',
                type: 'POST',
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    app.showToastr(res.status, res.message);
                    if (res.status === 'success') {
                        login.resetSignUpForm();
                    }
                },
                error: function () {
                    app.showToastr('error', 'Something went wrong!');
                }
            });
        }
    }

    login.form.validate({
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            username: {
                required: 'Please enter username'
            },
            password: {
                required: 'Please enter password',
            }
        },
        submitHandler: function (form) {
            login.submitLogin(form, event);
        }

    })

    login.signUpForm.validate({
        rules: {
            firstName: {
                required: true,
                minlength: 3
            },
            lastName: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true,
            },
            userName: {
                required: true,
            },
            password: {
                required: true,
                minlength: 8,
                maxlength: 18,
                strongPassword: 'on'
            },
            confirmPassword: {
                required: true,
                equalTo: '#password',
            }
        },
        messages: {
            firstName: {
                required: 'Please enter First Name'
            },
            lastName: {
                required: 'Please enter Last Name',
            },
            email: {
                required: 'Please enter Email address',
            },
            username: {
                required: 'Please enter Username',
            },
            password: {
                required: 'Please enter password',
                minlength: 'Password must be at least 8 characters',
                maxlength: 'Password length should not be more than 18',
            },
            confirmPassword: {
                required: 'Please confirm password',
                equalTo: 'Password and Confirm Password must match',
            }

        },
        submitHandler: function (form) {
            login.submitRegister(form, event);
        }
    })

    $.validator.addMethod(
        'strongPassword',
        function (value, element) {
            const regex = /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,18}$/;
            return regex.test(value);
        },
        'Password should contain at least 8-18 characters with Upper Case, Lower Case, Numeric and Special characters'
    );

    $('#resetSignUp').on('click', function () {
        login.resetSignUpForm();
    })
})