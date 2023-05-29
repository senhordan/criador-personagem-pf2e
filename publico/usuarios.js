const socket = io();
// var eElement; // some E DOM instance
// var newFirstElement; //element which should be first in E

// eElement.insertBefore(newFirstElement, eElement.firstChild);

// alert
// confirm
// prompt

const popup = query('#popup')
const popup_overlay = query('#popup-overlay')

// popup_overlay.classList.add('active');
// popup.classList.add('active');

// popup_overlay.classList.remove('active');
// popup.classList.remove('active');

const criar_novo_usuario = (nome)=>{
  socket.emit('criar novo usuario', nome)
  const botões = query('.botoes')
  const div = document.createElement('div')
  div.className = 'row'
  div.innerHTML = `
        <div class="col">
          <input type="button" name="usuario" value="${nome}" onclick="abrir_popup(this)" class="botão-usuario">
        </div>
  `
  botões.insertBefore(div, botões.firstChild)
}

const nome_de_usuario = (nome)=>{
  while (true) {
    if (!nome) {
      novo_nome = prompt('Digite o nome de usuario:\n*o nome não pode conter espaços, pontos ou caracteres especiais')
    } else {
      novo_nome = prompt('Digite o novo nome de Usuario:\n*o nome não pode conter espaços, pontos ou caracteres especiais')
    }
    if (!novo_nome) {return}
    if (!novo_nome.includes(' ') && !novo_nome.includes('.') && !novo_nome.includes(',')) {break}
    alert('O nome de usuario não pode conter espaços ou pontos')
  }
  return novo_nome
}

const adicionar_usuario = ()=>{
  const usuario = nome_de_usuario()
  if (!usuario) {return}
  criar_novo_usuario(usuario)
  
}

socket.emit('usuarios')
socket.on('retorno usuarios', (array_usuarios)=>{
  if (typeof array_usuarios == 'string') {array_usuarios = [array_usuarios]}
    array_usuarios.forEach(usuario=>{
      criar_novo_usuario(usuario)
    })
})

const abrir_popup = (elemento)=>{

  popup.innerHTML = `
    <h2>${elemento.value}</h2>
    <button onclick="ver_tokens('${elemento.value}')">Ver Tokens</button>
    <button onclick="editar_usuario('${elemento.value}')">Editar Usuario</button>
    <button onclick="remover_usuario('${elemento.value}')">Remover Usuario</button>
    <button onclick="fechar_popup()">Fechar</button>
  `

  popup_overlay.classList.add('active');
  popup.classList.add('active');
  // query('#tokens').style.display = ''
}

const fechar_popup = ()=>{
  popup_overlay.classList.remove('active');
  popup.classList.remove('active');
}

const editar_usuario = (nome)=>{
  const resposta = confirm('Deseja editar o nome de Usuario?')
  if (!resposta) {return}
  let novo_nome = nome_de_usuario(nome)
  query(`[value=${nome}]`).value = novo_nome
  socket.emit('editar nome de usuario', [nome, novo_nome])
  fechar_popup()
}

const ver_tokens = (nome)=>{
  form([{"nome": "usuario", "valor": nome}])
}

const remover_usuario = (nome)=>{
  const resposta = confirm(`Deseja remover o usuario ${nome}? \nTodos os token serão excluidos, essa ação não poderá ser desfeita`)
  if (!resposta) {return}
  socket.emit('remover usuario', nome)
  query(`[value=${nome}]`).closest('.row').remove()
  fechar_popup()
}

popup_overlay.onclick = fechar_popup

