



/* Essa função calcula as notas de todas as 8 culturas, tanto para empresas quanto para usuarios pessoa fisica */
function calcularNota(lista, peso) {
    let soma = lista.reduce(
      (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
      0
    );
    soma = soma.toFixed(2);
    soma = Number(soma);
    return soma;
  }


  /* Essa função determina o id que sera atribuido a cada novo usuario no banco de dados, de forma dinamica e automatizada */
  async function definitionID(storageID, adminBd) {
    var id = 0;
   console.log('entrando no definitionID')
    try {
      const snapshot = await adminBd.firestore().collection(storageID).get();
      if (snapshot.empty) {
        id = 1;
        console.log('case empty')
        // Se não houver documentos na coleção, cria um novo documento com o ID especificado
        await adminBd.firestore().collection(storageID).doc('verification-id').set({ id: id });
        return id;
      } else {
        console.log('case existente')
        const doc = snapshot.docs[0];
        const data = doc.data();
        id = data.id 
        id+=1
        await adminBd.firestore().collection(storageID).doc(doc.id).update({ id: id });
        return id;
      }
    } catch (error) {
    console.log(error)
    }
  }
  
  

/* Essa função verifica se existem id vazios no banco de dados e preenche com novos usuarios,
uma melhoria necessaria é que precisa encotnrar e atribuir ao primeiro encontrado, uma ideia para resolver será 
colocar os id encotrados  em um array e na hora de adcionar o usuario escolher sempre o indice 0 do array*/
  async function verificarLinesUser(admin) {
    try {
      const snapshot = await admin
        .firestore()
        .collection("Perfil Usuario")
        .get();
  
      let userIdx = false;
  
      for (let index = 0; index < snapshot.docs.length; index++) {
        const doc = snapshot.docs[index];
        const userData = doc.data().perfil_do_usuario.dados_do_usuario;
        console.log(userData.user )
        if (userData.user === "disponible") {
         userIdx = userData.id
         // break;
        }
      }
      return userIdx;
    } catch (error) {
      console.error("Erro ao tentar buscar usuário:", error);
      throw error;
    }
}

  

  /*função para registrar novos usuarios pessoas fisica no banco*/ 
  async function addUsuario(admin,rotulo,dado){
    try{

      const usuarioRef = await admin
      .firestore()
      .collection(rotulo)
      .add({
        perfil_do_usuario: dado,
      });
    }catch(error){
      console.log(`Ocorreu o erro ${error} ao tentar salvar o usuario`)
    }
  }


/*   /*função para registrar novos usuarios pessoas fisica no banco*/ 
async function updateUsuario(admin, rotulo, dados) {
    try {
      const snapshot = await admin.firestore().collection(rotulo).get();
  
      snapshot.forEach(async (doc) => {
        const perfil = doc.data().perfil_do_usuario.dados_do_usuario;
        
        if (perfil.user === "disponible") {
          try {
            await doc.ref.update({
              'perfil_do_usuario': {
               
                ...dados  // Novos dados que deseja atualizar
              }
            });
            console.log('Dados do usuário atualizados');
          } catch (err) {
            console.error('Erro na atualização de dados', err);
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
      throw error;
    }
  }
  
   

  
  /*função para registrar novos usuarios pessoas fisica no banco*/ 
  async function addEmpresa(admin,rotulo){
    try{

      const usuarioRef = await admin
      .firestore()
      .collection(rotulo)
      .add({
        perfil_da_empresa: resposta,
      });
    }catch(error){
      console.log('ocorreu um erro ao tentar salvar o usuario')
    }
  }



/* vamos agora criar uma função que deleta usuarios no banco de dados, lembrando que na verdade ao invez de deletar, vamos atribuir o valor 'disponible' para usuario, manter o valor
do id e deixar o fit cultural vazio */
async function deletarUsuario(admin, rotulo, id,dados) {

  try {
    const snapshot = await admin.firestore().collection(rotulo).get();

    snapshot.forEach(async (doc) => {
      const perfilUsuario = doc.data().perfil_do_usuario;
      if (perfilUsuario && perfilUsuario.dados_do_usuario) {
          var dado = perfilUsuario.dados_do_usuario.dados_do_usuario;
          // Restante do seu código aqui
      } else {
          console.error('Perfil do usuário ou dados do usuário não estão definidos');
      }
      
      
      if (dado.id === id) {
        console.log(id)
        try {
          await doc.ref.update({
            'perfil_do_usuario': {
             
              ...dados  // Novos dados que deseja atualizar
            }
          });
          console.log('função atualizou os dados');
        } catch (err) {
          console.error('Erro na atualização de dados', err);
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários', error);
    throw error;
  }
  }
  



  module.exports= {
    calcularNota,
    definitionID,
    verificarLinesUser,
    addUsuario,
    addEmpresa,
    updateUsuario,
    deletarUsuario
  }