const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models=require('./models');
const req = require('express/lib/request');

const app=express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get('/', function(req, res){
    res.send('Seja bem-vindo(a) a Services TI')
});

//Inserindo Serviços

app.post('/servicos', async(req,res) =>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});


//Inserir um novo cliente
app.post('/cliente', async(req, res) =>{
    await cliente.create(
        req.body
    ).then(cli => {
        return res.json({
            erro: false,
            message: "Cliente foi inserido com sucesso.",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão."
        });
    });
});

//Inserir um novo pedido
app.post('/pedido', async(req, res) =>{
    await pedido.create(
        req.body
    ).then(cli => {
        return res.json({
            erro: false,
            message: "Pedido criado com sucesso.",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão."
        });
    });
});

// Inserir item pedido
app.post('/itenspedido', async(req, res) =>{
    await itempedido.create(
        req.body
    ).then(cli => {
        return res.json({
            erro: false,
            message: "Item criado com sucesso.",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão."
        });
    });
});

//Consultar todos os serviços
app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        //raw: true
        order:[['nome', 'DESC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

//Total de serviços
app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

//consultar um unico serviço (pelo ID)
app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado!"
        });
    });
});

//Visualizar todos os clientes
app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

//visualizar todos os pedidos
app.get('/listapedidos', async(req, res)=>{
    await pedido.findAll({
        //raw: true
        order:[['id', 'ASC']]
    }).then(function(pedido){
        res.json({pedido})
    });
});

//Contagem de clientes No Server
app.get('/totalClientes', async(req, res)=>{
    await cliente.count('id').then(function(cliTotal){
        res.json({cliTotal});
    });
});

//Contagem de pedidos solicitados
app.get('/totalPedidos', async(req, res)=>{
    await pedido.count('id').then(function(pedTotal){
        res.json({pedTotal});
    });
});

//Atualizar serviço
app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    });
});

//Edit item
app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: 'Serviço não foi encontrado.'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: 'Pedido foi alterado com sucesso!',
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Erro: não foi possível alterar.'
        });
    });
});

//busca por serviços do cliente utilizando o id do cliente
app.get('/listaServicoCli', async(req, res)=>{
    await servico.findByPk(req.body.ClienteId)
    .then(serv=>{
        return res.json({serv});
    });
});

//consultar e editar clientes
app.put('/clienteAttDados', async(req, res)=>{
    await cliente.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Dados do Cliente foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração dos dados."
        });
    });
});

//consultar e editar pedido
app.put('/AttPedido', async(req, res)=>{
    await pedido.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Dados do pedido alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do pedido."
        });
    });
});
    
//Exibir todos os pedidos de um cliente
app.get('/cliente/:id/pedidos', async(req, res)=>{
    await pedido.findAll({
        where: {ClienteId: req.params.id}
    }).then(pedidos =>{
        return res.json({
            error: false,
            pedidos
        });
    }).catch(erro =>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar"
        });
    });
});

//Alterar pedido utilizando o Id do cliente
app.put('/pedido/:id', async(req, res)=>{
    const ped = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        data: req.body.data
    };

    if (! await cliente.findByPk(req.body.ClienteId)){
        return res.status(400).json({
            error: true,
            message: "Cliente não existe."
        });
    };

    await pedido.update(ped, {
        where: Sequelize.and({ClienteId: req.body.ClienteId},
            {id: req.params.id})
    }).then(pedidos=>{
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso.",
            pedidos
        });
    }).catch(erro =>{
        return res.status(400).json({
            erro: true,
            message: "Não foi possivel alterar"
        });
    });
});

//Excluir cliente
app.get('/excluirCliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente"
        });
    });
});

//------------------Desafio---------------
//Cadastrando um novo produto
app.post('/produtos', async(req,res) =>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Produto inserido com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

//Consultar todos os produtos
app.get('/listaprodutos', async(req, res)=>{
    await produto.findAll({
        raw: true
    }).then(function(produtos){
        res.json({produtos})
    });
});


//Consultar um unico produto
app.get('/produto/:id', async(req, res)=>{
    await produto.findByPk(req.params.id)
    .then(prod =>{
        return res.json({
            error: false,
            prod
        });
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado!"
        });
    });
});


//att um produto
app.put('/AttProduto', async(req, res)=>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Dados do produto alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do produto."
        });
    });
});


//Deletar um produto
app.get('/excluirProduto/:id', async(req, res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Produto foi excluido com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o produto"
        });
    });
});


//Criando uma nova Compra
app.post('/compras', async(req,res) =>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Compra criada com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

//Consultar todas as compras
app.get('/listacompras', async(req, res)=>{
    await compra.findAll({
        raw: true
    }).then(function(compras){
        res.json({compras})
    });
});


//Consultar uma unica compra
app.get('/compra/:id', async(req, res)=>{
    await compra.findByPk(req.params.id)
    .then(comp =>{
        return res.json({
            error: false,
            comp
        });
    }).catch(function(error){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado!"
        });
    });
});


//Att uma compra
app.put('/AttCompra', async(req, res)=>{
    await compra.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Dados da compra alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração da compra."
        });
    });
});


//Deletar uma compra
app.get('/excluirCompra/:id', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra excluida com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a compra"
        });
    });
});

//inserindo itemcompras
app.post('/itemcompras', async(req,res) =>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "item criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

//Consultar todos os itens comprados

app.get('/listaitenscompras', async(req, res)=>{
    await itemcompra.findAll({
        raw: true
    }).then(function(itenscompra){
        res.json({itenscompra})
    });
});

//Att item comprado
app.put('/compras/:id/edititem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado'
        });
    };

    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: 'Serviço não foi encontrado.'
        });
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: 'Compra foi alterado com sucesso!',
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Erro: não foi possível alterar.'
        });
    });
});


let port = process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
});
