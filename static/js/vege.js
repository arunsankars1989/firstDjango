$(document).ready(function () {
    window.vege = {
        submitRecipe: function (form, e) {
            e.preventDefault();
            const formData = new FormData(form);

            $.ajax({
                url: '/vege/save-recipe',
                type: 'POST',
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    app.showToastr(data.status, data.message);
                },
                error: function (xhr, status, error) {
                    // Handle error response
                    app.showToastr('error', 'Something went wrong!');
                }
            });

        }

    }

    $.validator.addMethod('imageExtension', function (value, element) {
        // Get the file extension
        var extension = value.split('.').pop().toLowerCase();
        // Check if the extension is jpg, jpeg, or png
        return extension === 'jpg' || extension === 'jpeg' || extension === 'png';
    }, 'Please select a valid image file (jpg, jpeg, or png)');
    const recipeForm = $('#recipeForm');
    recipeForm.validate({
        rules: {
            recipeName: {
                required: true,
                minlength: 3
            },
            recipeDescription: {
                required: true,
                minlength: 10
            },
            recipeImage: {
                required: true,
                imageExtension: true
            }
        },
        messages: {
            recipeName: {
                required: 'Please enter a recipe name',
                minlength: 'Recipe Name should have min 3 letters'
            },
            recipeDescription: {
                required: 'Please enter a recipe description',
                minlength: 'Recipe Name should have min 10 letters'
            },
            recipeImage: {
                required: 'Please add a recipe image',
                imageExtension: 'Please select a valid image file (jpg, jpeg, or png)'
            }
        },
        submitHandler: function (form) {
            vege.submitRecipe(form, event)
        }

    })
})