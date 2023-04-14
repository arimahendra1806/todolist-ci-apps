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

    private function todolistRules()
    {
        $todolistRules = [
            'todo' => [
                'label' => 'Task todo',
                'rules' => 'required'
            ]
        ];

        return $todolistRules;
    }

    public function index()
    {
        $data = $this->todolist->orderBy('updated_at', 'DESC')->findAll();
        $encoded_data = base64_encode(json_encode($data));

        $response = [
            'data' => $encoded_data
        ];
        return $this->respond($response, 200, 'application/json');
    }

    public function updateMark($id)
    {
        $dataTodolist = $this->todolist->where('id', $id)->first();

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

        $this->todolist->update($id, $data);

        $response = [
            'messages' => $message
        ];
        return $this->respond($response, 200, 'application/json');
    }
}
