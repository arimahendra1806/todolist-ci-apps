<?php

namespace App\Controllers;

// use App\Controllers\BaseController;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\TodolistModel;

class Todolist extends ResourceController
{
    use ResponseTrait;

    protected $todolist;

    public function __construct()
    {
        $this->todolist = new TodolistModel();
    }

    public function index()
    {
        $dataGet = $this->request->getVar();

        switch ($dataGet['filter']) {
            case 'All':
                $data = $this->todolist->orderBy($dataGet['sortBy'], $dataGet['sort'])->findAll();
                break;

            case 'Active':
                $data = $this->todolist->where('status !=', 'Completed')
                    ->orderBy($dataGet['sortBy'], $dataGet['sort'])->findAll();
                break;

            default:
                $data = $this->todolist->where('status', $dataGet['filter'])
                    ->orderBy($dataGet['sortBy'], $dataGet['sort'])->findAll();
                break;
        }

        $encoded_data = base64_encode(json_encode($data));

        $response = [
            'data' => $encoded_data
        ];
        return $this->respond($response, 200, 'application/json');
    }

    public function create()
    {
        $dataPost = $this->request->getPost();

        $data = [];

        if (!$dataPost['todo']) {
            return $this->respond(['messages' => 'Task required'], 500, 'application/json');
        } else {
            $data['todo'] = $dataPost['todo'];
        }

        if ($dataPost['date']) {
            $data['date'] = $dataPost['date'];
            $data['status'] = 'Has due date';
        } else {
            $data['status'] = 'Active';
        }

        $this->todolist->insertTodolist($data);

        $response = [
            'messages' => 'Tasks has been added',
        ];
        return $this->respond($response, 200, 'application/json');
    }

    public function updateMark($id)
    {
        $dataTodolist = $this->todolist->getTodolist($id);

        $data = [];

        if ($dataTodolist['status'] == 'Completed' && $dataTodolist['date']) {
            $data['status'] = 'Has due date';
            $message = 'Tasks marked to do and have due date';
        } elseif ($dataTodolist['status'] == 'Completed') {
            $data['status'] = 'Active';
            $message = 'Tasks marked to do';
        } else {
            $data['status'] = 'Completed';
            $message = 'Tasks marked complete';
        }

        $this->todolist->updateTodolist($data, $id);

        $response = [
            'messages' => $message,
        ];
        return $this->respond($response, 200, 'application/json');
    }
}
