$(document).ready(function () {
    function formatDate(date) {
        return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear()
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

    function afterLoadTodoList() {
        $('[data-toggle="tooltip"]').tooltip();
        $('.btnCheck').click(function () {
            var id = $(this).data('id');
            $.ajax({
                url: '/todolist-updateMark/' + id,
                method: 'PATCH',
                dataType: 'JSON',
                success: function (response) {
                    Swal.fire({
                        title: response.messages,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    loadTodolist();
                },
                error: function (xhr, status, error) {
                    alert('Error: ' + error);
                }
            });
        });
    }

    function loadTodolist() {
        $.ajax({
            url: '/todolist',
            method: 'GET',
            dataType: 'JSON',
            success: function (response) {
                var encoded_data = response.data;
                var decoded_data = JSON.parse(atob(encoded_data));
                var todolistHtml = '';
                // console.log(decoded_data);
                if (decoded_data.length > 0) {
                    $.each(decoded_data, function (index, todo) {
                        todolistHtml += `
                        <div class="row px-3 align-items-center todo-item rounded">
                            <div class="col-auto m-1 p-0 d-flex align-items-center">
                                <h2 class="m-0 p-0">
                                ${(todo.status == 'Completed') ?
                                '<i class="fa fa-check-square-o text-primary btn m-0 p-0 btnCheck" data-id="' + todo.id + '" data-toggle="tooltip" data-placement="bottom" title="Mark as todo"></i>'
                                : '<i class="fa fa-square-o text-primary btn m-0 p-0 btnCheck" data-id="' + todo.id + '" data-toggle="tooltip" data-placement="bottom" title="Mark as complete"></i>'
                            }
                                </h2>
                            </div>
                            <div class="col px-1 m-1 d-flex align-items-center">
                                <input type="text" class="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3" id="todoRead-${index}" readonly value="${todo.todo}" title="${todo.todo}" />
                                <input type="text" class="form-control form-control-lg border-0 edit-todo-input rounded px-3 d-none" id="todo-${index}" name="todo" value="${todo.todo}" />
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
                                    <i class="fa fa-pencil text-info btn m-0 p-0" id="btnEdit" data-id="${index}" data-toggle="tooltip" data-placement="bottom" title="Edit task"></i>
                                </h5>
                                <h5 class="m-0 p-0 px-2">
                                    <i class="fa fa-trash-o text-danger btn m-0 p-0" id="btnDelete" data-id="${index}" data-toggle="tooltip" data-placement="bottom" title="Delete task"></i>
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
                    afterLoadTodoList();
                } else {
                    var unknownTodolist = '<div class="col-md-12 mt-4"><center><h4>Todo task doesnt exist yet</h4></center></div>';
                    $('#todolist-container').html(unknownTodolist);
                }
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    }

    var currentDate = formatDate(new Date());

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
                $(".due-date-label").text(formatDate(dateChangeEvent.date));
            });
    });

    $(function () {
        loadTodolist();
    });
});
