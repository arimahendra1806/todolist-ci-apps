<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Todolist extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'VARCHAR',
                'constraint' => '36',
            ],
            'todo' => [
                'type' => 'TEXT',
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => "'Completed', 'Active', 'Has due date'",
                'default' => 'Active',
            ],
            'date' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
            'deleted_at datetime default null'
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('todolist');
    }

    public function down()
    {
        $this->forge->dropTable('todolist');
    }
}
