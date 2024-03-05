const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
var serviceAccount = require("./services/credential.json");
var admin = require("firebase-admin");
var automate = require("./automate");

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * essa rota faz uma simples verificação para  saber se o servidor está funcionando corretamente
 * retornando a mensagem informando que a api esta no ar
 * 
 */
app.get("/verification", (req, res) => {
  res.json({ message: "Api no ar" });
});




/**
 * Essa rota retorna todas as rotas disponiveis na api
 */

app.get("/all-routes", (req, res) => {
  res.json(automate.allRoutes());
});




/**
 * Esta rota salva um usuario no banco de dados, os dados serão recebidos no corpo da requisição
 */

app.post("/rh/perfil/usuario/fitcultural", async (req, res) => {
  try {
    var verification = false;
    var id = await automate.verificarLinesUser(admin, "Perfil Usuario");

    if (id === false) {
      id = await automate.definitionID("id-usuario", admin);
      verification = false;
    } else {
      verification = true;
      id = await automate.verificarLinesUser(admin, "Perfil Usuario");
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

    if (!verification) {
      await automate.addUsuario(admin, "Perfil Usuario", resposta);
    } else {
      await automate.updateUsuario(admin, "Perfil Usuario", resposta);
    }

    res.json({
      message: `Usuario ${resposta.dados_do_usuario.user} registrado com sucesso!`,
    });
  } catch (error) {
    res.json({
      message: `Ocorreu um erro ao tentar registrar ${resposta.user} no banco de dados!`
    });
  }
});




/**
 * Essa rota salva uma empresa no banco de dados, os dasos serão enviados no corpo da requisição
 */

app.post("/rh/perfil/empresa/fitcultural", async (req, res) => {
  try {
    var verification = false;
    var id = await automate.verificarLinesUser(admin, "Perfil Empresa");

    if (id == false) {
      id = await automate.definitionID("id-empresa", admin);
      verification = false;
    } else {
      verification = true;
      id = await automate.verificarLinesUser(admin, "Perfil Empresa");
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

    if (!verification) {
      await automate.addUsuario(admin, "Perfil Empresa", resposta);
    } else {
      await automate.updateUsuario(admin, "Perfil Empresa", resposta);
    }

    res.json({
      message: `Empresa ${resposta.dados_do_usuario.user} registrada com sucesso`,
    });
  } catch (error) {
    res.json({
      message: `Ocorreu um erro ao tentar registrar ${resposta.user} no banco de dados!`
    });
  }
});




/**
 * Essa rota do tipo get retorna todos os usuarios com seus respectivos fit cultural salvo no banco de dados 
 */

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
    return res.status(400).send({message: ` Erro ${err.message} ao buscar usuarios!` });
  }
});




/**
 * essa rota get retorna todos as empresas com seus respectivos fit culturais salvos no banco de dados
 */

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
    return res.status(400).send({message: ` Erro ${err.message} ao buscar Empresas!` });
  }
});



/**
 * Essa rota get retorna o perfil do usuario com id informado no banco de dados 
 */
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




/**
 * Essa rota get retorna o perfil do usuario pelo id informa na requisição
 */

app.get("/rh/perfil/empresa/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);
  try {
    const snapshot = await admin.firestore().collection("Perfil Empresa").get();
    let empresa = null; 
    snapshot.forEach((doc) => {
      if (doc.data().perfil_da_empresa.dados_da_empresa.id == id) {
        empresa = doc.data();
      }
    });

    if (empresa !== null) {
      return res.send(empresa);
    } else {
      return res.status(404).send({message: `usuário não foi encontrado!` });
    }
  } catch (err) {
    return res
      .status(500)
      .send({message: ` Erro ${err.message} ao buscar usuario!` });
  }
});




/**
 * Essa rota put altera o nome usuario cujo o id foi informado na requisição
 */
 
