<?php

namespace App\Models;

use CodeIgniter\Model;
use Ramsey\Uuid\Uuid;

class TodolistModel extends Model
{
    protected $allowedFields;

    public function __construct()
    {
        parent::__construct();
        $fields = $this->db->getFieldNames('todolist');

        foreach ($fields as $field) {
            if ($field != 'id') {
                $this->allowedFields[] = $field;
            }
        }
    }

    protected $table            = 'todolist';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $protectFields    = true;

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getTodolist($id)
    {
        return $this->where(['id' => $id])->first();
    }

    public function getTodolists()
    {
        return $this->orderBy('updated_at', 'DESC')->findAll();
    }

    public function insertTodolist($data)
    {
        return $this->save($data);
    }

    public function updateTodolist($data, $id)
    {
        return $this->update($id, $data);
    }

    public function deleteTodolist($id)
    {
        return $this->delete($id);
    }
}
