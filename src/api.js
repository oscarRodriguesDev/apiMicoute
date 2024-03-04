const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
var serviceAccount = require("./services/credential.json");
var admin = require("firebase-admin");
var automate =  require('./automate')

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/*
 *a verificação de que a api esta em pleno funcionamento
 */

app.get("/verification", (req, res) => {
  res.json({ message: "Api no ar" });
});

/*
 *a verificação de que a api esta em pleno funcionamento
 */

app.get("/", (req, res) => {
  res.json({ message: "Api no ar" });
});




/*
 *Abaixo temos todas os meios de salvar o fit cultural do usuario e empresa que é apenas um dos testes
 * comportamentais que devem ser feit
 */
app.post("/rh/perfil/usuario/fitcultural", async (req, res) => {

  try {
    var verification =  false;
    var id = await automate.verificarLinesUser(admin)
  
    if(id===false){
      id= await automate.definitionID('id-usurio',admin)
      verification = false
    
    }else{
      verification = true
      id = await automate.verificarLinesUser(admin)
    }

    var user = `usuario-${id}`;
    var inovacao = automate.calcularNota([5, 4, 6, 1, 3, 5], 2.08);
    var autonomia = automate.calcularNota([7, 5, 4, 9, 1], 2.5);
    var competicao = automate.calcularNota([5, 4, 4, 9], 3.12);
    var meritocracia = automate.calcularNota([1, 4, 2, 9], 3.12);
    var estabilidade = automate.calcularNota([1, 3, 8, 10], 3.12);
    var ordem = automate.calcularNota([4, 5, 3, 7], 3.12);
    var acolhimento = automate.calcularNota([1, 3, 5, 7, 9, 2], 2.08);
    var proposito = automate.calcularNota([7, 9, 5, 1], 3.12);

    //calculo percentual
    var total =
      inovacao +
      autonomia +
      competicao +
      meritocracia +
      estabilidade +
      ordem +
      acolhimento +
      proposito;
    Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
    Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
    Number((competicao = ((competicao / total) * 100).toFixed(2)));
    Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
    Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
    Number((ordem = ((ordem / total) * 100).toFixed(2)));
    Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
    Number((proposito = ((proposito / total) * 100).toFixed(2)));

    const data = {
      id,
      user,
      inovacao,
      autonomia,
      competicao,
      meritocracia,
      estabilidade,
      ordem,
      acolhimento,
      proposito,
    };
    //respostas do fit cultural
    const resposta = {
      dados_do_usuario: {
        id: data.id,
        user: data.user,
      },
      fitcultural: {
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

 
    if(!verification){
      
      await automate.addUsuario(admin,'Perfil Usuario',resposta)
    }else{
      
      await automate.updateUsuario(admin,'Perfil Usuario',resposta)  
    } 
  
    res.json({
      message: `Usuario${resposta.dados_do_usuario.user} registrado com sucesso!`,
    });
  } catch (error) {
    res.json({
     error:error.message
    });
  }
});




app.post("/rh/perfil/empresa/fitcultural", async (req, res) => {

 
  try {
    var verification =  false;
    var id = await automate.verificarLinesUser(admin)
  
    if(id==false){
      id= await automate.definitionID('id-empresa',admin)
      verification = false
    
    }else{
      verification = true
      id = await automate.verificarLinesUser(admin)
    }

    var user = `empresa-${id}`;
    var inovacao = automate.calcularNota([5, 4, 6, 1, 3, 5], 2.08);
    var autonomia = automate.calcularNota([7, 5, 4, 9, 1], 2.5);
    var competicao = automate.calcularNota([5, 4, 4, 9], 3.12);
    var meritocracia = automate.calcularNota([1, 4, 2, 9], 3.12);
    var estabilidade = automate.calcularNota([1, 3, 8, 10], 3.12);
    var ordem = automate.calcularNota([4, 5, 3, 7], 3.12);
    var acolhimento = automate.calcularNota([1, 3, 5, 7, 9, 2], 2.08);
    var proposito = automate.calcularNota([7, 9, 5, 1], 3.12);

    //calculo percentual
    var total =
      inovacao +
      autonomia +
      competicao +
      meritocracia +
      estabilidade +
      ordem +
      acolhimento +
      proposito;
    Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
    Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
    Number((competicao = ((competicao / total) * 100).toFixed(2)));
    Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
    Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
    Number((ordem = ((ordem / total) * 100).toFixed(2)));
    Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
    Number((proposito = ((proposito / total) * 100).toFixed(2)));

    const data = {
      id,
      user,
      inovacao,
      autonomia,
      competicao,
      meritocracia,
      estabilidade,
      ordem,
      acolhimento,
      proposito,
    };
    //respostas do fit cultural
    const resposta = {
      dados_do_usuario: {
        id: data.id,
        user: data.user,
      },
      fitcultural: {
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

 
    if(!verification){
      
      await automate.addUsuario(admin,'Perfil Empresa',resposta)
    }else{
      
      await automate.updateUsuario(admin,'Perfil Empresa',resposta)
    
     
    } 
  
    res.json({
      message: `Empresa ${resposta.dados_do_usuario.user} registrada com sucesso`,
    });
  } catch (error) {
    res.json({
     error:error.message
    });
  }
});






/* retorna todos os fit cultural dos usuários */
app.get("/rh/perfil/usuarios/", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("Perfil Usuario").get();
    let fitUsers = [];
    snapshot.forEach((doc) => {
      fitUsers.push(doc.data());
    });
    return res.status(200).send(fitUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ erro: "Values not Found", error: err });
  }
});



/* Retorna o fit culturual de todas as empresas */
app.get("/rh/perfil/empresa/", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("Perfil Empresa").get();
    let fitEmpresas = [];
    snapshot.forEach((doc) => {
      fitEmpresas.push(doc.data());
    });
    return res.status(200).send(fitEmpresas);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ erro: "Values not Found", error: err });
  }
});



