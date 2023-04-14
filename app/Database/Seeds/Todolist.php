<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use Ramsey\Uuid\Uuid;

class Todolist extends Seeder
{
    public function run()
    {
        $data = [
            [
                'id' => Uuid::uuid4()->toString(),
                'todo' => 'Do math home work',
                'status' => 'Active',
                'date' => NULL
            ],
            [
                'id' => Uuid::uuid4()->toString(),
                'todo' => 'Clean my bedroom',
                'status' => 'Completed',
                'date' => NULL
            ],
            [
                'id' => Uuid::uuid4()->toString(),
                'todo' => 'Pratice guitar',
                'status' => 'Has due date',
                'date' => '2023-04-29'
            ]
        ];

        $this->db->table('todolist')->insertBatch($data);
    }
}
