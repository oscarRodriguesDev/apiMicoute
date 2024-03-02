//função para calcular a nota de cada uma das culturas
function calcularNota(lista, peso) {
    let soma = lista.reduce(
      (acumulador, valorAtual) => acumulador + ((valorAtual * 10) / 100) * peso,
      0
    );
    soma = soma.toFixed(2);
    soma = Number(soma);
    return soma;
  }


  async function definitionID(storageID, adminBd) {
    var id = 0;
   
    try {
      const snapshot = await adminBd.firestore().collection(storageID).get();
      if (snapshot.empty) {
        id = 1;
        // Se não houver documentos na coleção, cria um novo documento com o ID especificado
        await adminBd.firestore().collection(storageID).doc('verification-id').set({ id: id });
        return id;
      } else {
        const doc = snapshot.docs[0];
        const data = doc.data();
        id = data.id ? data.id + 1 : 1;
        await adminBd.firestore().collection(storageID).doc(doc.id).update({ id: id });
        return id;
      }
    } catch (error) {
     
    console.log(error)
    }
  }
  
  
  
  
  async function verificarLinesUser(admin) {
    console.log('entrou');
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

      console.log('id agora é: ' + userIdx);
  
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







  module.exports= 
  {
    calcularNota,
    definitionID,
    verificarLinesUser,
    addUsuario,
    addEmpresa,
    updateUsuario,
  }