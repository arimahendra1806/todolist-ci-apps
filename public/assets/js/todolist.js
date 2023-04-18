$(document).ready(function () {
    var currentDate = formatDate(new Date());
    var sortToggled = true;
    var limitTodolist = 10;
    var totalTodolist = 0;
    var arrDataFilter = [];

    /* Ajax Token */
    $.ajaxSetup({
        dataType: 'JSON',
        cache: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    function formatDate(date) {
        return (
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
    }

    function getDateFormat(dateFormat) {
        const newDate = new Date(dateFormat);

        function getOrdinal(day) {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }

        const day = newDate.getDate();
        const month = newDate.toLocaleString('default', { month: 'short' });
        const year = newDate.getFullYear();
        const ordinal = getOrdinal(day);

        const formattedDate = `${day}${ordinal} ${month} ${year}`;

        return formattedDate;
    }

    function loadTooltip() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    function getDataFilter() {
        arrDataFilter.length = 0;
        arrDataFilter.push($('.filter-btn').val());
        arrDataFilter.push($('.sort-by-btn').val());
        arrDataFilter.push($('#sortHiddenValue').val());
    }

    function afterLoadTodoList(total) {
        $('.btnMark').click(function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/todolist-updateMark/' + id,
                method: 'PATCH',
                success: function (response) {
                    Swal.fire({
                        title: response.messages,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getDataFilter();
                    loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
                },
                error: function (xhr, status, error) {
                    alert('Error: ' + error);
                }
            });
        });

        $('.edit-btn').click(function () {
            var id = $(this).data('id');
            var todo = $(this).data('todo');
            var date = $(this).data('date');
            $('#formEdit').trigger('reset');
            $('#staticBackdrop').modal('show');
            $('#editId').val(id);
            $('#editTodo').val(todo);
            if (date) {
                $("#editDate").val(getDateFormat(date));
                $("#dueDateEdit").val(date);
                $('.due-date-button-edit').datepicker('update', date);
                $(".clear-due-date-button-edit").removeClass('d-none');
            }
        })

        $(".delete-btn").click(function () {
            var id = $(this).data('id');
            Swal.fire({
                title: 'Are you sure?',
                text: "You will not be able to restore this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete!',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        url: '/todolist/' + id,
                        method: 'DELETE',
                        success: function (response) {
                            Swal.fire({
                                title: response.messages,
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            getDataFilter();
                            loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
                            limitTodolist = 10;
                        },
                        error: function (xhr, status, error) {
                            alert('Error: ' + error);
                        }
                    });
                }
            });
        })

        totalTodolist = total;
        if (totalTodolist > 10) {
            $('.load-btn').removeClass('d-none')
        } else {
            $('.load-btn').addClass('d-none')
        }
    }

    function loadTodolist(filterTodolist, sortByTodolist, sortTodolist, limitTodolist) {
        $.ajax({
            url: '/todolist',
            method: 'GET',
            data: {
                filter: filterTodolist,
                sortBy: sortByTodolist,
                sort: sortTodolist,
                limit: limitTodolist
            },
            success: function (response) {
                var encoded_data = response.data;
                var decoded_data = JSON.parse(atob(encoded_data));
                var todolistHtml = '';
                if (decoded_data.length > 0) {
                    $.each(decoded_data, function (index, todo) {
                        todolistHtml += `
                        <div class="row px-3 align-items-center todo-item rounded">
                            <div class="col-auto m-1 p-0 d-flex align-items-center">
                                <h2 class="m-0 p-0">
                                ${(todo.status == 'Completed') ?
                                '<i class="fa fa-check-square-o text-primary btn m-0 p-0 btnMark" data-id="' + todo.id + '" data-toggle="tooltip" data-placement="bottom" title="Mark as todo"></i>'
                                : '<i class="fa fa-square-o text-primary btn m-0 p-0 btnMark" data-id="' + todo.id + '" data-toggle="tooltip" data-placement="bottom" title="Mark as complete"></i>'
                            }
                                </h2>
                            </div>
                            <div class="col px-1 m-1 d-flex align-items-center">
                                <input type="text" class="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3" readonly value="${todo.todo}" title="${todo.todo}" />
                            </div>
                            <div class="col-auto m-1 p-0 px-3">
                                <div class="row">
                            ${(todo.date && todo.status == 'Completed') ?
                                '<div class="col-auto d-flex align-items-center rounded bg-white border border-success"><i class="fa fa-check my-2 px-2 text-success btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="In completed"></i><h6 class="text my-2 pr-2">' + getDateFormat(todo.date) + '</h6></div>'
                                : (todo.date && todo.status != 'Completed') ? '<div class="col-auto d-flex align-items-center rounded bg-white border border-warning"><i class="fa fa-hourglass-2 my-2 px-2 text-warning btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Due date"></i><h6 class="text my-2 pr-2">' + getDateFormat(todo.date) + '</h6></div>'
                                    : ''
                            }
                                </div >
                            </div >
                        <div class="col-auto m-1 p-0 todo-actions">
                            <div class="row d-flex align-items-center justify-content-end">
                                <h5 class="m-0 p-0 px-2">
                                    <i class="fa fa-pencil text-info btn m-0 p-0 edit-btn" data-id="${todo.id}" data-todo="${todo.todo}" data-date="${todo.date}" data-toggle="tooltip" data-placement="bottom" title="Edit task"></i>
                                </h5>
                                <h5 class="m-0 p-0 px-2">
                                    <i class="fa fa-trash-o text-danger btn m-0 p-0 delete-btn" data-id="${todo.id}" data-toggle="tooltip" data-placement="bottom" title="Delete task"></i>
                                </h5>
                            </div>
                            <div class="row todo-created-info">
                                <div class="col-auto d-flex align-items-center pr-2">
                                    <i class="fa fa-info-circle my-2 px-2 text-black-50 btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Created date"></i>
                                    <label class="date-label my-2 text-black-50">${getDateFormat(todo.created_at)}</label>
                                </div>
                            </div>
                        </div>
                        </div >
                        `;
                    });
                    $('#todolist-container').html(todolistHtml);
                    afterLoadTodoList(response.total);
                } else {
                    var unknownTodolist = '<div class="col-md-12 mt-4"><center><h4>Todo task doesnt exist yet</h4></center></div>';
                    $('#todolist-container').html(unknownTodolist);
                }
                loadTooltip();
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    }

    function clearDueDateButton() {
        $(".due-date-label").text('Due date not set');
        $("#dueDate").val('');
        $(".clear-due-date-button").addClass('d-none');
    }

    function clearDueDateButtonEdit() {
        $("#editDate").val('Due date not set');
        $("#dueDateEdit").val('');
        $(".clear-due-date-button-edit").addClass('d-none');
    }

    $(function () {
        getDataFilter();
        loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);

        $(".due-date-button").datepicker({
            format: "dd/mm/yyyy",
            autoclose: true,
            todayHighlight: true,
            startDate: currentDate,
            orientation: "bottom right"
        });

        $(".due-date-button").on("click", function (event) {
            $(".due-date-button")
                .datepicker("show")
                .on("changeDate", function (dateChangeEvent) {
                    $(".due-date-button").datepicker("hide");
                    $(".due-date-label").text(getDateFormat(dateChangeEvent.date));
                    $("#dueDate").val(formatDate(dateChangeEvent.date));
                    $(".clear-due-date-button").removeClass('d-none');
                });
        });

        $(".clear-due-date-button").on("click", function () {
            clearDueDateButton();
        })

        $("#formAdd").submit(function (event) {
            event.preventDefault();

            var formData = new FormData(this);

            $.ajax({
                url: "/todolist",
                type: "POST",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".btnAdd").attr('disable', 'disabled');
                    $(".btnAdd").html('<i class="fa fa-spin fa-spinner"></i>');
                },
                complete: function () {
                    $(".btnAdd").removeAttr('disable');
                    $(".btnAdd").html('Add');
                },
                success: function (response) {
                    clearDueDateButton();
                    $('#formAdd').trigger('reset');
                    Swal.fire({
                        title: response.messages,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getDataFilter();
                    loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error : ' + xhr.responseJSON.messages,
                        icon: 'warning',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });

        $("#formEdit").submit(function (event) {
            event.preventDefault();

            var formData = new FormData(this);

            $.ajax({
                url: "/todolist-update",
                type: "POST",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $(".btnEdit").attr('disable', 'disabled');
                    $(".btnEdit").html('<i class="fa fa-spin fa-spinner"></i>');
                },
                complete: function () {
                    $(".btnEdit").removeAttr('disable');
                    $(".btnEdit").html('Save');
                },
                success: function (response) {
                    clearDueDateButtonEdit();
                    $('#staticBackdrop').modal('hide');
                    Swal.fire({
                        title: response.messages,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getDataFilter();
                    loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error : ' + xhr.responseJSON.messages,
                        icon: 'warning',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });

        $(".filter-btn").on("change", function (event) {
            getDataFilter();
            loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
        });

        $(".sort-by-btn").on("change", function (event) {
            getDataFilter();
            loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
        });

        $(".sort-btn").on("click", function (event) {
            if (sortToggled) {
                $('.sort-asc').removeClass('d-none');
                $('.sort-desc').addClass('d-none');
                sortToggled = false;
                $('#sortHiddenValue').val('asc');
            } else {
                $('.sort-desc').removeClass('d-none');
                $('.sort-asc').addClass('d-none');
                sortToggled = true;
                $('#sortHiddenValue').val('desc');
            }
            getDataFilter();
            loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
        });

        $(".due-date-button-edit").datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayHighlight: true,
            startDate: 'currentDate',
            orientation: "bottom right"
        });

        $(".due-date-button-edit").on("click", function (event) {
            $(".due-date-button-edit")
                .datepicker("show")
                .on("changeDate", function (dateChangeEvent) {
                    $(".due-date-button-edit").datepicker("hide");
                    $("#editDate").val(getDateFormat(dateChangeEvent.date));
                    $("#dueDateEdit").val(formatDate(dateChangeEvent.date));
                    $(".clear-due-date-button-edit").removeClass('d-none');
                });
        });

        $(".clear-due-date-button-edit").on("click", function () {
            clearDueDateButtonEdit();
        })

        $(".load-btn").on("click", function (event) {
            if (totalTodolist < limitTodolist) {
                Swal.fire({
                    title: 'All task has been displayed',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                limitTodolist += 10;
            }
            getDataFilter();
            loadTodolist(arrDataFilter[0], arrDataFilter[1], arrDataFilter[2], limitTodolist);
        })
    });
});