app.put("/rh/perfil/usuario/edit-user/:id", async (req, res) => {
  try{
    var { id } = req.params;
    id = id.slice(1);
    var novoNome = "Cassio Jordan";
    if (!novoNome) {
      res.send({ message: "O valor de nome não pode ser nulo!" });
    } else {
      const snapshot = await admin.firestore().collection("Perfil Usuario").get();
      snapshot.forEach(async (doc) => {
        const perfil = doc.data().perfil_do_usuario.dados_do_usuario;
       if(perfil.id==id){
        await doc.ref.update({
          'perfil_do_usuario.dados_do_usuario.user':novoNome
        })
        res.send({message:`O nome ${novoNome} foi atribuido ao usuário no id ${id}`})
       }
      });
    }}catch(err){
      res.send({message:`O erro ${err.message} ocorreu ao tentar atualizar o nome de usuário`})
    }
});



/**
 * Essa rota put altera o nome da empresa cujo o id foi informado na requisição
 */

app.put("/rh/perfil/usuario/edit-empresa/:id", async (req, res) => {
  try{
  var { id } = req.params;
  id = id.slice(1);
  var novoNome = "Dikma Digital";
  if (!novoNome) {
    res.send({ message: "O valor de nome não pode ser nulo!" });
  } else {
    const snapshot = await admin.firestore().collection("Perfil Empresa").get();
    snapshot.forEach(async (doc) => {
      const perfil = doc.data().perfil_do_usuario.dados_do_usuario;
     if(perfil.id==id){
      await doc.ref.update({
        'perfil_do_usuario.dados_do_usuario.user':novoNome
      })
      res.send({message:`O nome ${novoNome} foi atribuido à empresa no id ${id}`})
     }
    });
  }}catch(err){
    res.send({message:`O erro ${err.message} ocorreu ao tentar atualizar o nome da Empresa`})
  }
});

  


 




/**
 * Essa rota put altera o fit cultural do usuario cujo o id foi informado na requisição
 */

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
  const snapshot = await admin.firestore().collection("Perfil Usuario").get();
  if (snapshot.empty) {
    return res.status(404).json({ error: `Usuario não foi encontrado, verifique o valor digitado e tente novamente! ` });
  }
  const empresa = snapshot.docs[id - 1];
  try {
    await empresa.ref.update({
      "perfil_do_usuario.fitcultural": resposta.fitcultural,
    });

    return res
      .status(200)
      .json({ message: `Fit cultural foi alterado com sucesso!` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Erro ao tentar atualizar o Fit Cultural` });
  }
});





/**
 * Essa rota put altera  o fit cultural da empresa  cujo o id foi informado na requisição
 */

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

  const snapshot = await admin.firestore().collection("Perfil Empresa").get();

  if (snapshot.empty) {
    return res.status(404).json({ message: `empresa não foi localizada no banco de dados!` });
  }

  const empresa = snapshot.docs[id - 1];

  try {
    await empresa.ref.update({
      "perfil_do_usuario.fitcultural": resposta.fitcultural,
    });

    return res
      .status(200)
      .json({ message: `Fit cultural  salvo com sucesso!`});
  } catch (error) {
    return res
      .status(500)
      .json({message:`Erro ao tentar salvar fit cultural da empresa no banco de dados` });
  }
});




/**
 * Essa rota delete deleta o usuario do banco de dados utilizando o id para identificar o usuario
 */

app.delete("/rh/perfil/delete-user/:id", async (req, res) => {
  var { id } = req.params;
  id = id.slice(1);

  try {
    await automate.deletarUsuario(admin, "Perfil Usuario", id);
    res.send({message:`Usuário removido com sucesso da base de dados!`});
  } catch (err) {
    res.send({message:`${err.message} ocorreu ao tentar remover Usuario`});
  }
});





/**
 * Essa rota delete deleta o usuario do banco de dados utilizando o id para identificar a empresa
 */
app.delete("/rh/perfil/delete-empresa/:id", async (req, res) => {
var { id } = req.params;
  id = id.slice(1);

  try {
    await automate.deletarUsuario(admin, "Perfil Empresa", id);
    res.send({message:`A empresa foi removida com sucesso da base de dados`});
  } catch (err) {
    res.send({ message:`${err.message} ocorreu ao tentar remover a empresa` });
  } 
 
});





//rota para testes da api
app.get("/teste", async (req, res) => {

});




app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


