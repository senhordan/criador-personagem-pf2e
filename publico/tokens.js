const socket = io();
const usuario = window.location.href.replace(/.*usuario\//, '')
const popup = query('#popup')
const popup_overlay = query('#popup-overlay')

const enviar_imagem = (token)=>{
  if (!confirm('Deseja alterar a imagem do token?\n*Essa ação não poderá ser desfeita')) {return}
  var arquivo = document.querySelector(`[type="file"`).files[0];
  var formData = new FormData();
  formData.append("imagem", arquivo);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", `/usuario/${usuario}/${token}/upload`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Imagem enviada com sucesso!");
    }
  };
  xhr.send(formData);
  fechar_popup()
  location.reload()
}



const abrir_token = (token)=>{
  console.log(`abrir ${token}`)  
  form([{"nome": "usuario", "valor": usuario}, {"nome": "token", "valor": token}])

  // const form = document.createElement('form')
  // const input = document.createElement('input')
  // form.method = 'post'
  // form.style.display = 'none'
  // input.name = 'token'
  // input.value = elemento.dataset.token
  // form.appendChild(input)
  // document.body.appendChild(form)
  // form.submit()

}

const remover_token = (nome)=>{
  const resposta = confirm(`Deseja mesmo remover o token "${nome}"? Essa ação não poderá ser desfeita`)
  if (!resposta) {return}
  socket.emit('remover token', [usuario, nome])
  query(`[data-token="${nome}"]`).closest('.row').remove()
  fechar_popup()
}

const criar_token = ()=>{
  const token_nome = Math.round(Math.random()*1000000000)
  socket.emit('criar token', [usuario, token_nome])

  return token_nome
}

const trocar_imagem = (elemento)=>{
  elemento.src = '../publico/img/undefined.png'
}

const editar_token = (token_nome)=>{
  elemento_token = query(`[data-token="${token_nome}"]`)
  fechar_popup()
  popup_editar(elemento_token)
}

const editar_nome = (token_nome)=>{
  const div = query(`[data-token="${token_nome}"]`)
  const label = div.querySelector('label')
  const img = div.querySelector('img')
  const ancora = div.querySelector('a')

  const resposta = confirm('Deseja editar o nome do Token?')
  if (!resposta) {return}
  const novo_nome = nome_de_token()
  if (!novo_nome) {return}

  div.dataset.token = novo_nome
  label.innerText = novo_nome
  img.src = img.src.replace(token_nome, novo_nome)
  ancora.href = ancora.href.replace(token_nome, novo_nome)
  socket.emit('editar token nome', [usuario, token_nome, novo_nome])
  fechar_popup()
}
const editar_imagem = (token_nome)=>{
  popup_imagem(token_nome)
}

const nome_de_token = (nome)=>{
  while (true) {
    if (!nome) {
      novo_nome = prompt('Digite o nome do Token:\n*o nome não pode pontos ou caracteres especiais')
    } else {
      novo_nome = prompt('Digite o novo nome do Token:\n*o nome não pode pontos ou caracteres especiais')
    }
    if (!novo_nome) {return}
    if (!novo_nome.includes('.') && !novo_nome.includes(',')) {break}
    alert('O nome do Token não pode ou pontos')
  }
  return novo_nome
}

const adicionar_token = (token_nome)=>{
  if (!token_nome) {
    token_nome = criar_token()
  }
  const div_tokens = query('#tokens')
  const div = document.createElement('div')
  div.className = 'row'
  div.innerHTML = `
    <div class="col" data-token="${token_nome}">
      <label onclick="abrir_popup(this)">${token_nome}</label><br>
      <a href="/usuario/${usuario}/${token_nome}"><img class="token-img" src="../publico/img/${token_nome}.png" onerror="trocar_imagem(this)"></a>
    </div>
  `

  div_tokens.insertBefore(div, div_tokens.firstChild)

}

socket.emit('tokens', usuario)
socket.once('retorno tokens', tokens_array=>{
  tokens_array.forEach(token=>{
    adicionar_token(token.nome)
  })
})

const abrir_popup = (elemento)=>{
  const div = elemento.closest('.col')
  const token_nome = div.dataset.token

  let botão_remover = `<button onclick="remover_token('${token_nome}')">Remover Token</button>`

  if (token_nome == 'undefined') {botão_remover = ''}
  popup.innerHTML = `
    <h2>${token_nome}</h2>
    <button onclick="editar_token('${token_nome}')">Editar Token</button>
    ${botão_remover}
    <button onclick="fechar_popup()">Fechar</button>
`

  popup_overlay.classList.add('active');
  popup.classList.add('active');
}

const popup_editar = (elemento)=>{
  // console.log(elemento)
  const token_nome = elemento.dataset.token

  popup.innerHTML = `
    <h2>${token_nome}</h2>
    <button onclick="editar_nome('${token_nome}')">Editar Nome</button>
    <button onclick="editar_imagem('${token_nome}')">Editar Imagem</button><br>
    <button onclick="fechar_popup()">Fechar</button>
`

  popup_overlay.classList.add('active');
  popup.classList.add('active');
}

const popup_imagem = (token_nome)=>{
  const token = query(`[data-token="${token_nome}"]`)

  popup.innerHTML = `
    <h2>${token_nome}</h2>
    <form method="post" enctype="multipart/form-data">
      <input type="file">
      <input type="button" value="Enviar" onclick="enviar_imagem('${token_nome}')"></input>
      <input type="button" value="Fechar" onclick="fechar_popup()"></input>
    </form>
`

  popup_overlay.classList.add('active');
  popup.classList.add('active');
}

const fechar_popup = ()=>{
  popup_overlay.classList.remove('active');
  popup.classList.remove('active');
}

popup_overlay.addEventListener('click', fechar_popup)
