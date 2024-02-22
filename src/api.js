const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
var serviceAccount = require("./services/credential.json");
var admin = require("firebase-admin");

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//salva o fit cultural do usuario informado no corpo da requisição
app.post("/user/fitcultural", async (req, res) => {
  /*   const {inovação,autonomia,competicao,meritocracia,estabilidade,ordem,acolhimento,proposito} = req.body; */
//a requisição deve enviar os arrays, o id e o usuario que seão tratados abaixo
  try {
    var id = "141sdgaer5gsdfe4154dsed44ul11aaw15g5ru1";
    var user = "Oscar";
    var inovacao = calcularNota([5,4,6,1,3,5], 2.08);
    var autonomia = calcularNota([7,5,4,9,1], 2.5);
    var competicao = calcularNota([5,4,4,9], 3.12);
    var meritocracia = calcularNota([1,4,2,9], 3.12);
    var estabilidade = calcularNota([1,3,8,10], 3.12);
    var ordem = calcularNota([4,5,3,7], 3.12);
    var acolhimento = calcularNota([1,3,5,7,9,2], 2.08);
    var proposito = calcularNota([7,9,5,1], 3.12);
    
    //calculo percentual
    var total = inovacao +autonomia+competicao+meritocracia+estabilidade+ordem+acolhimento+proposito
    Number(inovacao = ((inovacao/total)*100).toFixed(2))
    Number(autonomia = ((autonomia/total)*100).toFixed(2))
    Number(competicao = ((competicao/total)*100).toFixed(2))
    Number(meritocracia = ((meritocracia/total)*100).toFixed(2))
    Number(estabilidade = ((estabilidade/total)*100).toFixed(2))
    Number(ordem = ((ordem/total)*100).toFixed(2))
    Number(acolhimento = ((acolhimento/total)*100).toFixed(2))
    Number(proposito = ((proposito/total)*100).toFixed(2))
    
    const data = { user,inovacao,autonomia,competicao,meritocracia,estabilidade,ordem,acolhimento,proposito,};
    //respostas do fit cultural
const fitCultural = {
  dados: {
    user: data.user,},
  resposta: {
    inovacao: data.inovacao,
    autonomia: data.autonomia,
    competição: data.competicao,
    meritocracia: data.meritocracia,
    estabilidade: data.estabilidade,
    ordem: data.ordem,
    acolhimento: data.acolhimento,
    proposito: data.proposito,
  },
};
const usuarioRef = await admin.firestore().collection('Fit Cultural Usuarios').add({
 fitCultural
});
    res.json({
      message: `Fit cultural de ${fitCultural.dados.user} salvo com sucesso na base de dados`,
    
    });
  } catch (error) {
    res.json({
      message: `err 400 NOT FOUND`,
    });
  }
});





//salva o fit cultural da empresa informado no corpo da requisição
app.post("/companies/fitcultural", async (req, res) => {
  try {
    var id = "141sdgaer5gsdfe4154dsed44ul11aaw15g5ru1";
    var empresa = "Pelicano";
    var inovacao = calcularNota([2,4,4,2,1,6], 2.08);
    var autonomia = calcularNota([2,5,5,7,6], 2.5);
    var competicao = calcularNota([5,1,3,9], 3.12);
    var meritocracia = calcularNota([5,2,1,2], 3.12);
    var estabilidade = calcularNota([5,8,3,6], 3.12);
    var ordem = calcularNota([5,2,1,8], 3.12);
    var acolhimento = calcularNota([5,5,7,9,1,2], 2.08);
    var proposito = calcularNota([6,4,2,3], 3.12);

      //calculo percentual
      var total = inovacao +autonomia+competicao+meritocracia+estabilidade+ordem+acolhimento+proposito
      Number(inovacao = ((inovacao/total)*100).toFixed(2))
      Number(autonomia = ((autonomia/total)*100).toFixed(2))
      Number(competicao = ((competicao/total)*100).toFixed(2))
      Number(meritocracia = ((meritocracia/total)*100).toFixed(2))
      Number(estabilidade = ((estabilidade/total)*100).toFixed(2))
      Number(ordem = ((ordem/total)*100).toFixed(2))
      Number(acolhimento = ((acolhimento/total)*100).toFixed(2))
      Number(proposito = ((proposito/total)*100).toFixed(2))


    const data = { empresa,inovacao,autonomia,competicao,meritocracia,estabilidade,ordem,acolhimento,proposito,};
   
     //respostas do fit cultural
const fitCultural = {
  dados: {
    empresa: data.empresa,},
  resposta: {
    inovacao: data.inovacao,
    autonomia: data.autonomia,
    competição: data.competicao,
    meritocracia: data.meritocracia,
    estabilidade: data.estabilidade,
    ordem: data.ordem,
    acolhimento: data.acolhimento,
    proposito: data.proposito,
  },
};

//salvando no banco de dados
const usuarioRef = await admin.firestore().collection('Fit Cultural Empresas').add({
  fitCultural
 });

res.json({
  message:`Fit Cultural da Empresa ${fitCultural.dados.empresa} salvo com sucesso na base de dados`
})



  }catch(Error){
    res.json({
      message:'erro 400 NOT FOUND'
    })
  }
});









//apenas uma verificação de que a api esta funcionando
app.get("/verification", (req, res) => {
  res.json({ message: "Api no ar" });
});

//retorna todos os fitcultural de usuario
app.get("/fitcultalusers", (req, res) => {
  res.json({ message: "fit cultural de todos os usuarios" });
});

//retorna todos os fit cultural das empresas
app.get("/fitcultalcompanies", (req, res) => {
  res.json({ message: "fit cultural de todas as empresas" });
});

//retorna o resultado do fit cultural do usuario infomado na url da requisição
app.get("/result/user:id", (req, res) => {
  const { username } = req.params;
  res.json({
    message: `quando estiver pronto vai retornar o fit cultural do usuario ${username}`,
  });
});

//retorna o resultado do fit cultural da empresa infomado na url da requisição
app.get("/result/companies:id", (req, res) => {
  const { username } = req.params;
  res.json({
    message: `quando estiver pronto vai retornar o fit cultural do usuario ${username}`,
  });
});

//altera o valor do teste do usuario utilizando o id para identificá-lo
app.put("/user/editresult:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    message: `Quando estiver funcionando vai alterar o teste salvo no banco de dados`,
    data: body,
  });
});

//altera o valor do teste da empresa  utilizando o id para identificá-la
app.put("/companies/editresult:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    message: `Quando estiver funcionando vai alterar o teste salvo no banco de dados`,
    data: body,
  });
});

//deletar resultado do fit cultural do usuario
app.delete("/del/resultado/user/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `vai deletar o usuario no banco` });
});

//teste

//deletar resultado do fit cultural da empresa
app.delete("/del/resultado/companies/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `vai deletar a empresa no banco` });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

function calcularNota(lista, peso) {
  let soma = lista.reduce(
    (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
    0
  );
  soma =  soma.toFixed(2)
  soma = Number(soma)
  return soma;
}

