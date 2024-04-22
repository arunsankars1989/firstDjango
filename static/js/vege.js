$(document).ready(function () {
    let datatableObj;
    window.vege = {
        recipeForm: $('#recipeForm'),
        recipeTable: $('#recipeTable'),
        recipeFormReset: () => {
            vege.recipeForm[0].reset();
            vege.recipeModal.find('#recipeFormSubmit').text('Add');
            vege.recipeModal.find('#recipeFormReset').text('Reset');
        },
        recipeModal: $('#recipeModal'),
        recipeModalHide: () => {
            app.closeModal(vege.recipeModal);
            vege.recipeFormReset();
        },
        recipeModalShow: (isEdit) => {
            vege.recipeModal.find('#recipeFormSubmit').text('Update');
            vege.recipeModal.find('#recipeFormReset').text('Cancel');
            app.openModal(vege.recipeModal, isEdit);
        },
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
                    vege.recipeModalHide();
                    vege.reloadRecipes();
                },
                error: function (xhr, status, error) {
                    // Handle error response
                    app.showToastr('error', 'Something went wrong!');
                }
            });

        },
        loadRecipes: () => {
            datatableObj = new DataTable(vege.recipeTable, {
                ajax: {
                    url: 'get-recipe',
                    type: 'GET',
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader('X-CSRFToken', $('#csrf').find('input[name="csrfmiddlewaretoken"]').val());
                    },
                    processing: true,
                    serverSide: true
                },
                "columns": [
                    {"data": "recipe_name"},
                    {"data": "recipe_description"},
                    {
                        "data": null,
                        "render": (data, type, full, meta) => {
                            return `<img src="/media/${full.recipe_image}" alt="${full.recipe_name}" class="tableImg">`
                        }
                    },
                    {
                        "data": null,
                        "render": (data, type, full, meta) => {
                            return `<div class="btn-group" role="group" aria-label="Basic example">
                              <button type="button" class="btn btn-primary editRecipe" data-id="${full.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                <i class="fa-solid fa-pen fa-fw"></i>
                              </button>
                              <button type="button" class="btn btn-danger deleteRecipe" data-id="${full.id}" data-name="${full.recipe_name}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                <i class="fa-solid fa-trash fa-fw"></i>
                              </button>
                            </div>`;
                        }
                    }
                ]
            });
            datatableObj.on('draw', function () {
                // Target the custom icons within the DataTable and add tooltips
                $('[data-bs-toggle="tooltip"]').tooltip();
            });
        },
        reloadRecipes: () => {
            datatableObj.ajax.reload();
        },
        showRecipeEditModal: function (id) {

            $.ajax({
                url: `/vege/get-recipe/${id}`,
                type: 'GET',
                success: function (res) {
                    console.log(res.data.recipe_name);
                    $('#recipeName').val(res.data.recipe_name);
                    $('#recipeDescription').val(res.data.recipe_description);
                    $('#recipeImageDisp').find('img').attr('src', res.data.recipe_image).attr('alt', res.data.recipe_name);
                    $('#recipeImageDisp').show();
                    $('#id').val(res.data.id);
                    vege.recipeModalShow(true);
                },
                error: function (xhr, status, error) {
                    // Handle error response
                    app.showToastr('error', 'Something went wrong!');
                }
            });

        },
        deleteRecipe: (id) => {
            $.ajax({
                url: `/vege/delete-recipe/${id}`,
                type: 'DELETE',
                dataType: 'json',
                data: {},
                success: function (data) {
                    app.showToastr(data.status, data.message);
                    vege.reloadRecipes();
                },
                error: function (xhr, status, error) {
                    app.showToastr('error', 'Something went wrong!');
                }
            });
        },
        updateRecipe: function (form, id, e) {
            e.preventDefault();
            const formData = new FormData(form);

            $.ajax({
                url: `/vege/update-recipe/${id}`,
                type: 'PUT',
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    app.showToastr(data.status, data.message);
                    vege.recipeModalHide();
                    vege.reloadRecipes();
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
    vege.recipeForm.validate({
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
            const id = $('#id').val();
            if (id !== '') {
                vege.submitRecipe(form, event);
                return;
            }
            vege.updateRecipe(form, id, event);
        }

    })

    if (vege.recipeTable.length > 0) {
        vege.loadRecipes();
    }

    $('#recipeFormReset').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        vege.recipeFormReset();
        if ($('#recipeFormReset').text() !== 'Reset') {
            vege.recipeModalHide();
        }
    })

    $(document).on('click', '.deleteRecipe', function (event) {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');
        app.confirmAction('Delete', `Are you sure to delete recipe <b>"${name}"</b>? This action can not be undone!`, 'warning', () => {
            vege.deleteRecipe(id)
        });
    })

    $(document).on('click', '.editRecipe', function (event) {
        const id = $(this).attr('data-id');
        vege.showRecipeEditModal(id);
    })

    vege.recipeModal.on('hidden.bs.modal', function (e) {
        vege.recipeFormReset();
    });

})