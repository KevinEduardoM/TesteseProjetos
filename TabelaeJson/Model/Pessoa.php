<?php
    class Pessoa {
        public $Nome;
        public $Filhos=[];

        public function setnome($nome){
            $this->Nome=$nome;
        }

        public function getnome(){
            return  $this->Nome;
        }
        
        public function setFilhos($Filho){
            array_push($this->Filhos,$Filho);
        }

        public function getFilhos(){
            return  $this->Filhos;
        }
    }
?>