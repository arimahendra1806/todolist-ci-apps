<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo csrf_hash(); ?>">
    <title>TaskMate - Task Management</title>

    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/bootstrap-datepicker.standalone.min.css">
    <link rel="stylesheet" href="assets/css/sweetalert2.min.css">
    <link rel="stylesheet" href="assets/css/todolist.css">
</head>

<body>
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="staticBackdropLabel">Edit Task</h5>
                </div>
                <form id="formEdit">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="formGroupExampleInput">Task todo:</label>
                            <input type="hidden" class="form-control" id="editId" name="id" readonly>
                            <input type="text" class="form-control" id="editTodo" name="todo" placeholder="Edit task">
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput2">Due date:</label>
                            <div class="d-flex align-items-center">
                                <input type="text" class="form-control" id="editDate" placeholder="Due date not set" readonly>
                                <input type="hidden" id="dueDateEdit" name="date">
                                <i class="fa fa-calendar my-2 px-1 text-primary btn due-date-button-edit" data-toggle="tooltip" data-placement="bottom" title="Set a Due date"></i>
                                <i class="fa fa-calendar-times-o my-2 px-1 text-danger btn clear-due-date-button-edit d-none" data-toggle="tooltip" data-placement="bottom" title="Clear Due date"></i>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary btnEdit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="container m-5 p-2 rounded mx-auto bg-light shadow">
        <!-- App title section -->
        <div class="row m-1 p-4">
            <div class="col">
                <div class="p-1 h1 text-primary text-center mx-auto display-inline-block">
                    <u>TaskMate - Task Management</u>
                </div>
            </div>
        </div>
        <!-- Create todo section -->
        <div class="row m-1 p-3">
            <div class="col col-11 mx-auto">
                <form id="formAdd">
                    <div class="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                        <div class="col">
                            <input class="form-control form-control-lg border-0 add-todo-input bg-transparent rounded" name="todo" type="text" placeholder="Add new ..">
                        </div>
                        <div class="col-auto m-0 px-2 d-flex align-items-center">
                            <label class="text-secondary my-2 p-0 px-1 view-opt-label due-date-label">Due date not set</label>
                            <i class="fa fa-calendar my-2 px-1 text-primary btn due-date-button" data-toggle="tooltip" data-placement="bottom" title="Set a Due date"></i>
                            <i class="fa fa-calendar-times-o my-2 px-1 text-danger btn clear-due-date-button d-none" data-toggle="tooltip" data-placement="bottom" title="Clear Due date"></i>
                            <input type="hidden" id="dueDate" name="date">
                        </div>
                        <div class="col-auto px-0 mx-0 mr-2">
                            <button type="submit" class="btn btn-primary btnAdd">Add</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="p-2 mx-4 border-black-25 border-bottom"></div>
        <!-- View options section -->
        <div class="row m-1 p-3 px-5 justify-content-end">
            <div class="col-auto d-flex align-items-center">
                <label class="text-secondary my-2 pr-2 view-opt-label">Filter</label>
                <select class="custom-select custom-select-sm btn my-2 filter-btn">
                    <option value="All" selected>All</option>
                    <option value="Completed">Completed</option>
                    <option value="Active">Active</option>
                    <option value="Has due date">Has due date</option>
                </select>
            </div>
            <div class="col-auto d-flex align-items-center px-1 pr-3">
                <label class="text-secondary my-2 pr-2 view-opt-label">Sort</label>
                <select class="custom-select custom-select-sm btn my-2 sort-by-btn">
                    <option value="created_at" selected>Added date</option>
                    <option value="date">Due date</option>
                </select>
                <input type="hidden" id="sortHiddenValue" value="desc">
                <i class="fa fa fa-sort-amount-asc text-info btn mx-0 px-0 pl-1 sort-btn sort-asc d-none" data-toggle="tooltip" data-placement="bottom" title="Ascending"></i>
                <i class="fa fa fa-sort-amount-desc text-info btn mx-0 px-0 pl-1 sort-btn sort-desc" data-toggle="tooltip" data-placement="bottom" title="Descending"></i>
            </div>
        </div>
        <!-- Todo list section -->
        <div class="row mx-1 px-5 pb-3 w-80">
            <div class="col mx-auto">
                <div id="todolist-container"></div>
            </div>
        </div>
    </div>

    <script src="assets/js/jquery-3.6.0.min.js"></script>
    <script src="assets/js/jquery.cookie-1.4.1.min.js"></script>
    <script src="assets/js/popper.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/bootstrap-datepicker.min.js"></script>
    <script src="assets/js/sweetalert2.min.js"></script>
    <script src="assets/js/todolist.js"></script>
</body>

</html>