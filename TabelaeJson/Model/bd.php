<?php
    include_once ("Pessoa.php");

   class  bd {

    public function Conectar()
    { 
        //É necessario atualizar as configurações do banco caso o mesmo possua senha.
        $user="root";
        $password="shinka8001";
       
        try{
            $conn=new PDO('mysql:host=localhost;port=3307',$user,$password); 
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
            $sql = "CREATE DATABASE IF NOT EXISTS bdfase2";
       
            $conn->exec($sql);
        }catch(PDOException $error){
            return '<h3>Erro de conexão:</h3><p>'.$error->getMessage().'</p>';
        }            
        return $conn;
    }

   
    public function criaTabelas($conection){
        $table="Pessoa";
        $conection->query("use bdfase2");
        $tableExists = $conection->query("SHOW TABLES LIKE '$table'")->rowCount() > 0;
        
        if($tableExists){

            $dropPessoa="drop table Pessoa";
            $dropFilho="drop table Filhos";

            $conection->query($dropFilho);
            $conection->query($dropPessoa);
            
        }
            $queryTabelaPessoas="Create table Pessoa(
                id_Pessoa INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                nome VARCHAR (50))";
        
            $queryTabelaFilhos="Create table Filhos( id_Filho INT PRIMARY KEY  AUTO_INCREMENT NOT NULL, id_Pessoa INT, FOREIGN key (id_Pessoa) references pessoa (id_Pessoa), nome VARCHAR (50))";
 
            $conection->exec($queryTabelaPessoas);
            $conection->exec($queryTabelaFilhos);
        
        
    }
       
    
    public function GravarDados($dados,$con){
         $this->criaTabelas($con);
        $con->query("use bdfase2");
        $obj=json_decode($dados);
        $id=1;

            foreach($obj->Pessoas as $pessoas){
            $statement=$con->prepare('INSERT INTO Pessoa(nome) VALUES(?)');
            $statement->bindParam(1,$pessoas->Nome);
            $statement->execute();
      
            if($pessoas->Filhos){
                for($i=0;$i<count($pessoas->Filhos);$i++){
                    
                    $statement=$con->prepare('INSERT INTO Filhos(nome,id_Pessoa) VALUES(?,?)');
                    $statement->bindParam(1,$pessoas->Filhos[$i]);  
                    $statement->bindParam(2,$id);
                                    
                    $statement->execute();
                }
            }
            $id++;
            }
    }

    public function RetornarDados($conn){
        $pessoas=[];
        $i=1;
        $conn->query("use bdfase2");
        $consulta=$conn->query("Select (nome) from Pessoa");
        
        while($linha = $consulta->fetch(PDO::FETCH_ASSOC)){
            $pessoa= new Pessoa();
            $pessoa->setnome($linha['nome']);
        

            $consultaPessoa=$conn->prepare("Select (nome) from Filhos where id_Pessoa = :id");
            $consultaPessoa->bindParam(':id',$i);
            $consultaPessoa->execute();
            
            while($linha2 = $consultaPessoa->fetchAll()){

                foreach($linha2 as $f){
                    $pessoa->setFilhos($f["nome"]);
                }  
            }
            $i++;
            array_push($pessoas,$pessoa);
        } 

        $pessoas=json_encode($pessoas);        
        return $pessoas;            
     }

    }
     

?>