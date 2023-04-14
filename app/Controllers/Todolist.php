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
        return $this->respond($data);
    }

    public function updateMark($id)
    {
        $data = $this->todolist->where('id', $id)->first();
    }
}