/* Retorna o fit cultural do usuario informado no id */
app.get("/rh/perfil/usuarios/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);
  try {
    const snapshot = await admin.firestore().collection("Perfil Usuario").get();
    let usuario = null; // Inicializamos como null, para verificar se encontramos um usuário
    snapshot.forEach((doc) => {
      if (doc.data().perfil_do_usuario.dados_do_usuario.id == id) {
        usuario = doc.data();
      }
    });

    if (usuario !== null) {
      // Se encontramos um usuário, enviamos a resposta com os dados do usuário
      return res.send(usuario);
    } else {
      // Se não encontramos um usuário, enviamos a resposta indicando que não foi encontrado
      return res.status(404).send("Usuário não encontrado!");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ erro: "Erro ao buscar os valores", error: err });
  }
});



/* Retorna o fit cultural da empresa pelo id */
app.get("/rh/perfil/empresa/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);
  try {
    const snapshot = await admin.firestore().collection("Perfil Empresa").get();
    let empresa = null; // Inicializamos como null, para verificar se encontramos um usuário
    snapshot.forEach((doc) => {
      if (doc.data().perfil_da_empresa.dados_do_empresa.id == id) {
        empresa = doc.data();
      }
    });

    if (empresa !== null) {
      // Se encontramos um usuário, enviamos a resposta com os dados do usuário
      return res.send(empresa);
    } else {
      // Se não encontramos um usuário, enviamos a resposta indicando que não foi encontrado
      return res.status(404).send("Usuário não encontrado!");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ erro: "Erro ao buscar os valores", error: err });
  }
});




//alterar o nome de usuaio
app.put("/rh/perfil/usuario/edit-user/:id", async (req, res) => {
 
  var { id } = req.params;
  id = id.slice(1);
  var novoNome = "Otavio Lube";
  
  // Verifica se o novo nome foi fornecido
  if (!novoNome) {
    console.log({ error: "O novo nome de usuário não foi fornecido." });
  }
  
  const snapshot = await admin
    .firestore()
    .collection("Perfil Usuario")
    .get();
  
  if (snapshot.empty) {
    console.log({ error: "Usuário não encontrado.", id: id });
    return res.status(404).json({ error:` Usuário  não encontrado. `});
  }
  
  const usuario = snapshot.docs[id-1]; // Obtém o primeiro documento retornado pela consulta
  
  try {
    await usuario.ref.update({
      "perfil_do_usuario.dados_do_usuario.user": novoNome
    });
    console.log("Nome de usuário atualizado com sucesso.");
    return res.status(200).json({ message: "Nome de usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o nome de usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor ao atualizar o nome de usuário." });
  }
  
});



//alterar nome da empresa
app.put("/rh/perfil/usuario/edit-empresa/:id", async (req, res) => {
 
  var { id } = req.params;
  id = id.slice(1);
  var novoNome = "Canguru Supermercadocls";
  
  // Verifica se o novo nome foi fornecido
  if (!novoNome) {
    console.log({ error: "O novo nome de usuário não foi fornecido." });
  }
  
  const snapshot = await admin
    .firestore()
    .collection("Perfil Empresa")
    .get();
  
  if (snapshot.empty) {
    console.log({ error: "Usuário não encontrado.", id: id });
    return res.status(404).json({ error:` Usuário  não encontrado. `});
  }
  
  const usuario = snapshot.docs[id-1]; // Obtém o primeiro documento retornado pela consulta
  
  try {
    await usuario.ref.update({
      "perfil_da_empresa.dados_do_empresa.user": novoNome
    });
    console.log("Nome de usuário atualizado com sucesso.");
    return res.status(200).json({ message: "Nome de usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar o nome de usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor ao atualizar o nome de usuário." });
  }
  
});



