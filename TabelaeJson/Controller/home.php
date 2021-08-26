<?php
     header('Access-Control-Allow-Origin: *'); 
     header("Access-Control-Allow-Headers: Content-Type");
    include_once("../Model/bd.php");
    
    $banco=new bd();
    $con=$banco->Conectar();
    $Conteudorequisicao=file_get_contents('php://input');

    //Verifica se a requisição possui arquivos se possuir grava os dados senão retorna os dados do banco
    if($Conteudorequisicao){ 
      $banco->GravarDados($Conteudorequisicao,$con);
    }else{  
      $dados = $banco->RetornarDados($con);
      echo $dados;
    }
      
?>