

    let json={ Pessoas:[]};
    let textarea= document.getElementById('textjson');
    textarea.textContent=JSON.stringify(json,null,2);

    function incluir() {
     
        let nomeP = document.getElementById('nome').value;
        let Dados= document.getElementById('textjson').textContent;
        Dados= JSON.parse(Dados);
        
        if(Dados.Pessoas!=undefined && nomeP){
            ObjPessoa={"Nome":nomeP, "Filhos":[]};
            Dados.Pessoas.push(ObjPessoa);
            textarea.textContent=JSON.stringify(Dados,null,2);

            AtualizarTabela()
        }
    }

    function Eventos(btnRemover,btnAdicinarFilho) {
        btnRemover.addEventListener('click', RemoverPessoa);
        btnAdicinarFilho.onclick=AdicionarFilho;

        nome.value="";       
    }
    
    function AdicionarFilho(){
        let nomeFilho= prompt("Qual o nome do filho?");
        if (nomeFilho!=null && nomeFilho!="") {
              let Dados= document.getElementById("textjson").value;
        Dados=JSON.parse(Dados);
    
        let btn="btnAdicionarFilho";
        Object.keys(Dados.Pessoas).forEach((key) => {
        
            if(btn+key==this.id){
                Dados.Pessoas[key].Filhos.push(nomeFilho);
            }
        });

        let campo= document.getElementById('textjson');
        campo.textContent=JSON.stringify(Dados,null,2);
    
        AtualizarTabela();  
        }             
    }

    function AtualizarTabela(){ 
        LimparTabela();

        let json = document.getElementById('textjson').textContent;
        let tabela = document.getElementById('tabela');
        let Dados = JSON.parse(json);
        idlinha=0;
      
          Object.keys(Dados.Pessoas).forEach((key) => {

            //criação dos elementos da tabela 
            let linha =document.createElement('tr');
            let cellN=document.createElement('td');
            let cellBR=document.createElement('td');
            let btnRemover = document.createElement('button');
            let btnAdicinarFilho = document.createElement('button');


            btnRemover.textContent="Remover";
            btnRemover.id="btnRemover"+key;
            btnRemover.classList.add("btnRemoverPessoa");

            btnAdicinarFilho.textContent="Adicionar Filho";
            btnAdicinarFilho.id="btnAdicionarFilho"+key;       
            btnAdicinarFilho.classList.add("btnAdicionarFilho");
            
            cellN.textContent=Dados.Pessoas[key].Nome;
            linha.classList.add('LinhaPessoa');
            linha.id=idlinha;

            cellBR.appendChild(btnRemover);
            linha.appendChild(cellN); 
            linha.appendChild(cellBR);
            tabela.appendChild(linha);
            
            //verifica se o objeto está vazio
            if(isEmptyObject(Dados.Pessoas[key].Filhos)) {

                Object.keys(Dados.Pessoas[key].Filhos).forEach((key2) => {

                    let linhaf =document.createElement('tr');
                    let cellf=document.createElement('td');
                    let cellbtn=document.createElement('td');
                    let btnRemoverFilho=document.createElement('button');

                    linhaf.classList.add('LinhaFilho');
                   
                     //key1 define o nº da pessoas  e ket2 define o filho
                    btnRemoverFilho.id="btnRemover"+key+key2;
                    btnRemoverFilho.onclick=RemoverFilho;
                   
                    btnRemoverFilho.textContent="Remover Filho"; 
                    btnRemoverFilho.classList.add("btnRemoverFilho");  
                    cellf.textContent=" -"+Dados.Pessoas[key].Filhos[key2];

                    linhaf.appendChild(cellf);
                    cellbtn.appendChild(btnRemoverFilho);
                    linhaf.appendChild(cellbtn);
                    tabela.appendChild(linhaf);  
                
                });      
            }  
            Eventos(btnRemover,btnAdicinarFilho);
             tabela.appendChild(btnAdicinarFilho);
        });
      
    }


    function RemoverPessoa() {  
        let Dados= document.getElementById('textjson').textContent;
        Dados= JSON.parse(Dados);

        Object.keys(Dados.Pessoas).forEach((key) => {
            if("btnRemover"+key==this.id){
                Dados.Pessoas.splice(key,1);
            }
        });
        
        let campo= document.getElementById('textjson');
        campo.textContent=JSON.stringify(Dados,null,2);
  
        AtualizarTabela();
    }

    function RemoverFilho() {  
        let Dados= document.getElementById('textjson').textContent;
        Dados= JSON.parse(Dados);

        Object.keys(Dados.Pessoas).forEach((key) => {
            Object.keys(Dados.Pessoas[key].Filhos).forEach((key2) => {
                
                if("btnRemover"+key+key2==this.id){
                    Dados.Pessoas[key].Filhos.splice(key2,1);
                }
            });          
        });
        
        let campo= document.getElementById('textjson');
        campo.textContent=JSON.stringify(Dados,null,2);

        AtualizarTabela();
    }  

    function LimparTabela(){
        var tabela = document.getElementById("tabela");   
        var todaslinhas= tabela.childNodes.length;
             
        if(todaslinhas>0){
            for (let index = 0; index < todaslinhas-2; index++) {              
                 tabela.removeChild(tabela.lastChild);
                }
        }                         
    }

    function isEmptyObject(obj)
    {
       return !!Object.keys(obj).length;    
    }
    
    //Função que envia os dados para o cadastro
    function GravarDados() {
        MostrarCarregamento();
        let json=document.getElementById('textjson').textContent;
        let url="http://localhost/dashboard/Aplicacoes/testePratico/TabelaeJson/Controller/home.php";
        
        const options = {
            method: 'POST',
           headers: {'Content-Type':'application/x-www-form-urlencoded'},
           body:json
          }
          return fetch(url, options)
          .then( MostrarCarregamento(),alert("Dados enviados com sucesso!"))
          .catch(function(error){
            console.log(error);
          })
               

         
    }

    function RetornaDadosBanco() {
        let url="http://localhost/dashboard/Aplicacoes/testePratico/TabelaeJson/Controller/home.php";
        MostrarCarregamento();
        const options = {
            method: 'GET',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
          }
           fetch(url, options)
          .then( response=>response.json())
          .then(function data(data){
              let json={Pessoas:data};
              textarea.textContent=JSON.stringify(json,null,2);
              alert("Dados recebidos com sucesso!")
              AtualizarTabela()
            return data;
          }).catch(function(error){          
              alert("Falha ao receber dados verifique a conexão com o banco");
              
              console.log("erro"+error.toString());
            }).finally(function () {
              MostrarCarregamento()
                }
         )
    }

    function MostrarCarregamento(){
        let iconecarregar=document.getElementById('telaCarregamento');

        if (iconecarregar.style.display=='flex') {    
            iconecarregar.style.display='none';
        }else{
            iconecarregar.style.display='flex';
        }
       
    }


           

  

let btnGravar=document.getElementById("btnGravar");
btnGravar.onclick=GravarDados;

let btnLer=document.getElementById("btnLer");
btnLer.onclick=RetornaDadosBanco;

let btnCadastrar=document.getElementById('btnincluir');
btnCadastrar.addEventListener('click', incluir);