//alterar fit cultural de usuario
app.put("/rh/perfil/usuario/edit-fitcult-usuario/:id", async (req, res) => {

  //valores serão recebidos pela requisição
  var inovacao = calcularNota([1, 3, 6, 1, 3, 5], 2.08);
  var autonomia = calcularNota([7, 5, 3, 4, 1], 2.5);
  var competicao = calcularNota([5, 2, 7, 9], 3.12);
  var meritocracia = calcularNota([1, 1, 2, 5], 3.12);
  var estabilidade = calcularNota([1, 3, 8, 17], 3.12);
  var ordem = calcularNota([4, 5, 3, 9], 3.12);
  var acolhimento = calcularNota([1, 3, 5, 7, 9, 2], 2.08);
  var proposito = calcularNota([7, 1, 5, 8], 3.12);

  //calculo percentual
  var total =
    inovacao +
    autonomia +
    competicao +
    meritocracia +
    estabilidade +
    ordem +
    acolhimento +
    proposito;
  Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
  Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
  Number((competicao = ((competicao / total) * 100).toFixed(2)));
  Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
  Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
  Number((ordem = ((ordem / total) * 100).toFixed(2)));
  Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
  Number((proposito = ((proposito / total) * 100).toFixed(2)));

  const data = {
    inovacao,
    autonomia,
    competicao,
    meritocracia,
    estabilidade,
    ordem,
    acolhimento,
    proposito,
  };
  //respostas do fit cultural
  const resposta = {
    fitcultural: {
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
//valores acima vão ser recebidos no corpo da requisição
 
  var { id } = req.params;
  id = id.slice(1);
 
  
  const snapshot = await admin
    .firestore()
    .collection("Perfil Usuario")
    .get();
  
  if (snapshot.empty) {
    return res.status(404).json({ error:`Usuário não foi localizado! `});
  }
  
  const empresa = snapshot.docs[id-1]; 
  
  try {
    await empresa.ref.update({
      "perfil_do_usuario.fitcultural": resposta.fitcultural
    });
   
    return res.status(200).json({ message: "fit cultural atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar o Fit cultural", error);
    return res.status(500).json({ error: "Erro interno do servidor", erro:error });
  }
  
});


//alterar fit cultural da empresa
app.put("/rh/perfil/usuario/edit-fitcult-empresa/:id", async (req, res) => {

  //valores serão recebidos pela requisição
  var inovacao = calcularNota([1, 3, 6, 1, 3, 5], 2.08);
  var autonomia = calcularNota([7, 5, 3, 4, 1], 2.5);
  var competicao = calcularNota([5, 2, 7, 9], 3.12);
  var meritocracia = calcularNota([1, 1, 2, 5], 3.12);
  var estabilidade = calcularNota([1, 3, 8, 17], 3.12);
  var ordem = calcularNota([4, 5, 3, 9], 3.12);
  var acolhimento = calcularNota([1, 3, 5, 7, 9, 2], 2.08);
  var proposito = calcularNota([7, 1, 5, 8], 3.12);

  //calculo percentual
  var total =
    inovacao +
    autonomia +
    competicao +
    meritocracia +
    estabilidade +
    ordem +
    acolhimento +
    proposito;
  Number((inovacao = ((inovacao / total) * 100).toFixed(2)));
  Number((autonomia = ((autonomia / total) * 100).toFixed(2)));
  Number((competicao = ((competicao / total) * 100).toFixed(2)));
  Number((meritocracia = ((meritocracia / total) * 100).toFixed(2)));
  Number((estabilidade = ((estabilidade / total) * 100).toFixed(2)));
  Number((ordem = ((ordem / total) * 100).toFixed(2)));
  Number((acolhimento = ((acolhimento / total) * 100).toFixed(2)));
  Number((proposito = ((proposito / total) * 100).toFixed(2)));

  const data = {
    inovacao,
    autonomia,
    competicao,
    meritocracia,
    estabilidade,
    ordem,
    acolhimento,
    proposito,
  };
  //respostas do fit cultural
  const resposta = {
    fitcultural: {
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
//valores acima vão ser recebidos no corpo da requisição
 
  var { id } = req.params;
  id = id.slice(1);
 
  
  const snapshot = await admin
    .firestore()
    .collection("Perfil Empresa")
    .get();
  
  if (snapshot.empty) {
    return res.status(404).json({ error:`empresa não foi localizado! `});
  }
  
  const empresa = snapshot.docs[id-1]; 
  
  try {
    await empresa.ref.update({
      "perfil_da_empresa.fitcultural": resposta.fitcultural
    });
   
    return res.status(200).json({ message: "fit cultural atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar o Fit cultural", error);
    return res.status(500).json({ error: "Erro interno do servidor", erro:error });
  }
  
});


app.delete("/rh/perfil/delete-user/:id", async (req, res) => {

const resposta = {
  fitcultural: {
   
  },
};

var { id } = req.params;
id = id.slice(1);
const snapshot = await admin
.firestore()
.collection("Perfil Usuario")
.get();

let userIdx = false;

for (let index = 0; index < snapshot.docs.length; index++) {
const doc = snapshot.docs[index];
const userData = doc.data()
console.log(userData.perfil_do_usuario)

}

res.send('teste')
});



//deletar resultado do fit cultural da empresa
app.delete("/rh/perfil/delete-empresa/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `vai deletar a empresa no banco` });
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});



app.get('/teste', async (req,res)=>{
  var id = await automate.updateUsuario(admin,'Perfil Usuario' ,'atualizado')
res.send({id})
})