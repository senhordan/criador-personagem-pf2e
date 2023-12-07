const socket = io()
// const url = new URL(window.location.href); 
// const getParam = url.searchParams.get('foo'); 
// const url_base = window.location.href
// const url = url_base.replace(/.*usuario\//, '')
// const usuario = url.split('/')[0]
// const token = url.split('/')[1]

const url = ()=>{
  return window.location.href
}
const url_base = ()=>{
  return url().replace(/.*usuario\//, '')
}

const usuario = ()=>{
  return url().replace(/.*usuario\//, '').split('/')[0]
}
const token = ()=>{
  return url().replace(/.*usuario\//, '').split('/')[1]
}

// inportar json

const importar = (obj)=>{
  document.querySelector('title').innerText = token()
  const salvar_tudo = ()=>{
    query('[value="salvar"]').forEach(i=>{i.click()})
  }

  let habilidades = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=HABILIDADE_)\d*_/g))
  // console.log(habilidades)
  habilidades.forEach(i=>{adicionar_habilidade()})

  let itens = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=ITEM_)\d*_/g))

  itens.forEach(i=>{adicionar_item()})

  let ações = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=ACAO_)\d*_/g))

  ações.forEach(i=>{adicionar_ação()})


  let ataques = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=ATAQUE_)\d*_/g))

  ataques.forEach(i=>{

    adicionar_ataque()

    regex = new RegExp(`(?<=DANO_${i}_)\\d`, 'g')

    let danos = remover_duplicatas(Object.keys(obj).join('\n').match(regex))

    danos.forEach(ii=>{
      if (ii != 1) {
        adicionar_dano(query(`[data-ataque="ATAQUE_${i}"] [onclick="adicionar_dano(this)"]`))
      }
    })

  })

  Object.entries(obj).forEach(i=>{
    // console.log(i)
      let input = document.querySelector(`[name=${i[0]}]`)
      console.log(`[name=${i[0]}]`)
      if (input.type == 'radio' || input.type == 'checkbox') {
        // console.log()
        query(`[name=${input.name}][value="${i[1]}"]`).checked = 1
      } else {
        input.value = i[1]
      }
      
  })

  salvar_tudo()

  // query('#help_atributos .subtitulo').style.display = 'none'

  ajustar_tamanho_input()

}

exportar_ataques = ()=>{
  document.querySelectorAll('[data-ataque]').forEach(ataque=>{
      console.log(ataque.querySelector('[name*=NOME]').value)
      console.log(ataque.querySelector('[data-soma-ataque]').innerText)
      ataque.querySelectorAll('[data-soma-dano]').forEach(dano=>{
          console.log(dano.innerText)
      })
  })
}
let ficha = {}

socket.emit('ficha de personagem', url_base().split('/'))
socket.on('retorno ficha', json=>{
  ficha = json
  importar(json)
})

const proficiencias = {
  'destreinado': ()=>{return +0},
  'treinado': ()=>{return 2+Number(NIVEL.value)},
  'especialista': ()=>{return 4+Number(NIVEL.value)},
  'mestre': ()=>{return 6+Number(NIVEL.value)},
  'lendario': ()=>{return 8+Number(NIVEL.value)},
}

const atributos = ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma']

const pericias = ['Acrobatismo', 'Arcanismo', 'Atletismo', 'Diplomacia', 'Dissimulação', 'Furtividade', 'Intimidação', 'Ladroagem', 'Manufatura', 'Medicina', 'Natureza', 'Ocultismo', 'Performance', 'Religião', 'Saber 1', 'Saber 2', 'Sobrevivência', 'Sociedade']

const pericias_atb_base = {
  'Acrobatismo': 'Destreza',
  'Arcanismo': 'Inteligência',
  'Atletismo': 'Força',
  'Diplomacia': 'Carisma',
  'Dissimulação': 'Carisma',
  'Furtividade': 'Destreza',
  'Intimidação': 'Carisma',
  'Ladroagem': 'Destreza',
  'Manufatura': 'Inteligência',
  'Medicina': 'Sabedoria',
  'Natureza': 'Sabedoria',
  'Ocultismo': 'Inteligência',
  'Performance': 'Carisma',
  'Religião': 'Sabedoria',
  'Saber 1': 'Inteligência',
  'Saber 2': 'Inteligência',
  'Sobrevivência': 'Sabedoria',
  'Sociedade': 'Inteligência',
}
const gerar_ficha = ()=>{
  const container = query('.container.visualizar')
  // if (obj.SENTIDOS) {sentidos = '<></>'+obj.SENTIDOS}
  let traços = ''
  if (obj.TRACOS) {
    obj.TRACOS.replaceAll(' ', '').split(',').forEach(i=>{traços+=`<span class="traços">${i}</span>`})
  }
  let idiomas = ''
  if (obj.IDIOMAS) {
    idiomas = `<strong>Idiomas</strong> ${idiomas}`
  }
  let pericias = ''
  query('#pericias .row').forEach((i, n)=>{
    if (n/2) {}
    // console.log(n/2)
  })
  container.innerHTML = [
    `<div class="row nome-nivel">`,
    `  <div class="col"><h2>${obj.NOME}</h2></div>`,
    `  <div class="col"><h2>${obj.NIVEL}</h2></div>`,
    `</div>`,
    `<hr>`,
    `<div class="row">${traços}</div>`,
    `<div class="row"><strong>Percepção</strong> +${obj.PERCEPCAO}; ${obj.SENTIDOS}</div>`,
    `<div class="row"></div>`,
    `<div class="row">pericias</div>`,
    `<div class="row">atributos mod</div>`,
    `<hr>`,
    `<div class="row">CA; Salvamentos</div>`,
    `<div class="row">PV; imunidades; fraquezas; resistências</div>`,
    `<div class="row">Reações</div>`,
    `<hr>`,
    `<div class="row">velocidade</div>`,
    `<div class="row">corpo a corpo [ação] ataque poderoso  +10 +5 +0 (traços), dano 2d10+4 (tipo)</div>`,
    `<div class="row">ataques</div>`,
    `<div class="row">ações</div>`,
    `<div class="row">ações livres</div>`,
    `<div class="row"></div>`
    ].join('')
}
const modo_edição = ()=>{
  query('.container.editar').style.display = ''
  query('.container.visualizar').style.display = 'none'

}
const modo_visualização = ()=>{
  query('.container.visualizar').style.display = ''
  query('.container.editar').style.display = 'none'
  gerar_ficha()
}

const editar_visualizar = ()=>{
  const col = query('#editar_visualizar .col')

  if (col.innerText == 'Editar') {
    col.innerText = 'Visualizar'
    col.className = 'col table_titulo editar'
    console.log('modo edição')
    modo_edição()

  } else {
    col.innerText = 'Editar'
    col.className = 'col table_titulo visualizar'
    console.log('modo visualizar')
    modo_visualização()
  }
}

let obj

query('#ficha-de-personagem').onsubmit = (event)=> {
  event.preventDefault();
  const data = new FormData(event.target);
  obj = Object.fromEntries(data.entries());

  // let igual = true

  // let obj_keys = Object.keys(obj).sort().join(' ')
  // let obj_values = Object.values(obj).sort().join(' ')
  // let obj_txt = [obj_keys, obj_values].join(' ')

  // let ficha_keys = Object.keys(ficha).sort().join(' ')
  // let ficha_values = Object.values(ficha).sort().join(' ')
  // let ficha_txt = [ficha_keys, ficha_values].join(' ')

  if (JSON.stringify(ficha) != JSON.stringify(obj)) {
    console.log('json diferente')
    ficha = obj
    socket.emit('update token', [usuario(), token(), ficha])
  }

  // if (obj_txt != ficha_txt) {
  //   ficha = obj
  //   igual = true
  //   console.log('diferente')
  // }


}

const update_all = ()=>{
  update_modificador_atributo()
  update_salvamentos()
  update_percepção()
  update_CA()
  update_CD_classe()
  update_pericia()
  update_ataques()
  checar_MaxHP()
  query('[type="submit"]').click()
  gerar_ficha()
}

// const update_nome = ()=>{
//   const nome = query(`[name='NOME']`).value
//   console.log(nome)
//   update_all()
// }

//  -------------------------PERCEPÇÃO-------------------------

// const update_nome = ()=>{
//   const nome = query('[name="NOME"]').value
//   console.log(nome)
//   console.log(ficha.NOME)
//   if (nome != ficha.NOME) {
//     const nova_url = url_base().replace(ficha.NOME, nome)
//     update_all()
//     console.log('nome diferente')
//     window.history.pushState('', '', `/usuario/${nova_url}`);

//   }
// }

const update_percepção = ()=>{
  percepção_valor_input = query(`[name='PERCEPCAO']`)
  percepção_bonus_input = query(`[name='PERCEPCAO_SAB_BONUS']`)
  percepção_proficiencia = query(`[name='PERCEPCAO_PROFICIENCIA']:checked`).value
  percepção_item = query(`[name='PERCEPCAO_BONUS_ITEM']`).value

  percepção_bonus_input.value = Number(query(`[name='SAB_MOD']`).value)
  percepção_valor_input.value = Number(percepção_item)+Number(percepção_bonus_input.value)+proficiencias[percepção_proficiencia]()

}

//  -------------------------SALVAMENTO-------------------------

const update_salvamentos = ()=>{
  query('#salvamentos .row:has(table)').forEach(elemento=>{
    const salvamento_valor_input = elemento.querySelectorAll(`input[type='number']`)[0]
    const salvamento_bonus_input = elemento.querySelectorAll(`input[type='number']`)[1]
    const salvamento_item = Number(elemento.querySelectorAll(`input[type='number']`)[2].value)
    const salvamento_proficiencia = elemento.querySelector(`table input:checked`).value

    const atributo_base = salvamento_bonus_input.name.split('_')[1].toUpperCase()

    salvamento_bonus_input.value = Number(query(`[name='${atributo_base}_MOD']`).value)

    salvamento_valor_input.value = salvamento_item+Number(salvamento_bonus_input.value)+proficiencias[salvamento_proficiencia]()

  })
}
//  -------------------------CD DE CLASSE------------------------

const update_CD_classe = ()=>{

    const CD_classe_input = query(`[name='CD_CLASSE']`)

    const CD_classe_bonus_input = query(`[name='CD_CLASSE_ATB_BONUS']`)
    const CD_classe_item = Number(query(`input[name='CD_CLASSE_BONUS_ITEM']`).value)
    const CD_classe_proficiencia = query(`[name='CD_CLASSE_PROFICIENCIA']:checked`).value

    const atributo_base = CD_classe_bonus_input.value

    if (atributo_base == '-') {
      CD_classe_input.value = 10+CD_classe_item+proficiencias[CD_classe_proficiencia]()
    } else {
      // CD_classe_bonus_input.value = Number(query(`[name='${atributo_base}_MOD']`).value)

      CD_classe_input.value = 10+CD_classe_item+proficiencias[CD_classe_proficiencia]()+Number(query(`[name='${atributo_base}_MOD']`).value)

    }


}
//  -------------------------CA-------------------------

const update_CA = ()=>{
  const CA_input = query(`[name='CA']`)
  const CA_proficiencia = query(`[name='CA_PROFICIENCIA']:checked`).value

  query(`[name='CA_DES_BONUS']`).value = Number(query(`[name='DES_MOD']`).value)

  let CA_des_bonus = Number(query(`[name='CA_DES_BONUS']`).value)
  const CA_limite = Number(query(`[name='CA_LIMITE']`).value)
  const CA_bonus_item = Number(query(`[name='CA_BONUS_ITEM']`).value)

  if (CA_limite > 0) {
    if (CA_des_bonus > CA_limite) {CA_des_bonus = CA_limite}
  }

  CA_input.value = 10+CA_des_bonus+CA_bonus_item+proficiencias[CA_proficiencia]()
}

const checar_MaxHP = ()=>{
  if (HP.value > MaxHP.value) {HP.value = MaxHP.value}
}

const proficiencia_radio = (proficiencia_nome, proficiencia_atual, funcao)=>{
  if (!proficiencia_atual) {proficiencia_atual='destreinado'}

  let radio = ''
  Object.keys(proficiencias).forEach(proficiencia=>{
    radio += `<td><span>${proficiencia[0].toUpperCase()}</span><br><input type='radio' name='${proficiencia_nome}' value='${proficiencia}'`
    if (proficiencia == proficiencia_atual) {radio += ' checked '}
    radio += `onchange='${funcao}'`
    radio += `></td>`
  })

  radio = `<table><tr>${radio}</tr></table>`
  return radio
}

const help_atributos = ()=>{
  const atbs = atributos.map(i=>{return i.toUpperCase().slice(0, 3)})
  console.log(atbs)
  atbs.forEach(atb=>{
    const valor_aumento = document.querySelectorAll(`[name*=AUMENTO][value='${atb}']:checked`).length
    const valor_penalidade = document.querySelectorAll(`[name*=PENALIDADE][value='${atb}']:checked`).length
    query(`[name='${atb}']`).value = (valor_aumento-valor_penalidade)*2+10
  })
  update_all()
}

query('#geral :is([type="number"], [type="text"])').forEach(input=>{
  input.oninput = update_all
})

query('#geral select').forEach(input=>{
  input.onchange = update_all
})

query(`#help_atributos .col input[type='checkbox']`).forEach(input=>{
  input.onchange = help_atributos
})

query(`#help_atributos .row:not(:first-child)`).forEach(i=>i.style.display = 'none')


query(`#help_atributos .col.subtitulo`).onclick = (event)=>{
    const elementos = query(`#help_atributos .row:not(:first-child)`)
    elementos.forEach(elemento=>{
      if(elemento.style.display) {
        elemento.style.display = ''
        query(`#atributos`).style.display = 'none'
      } else {
        elemento.style.display = 'none'
        query(`#atributos`).style.display = ''
      }
    })
}

const update_modificador_atributo = ()=>{
  query('#atributos .row:has(input)').forEach(atributo_linha=>{
    elemento = atributo_linha.querySelector('input')
    const input_MOD = query(`[name='${elemento.name}_MOD']`)
    input_MOD.value = Math.floor((elemento.value-10)/2)

  })
}

const tabela_atributos = ()=>{
  let linhas = `<div class="col table_titulo">Atributos</input></div>`
  atributos.forEach(atributo=>{
    atributo_formatado = atributo.toUpperCase().slice(0, 3)
    linhas += `
    <div class="row">
      <div class='col'>
        <label>${atributo_formatado}</label>
      </div>
      <div class='col'>
        <input type='number' onchange='update_all()' name='${atributo_formatado}' value=10></input>
        <br>
        <span class='texto-menor'>valor</span>
      </div>
      <div class='col'>
        <input type='number' name='${atributo_formatado}_MOD' readonly value='0'></input>
        <br>
        <span class='texto-menor'>modificador</span>
      </div>
    </div>
    `
  })


  return linhas
}

const update_pericia = ()=>{
  const pericias_penalidade_armadura = Number(query(`[name='pericias_penalidade_armadura']`).value)
  let penalidade_pericia = 0
  query(`#pericias [name$='_penalidade']`).forEach(elemento=>{
    elemento.value = pericias_penalidade_armadura
  })
  query(`#pericias .row:has(.col>span>table)`).forEach(linha=>{
    // console.log(linha.querySelectorAll('td'))
    if(linha.querySelector('[name*="_penalidade"]')) {
      penalidade_pericia = pericias_penalidade_armadura
    } else {
      penalidade_pericia = 0
    }
    
    const pericia_valor = linha.querySelectorAll(`input[type='number']`)[0]
    const pericia_mod_base = linha.querySelector(`.col:has([name*='BONUS_ATB']) span`).innerText
    
    const pericia_mod_bonus = Number(query(`[name=${pericia_mod_base}_MOD]`).value)
    
    linha.querySelectorAll(`input[type='number']`)[1].value = pericia_mod_bonus


    const pericia_item_bonus = Number(linha.querySelectorAll(`input[type='number']`)[2].value)
    const pericia_proficiencia = linha.querySelector(`input[type='radio']:checked`).value

    pericia_valor.value = pericia_mod_bonus+proficiencias[pericia_proficiencia]()+pericia_item_bonus-penalidade_pericia
  })

  // const  = query(`[name='']`)
  // const  = query(`[name='']`)
}

const tabela_pericias = ()=>{
  let linhas = `<div class="col table_titulo">Perícias</div>`

  linhas += `
    <div class="row">
      <div>
        <span class="texto-menor">Penalidade de Armadura:</span>
        <input type='number' onchange='update_all()' name='pericias_penalidade_armadura' value=0 min="0" oninput="validity.valid||(value='');"></input>
      </div>
    </div>
  `

  pericias.forEach(pericia=>{

    let pericia_formatado = pericia

    if (pericia_formatado.includes(' ')) {pericia_formatado = pericia_formatado.replace(' ', '_')}
    if (pericia_formatado.includes('ê')) {pericia_formatado = pericia_formatado.replace('ê', 'e')}
    if (pericia_formatado.includes('ç')) {pericia_formatado = pericia_formatado.replace('ç', 'c')}
    if (pericia_formatado.includes('ã')) {pericia_formatado = pericia_formatado.replace('ã', 'a')}

    pericia_formatado = pericia_formatado.toUpperCase()

    const atb_base = pericias_atb_base[pericia].toUpperCase().slice(0, 3)

    linhas += `
    <div class="row">
      <div class='col' >
    `
    if (pericia_formatado.includes('SABER')) {
      linhas += `
          <label>${pericia.slice(0, -2)}</label>
          <input type='text' oninput="ajustar_tamanho_input(this)" onchange='update_all()'  name='${pericia_formatado}_tipo'>
          <label class="hide"></label>
        </div>
      `
    } else {
      linhas += `
      <label>${pericia}</label>
      </div>`
    }
    linhas += `
    </div>
    <div class="row">
      <div class='col'>
        <input type='number' name='${pericia_formatado}' readonly value=0></input>
        <br>
        <span class='texto-menor'>valor</span>
      </div>
      <div class='col'>
        <input type='number' name='${pericia_formatado}_BONUS_ATB' readonly value='0'></input>
        <br>
        <span class='texto-menor'>${atb_base}</span>
      </div>
      <div class='col'>
        <span class='proficiencia_radio' data-nome='${pericia_formatado}_PROFICIENCIA' data-proficiencia='' data-funcao='update_all()'></span>
      </div>
      <div class='col'>
        <input type='number' name='${pericia_formatado}_BONUS_ITEM' value='0' onchange='update_all()'></input>
        <br>
        <span class='texto-menor'>Item</span>
      </div>
    `
    if (atb_base == 'FOR' || atb_base == 'DES') {
      linhas += `
        <div class='col'>
          <input type='number' name='${pericia_formatado}_penalidade' readonly value='0'></input>
          <br>
          <span class='texto-menor'>Armadura</span>
        </div>
      `
    }
    linhas += '</div>'
  })



  return linhas
}

query('#atributos').innerHTML += tabela_atributos()
query('#pericias').innerHTML += tabela_pericias()

document.querySelectorAll('.proficiencia_radio').forEach(elemento=>{
  elemento.innerHTML = proficiencia_radio(elemento.dataset.nome, elemento.dataset.proficiencia, elemento.dataset.funcao)
})


const ajustar_tamanho_input = (input)=>{

  const ajustar = (input)=>{
    let hide = query(`[name=${input.name}]+.hide`)

    hide.textContent = input.value 

    input.style.width = hide.offsetWidth+'px'

    hide.textContent = ''
  }

  if (input) {
    ajustar(input)
  } else {
    document.querySelectorAll('[oninput*="ajustar_tamanho_input(this)"]').forEach(i=>{ajustar(i)})
  }
}

const mostrar_descrição = (elemento)=>{
  // elemento.closest('div[data-habilidade]').remove()
  div_mostrar = elemento.closest('.mostrar').querySelector('.descrição')
  if (div_mostrar.style.display == 'none') {
    div_mostrar.style.display = ''
  } else {
    div_mostrar.style.display = 'none'
  }
}

//  -------------------------HABILIDADES-------------------------

const reordenar_habilidades = ()=>{

  const divs = document.querySelectorAll('#habilidades_talentos div[data-habilidade]')

  divs.forEach((div, indice)=>{
    indice += 1
    const numero = div.dataset.habilidade.replaceAll(/[^\d]/g, '')

    div.dataset.habilidade = `HABILIDADE_${indice}`

    div.querySelectorAll('[name*=HABILIDADE_]').forEach(input=>{
      input.name = input.name.replaceAll(/\d/g, indice)
    })

  })

}

const editar_habilidade = (elemento)=>{
  // console.log(elemento.closest('[data-habilidade]').querySelector('.editar'))
  elemento.closest('[data-habilidade]').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_habilidade = (elemento)=>{
  const div = elemento.closest('[data-habilidade]')

  console.log(div.dataset.habilidade.replaceAll(/\D/g, ''))
}

const salvar_habilidade = (elemento)=>{
  update_all()
  const div = elemento.closest('[data-habilidade]')

  const nome = div.querySelector('[name*="NOME"]').value
  const tipo = div.querySelector('[name*="TIPO"]').value
  const classe = div.querySelector(`[value="${tipo}"]`).dataset.valor
  let descrição = div.querySelector('[name*="DESCRICAO"]').value.replaceAll('\n', '<br>')
  if (descrição.includes('*')) {
    descrição = descrição.replaceAll(/\*.*?\*/g, (group)=>{
      let output = group.replace('*', '<strong>')
      output = output.replace('*', '</strong>')
      return output
    })
  }

  elemento.closest('.editar').style.display = 'none'
  const div_mostrar = document.createElement('div')

  let linhas = `
    <div class="row button ${classe}">
      <div class="col">
        <label>${nome}</label>
      </div>
      <div class="col">            
        <span class="texto-menor">${tipo}</span>
      </div>
    </div>
    <div class="descrição" style="display:none;">
      <div class="row">
        <div class="col">
          <div class="area-descrição">${descrição}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="chat" onclick="mostrar_chat_habilidade(this)">
        </div>
        <div class="col">
          <input type="button" value="editar" onclick="editar_habilidade(this)">
        </div>
      </div>
    </div>
  `

  div_mostrar.innerHTML = linhas
  div_mostrar.className = 'mostrar'
  div_mostrar.onclick = (event)=>{
    if (event.target.className.includes('button') || event.target.className.includes('texto-menor') || event.target.tagName == 'IMG' || event.target.tagName == 'LABEL') {
      mostrar_descrição(event.target)
    }
  }
  div.appendChild(div_mostrar)
}

const remover_habilidade = (elemento)=>{
  const resposta = confirm('Deseja remover habilidade?')
  if (!resposta) {return}
  elemento.closest('[data-habilidade]').remove()
  reordenar_habilidades()
  update_all()
}

const adicionar_habilidade = ()=>{
  const add = (numero)=>{
    const div = document.createElement('div')
    div.dataset.habilidade = `HABILIDADE_${numero}`
    div.innerHTML = `    <div class="editar">
      <div class="row">
        <div class="col">
          <span class="texto-maior">Nome</span><br>
          <input type="text" name="HABILIDADE_${numero}_NOME">
        </div>
        <div class="col">
          <span class="texto-maior">Tipo</span><br>
          <select name="HABILIDADE_${numero}_TIPO">
            <option data-valor="talento-de-ancestralidade" value="Talento de Ancestralidade">Talento de Ancestralidade</option>
            <option data-valor="talento-de-perícia" value="Talento de Perícia">Talento de Perícia</option>
            <option data-valor="talento-geral" value="Talento Geral">Talento Geral</option>
            <option data-valor="talento-de-classe" value="Talento de Classe">Talento de Classe</option>
            <option data-valor="habilidade-de-ancestralidade" value="Habilidade de Ancestralidade">Habilidade de Ancestralidade</option>
            <option data-valor="habilidade-de-classe" value="Habilidade de Classe">Habilidade de Classe</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <span class="texto-maior">Descrição</span><br>
          <textarea name="HABILIDADE_${numero}_DESCRICAO" rows="10"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="salvar" onclick="salvar_habilidade(this)">
        </div>
        <div class="col">
          <input type="button" value="remover" onclick="remover_habilidade(this)">
        </div>
      </div>
    </div>
    `
    habilidades_talentos.appendChild(div)
  }
  const botões_remover = document.querySelectorAll('#habilidades_talentos [value="remover"]')

  let numero = botões_remover.length+1

  add(numero)
}


//  -------------------------AÇÃO-------------------------

const editar_ação = (elemento)=>{
  // console.log(elemento.closest('[data-ação]').querySelector('.editar'))
  elemento.closest('[data-ação]').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_ação = (elemento)=>{
  const div = elemento.closest('[data-ação]')

  console.log(div.dataset.ação.replaceAll(/\D/g, ''))


}

const salvar_ação = (elemento)=>{
  update_all()
  const div = elemento.closest('[data-ação]')

  const nome = div.querySelector('[name*="NOME"]').value
  const tipo = div.querySelector('[name*="TIPO"]').value
  const classe = div.querySelector(`[value="${tipo}"]`).dataset.valor
  let descrição = div.querySelector('[name*="DESCRICAO"]').value.replaceAll('\n', '<br>')

  if (descrição.includes('*')) {
    descrição = descrição.replaceAll(/\*.*?\*/g, (group)=>{
      let output = group.replace('*', '<strong>')
      output = output.replace('*', '</strong>')
      return output
    })
  }

  const página = query(`[name*="PAGINA"]`).value
  const traços = query(`[name*="TRACOS"]`).value
  const requerimentos = query(`[name*="REQUERIMENTO"]`).value
  const acionamento = query(`[name*="ACIONAMENTO"]`).value

  elemento.closest('.editar').style.display = 'none'
  const div_mostrar = document.createElement('div')

  let linhas = `
      <div class="row button ${classe}">
        <div class="col">
          <label>${nome}</label>
        </div>
        <div class="col">            
          <img class="ação-icon" src="../../publico/img/${tipo}.png">
        </div>
      </div>
      <div class="descrição" style="display:none;">
        <div class="row">
          <div class="col">
  `
  if (requerimentos) {
    linhas += `<div class="requerimentos"><strong>Requerimentos: </strong>${requerimentos}</div><br>`
  }
  if (acionamento) {
    linhas += `<div class="acionamento"><strong>Acionamento: </strong>${acionamento}</div><br>`
  }

  linhas += `
            <div class="area-descrição">${descrição}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input type="button" value="chat" onclick="mostrar_chat_ação(this)">
          </div>
          <div class="col">
            <input type="button" value="editar" onclick="editar_ação(this)">
          </div>
        </div>
      </div>

  `

  div_mostrar.innerHTML = linhas
  div_mostrar.className = 'mostrar'
  div_mostrar.onclick = (event)=>{
    if (event.target.className.includes('button') || event.target.className.includes('texto-menor') || event.target.tagName == 'IMG' || event.target.tagName == 'LABEL') {
      mostrar_descrição(event.target)
    }
  }
  div.appendChild(div_mostrar)
}

const reordenar_ações = ()=>{

  const divs = document.querySelectorAll('#ações [data-ação]')

  divs.forEach((div, indice)=>{
    indice += 1
    const numero = div.dataset.ação.replaceAll(/[^\d]/g, '')

    div.dataset.ação = `ACAO_${indice}`

    div.querySelectorAll('[name*=ACAO_]').forEach(input=>{
      input.name = input.name.replaceAll(/\d/g, indice)
    })

  })

}

const remover_ação = (elemento)=>{
  const resposta = confirm('Deseja remover ação?')
  if (!resposta) {return}
  elemento.closest('[data-ação]').remove()
  reordenar_ações()
  update_all()
}

const update_ação = (elemento)=>{
  const ação = elemento.value
  if (ação == 'livre' || ação == 'reação') {
    elemento.closest('[data-ação]').querySelector('.acionamento').style.display = ''
    // query('#')
  } else {
    elemento.closest('[data-ação]').querySelector('.acionamento').style.display = 'none'
  }
    
}


const adicionar_ação = ()=>{
  const add = (numero)=>{
    const div = document.createElement('div')
    div.dataset.ação = `ACAO_${numero}`
    div.innerHTML = `
    <div class="editar">
      <div class="row">
        <div class="col">
          <span class="texto-maior">Nome</span><br>
          <input type="text" name="ACAO_${numero}_NOME">
        </div>
        <div class="col">
          <span class="texto-maior">Ações</span><br>
          <select name="ACAO_${numero}_TIPO" onchange="update_ação(this)">
            <option data-valor="ação" value="1">1</option>
            <option data-valor="ação" value="2">2</option>
            <option data-valor="ação" value="3">3</option>
            <option data-valor="ação-livre" value="livre">livre</option>
            <option data-valor="reação" value="reação">reação</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col"> 
          <span class="texto-maior">Traços</span><br>
          <input type="text" name="ACAO_${numero}_TRACOS">
        </div>
        <div class="col">
          <span class="texto-maior">Pagina</span><br>
          <input type="number" name="ACAO_${numero}_PAGINA">
        </div>
      </div>
      <div class="row">
        <div class="col"> 
          <span class="texto-maior">Requerimentos</span><br>
          <input type="text" name="ACAO_${numero}_REQUERIMENTO">
        </div>
      </div>
      <div class="row acionamento" style="display: none;">
        <div class="col"> 
          <span class="texto-maior">Acionamento</span><br>
          <input type="text" name="ACAO_${numero}_ACIONAMENTO">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <span class="texto-maior">Descrição</span><br>
          <textarea name="ACAO_${numero}_DESCRICAO" rows="10"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="salvar" onclick="salvar_ação(this)">
        </div>
        <div class="col">
          <input type="button" value="remover" onclick="remover_ação(this)">
        </div>
      </div>
    </div>
    `
    ações.appendChild(div)
  }
  const botões_remover = document.querySelectorAll('#ações [value="remover"]')

  let valor = botões_remover.length+1

  add(valor)

}

//  -------------------------ATAQUE-------------------------

const editar_ataque = (elemento)=>{
  elemento.closest('[data-ataque]').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const salvar_ataque = (elemento)=>{
  update_all()
  elemento.closest('.editar').style.display = 'none'

  const div = elemento.closest('[data-ataque]')

  const nome = div.querySelector('[name*=NOME]').value
  const total = Number(div.querySelector('[name*=TOTAL]').value)
  const atributo_input = div.querySelector('[name*=ATRIBUTO]')
  const atributo = Number(query(`[name=${atributo_input.value}_MOD]`).value)
  const proficiencia = proficiencias[div.querySelector('[name*=PROFICIENCIA]:checked').value]()
  const item = Number(div.querySelector('[name*=ITEM]').value)
  const primeiro_ataque = Number(div.querySelector('[name*=PRIMEIRO]').value)
  const segundo_ataque = Number(div.querySelector('[name*=SEGUNDO]').value)
  const terceiro_ataque = Number(div.querySelector('[name*=TERCEIRO]').value)
  const traços = div.querySelector('[name*=TRACOS]').value.replaceAll(/\s/g, '')

  let traços_HTML = ''
  if (traços) {
    traços.split(',').forEach(traço=>{
      traços_HTML += `<span class="traço">${traço}</span>`
    })
  }


  let danos = ''
  div.querySelectorAll('[data-dano]').forEach(dano=>{

    const dado_quantidade = Number(dano.querySelector('[name*=DADO_QUANTIDADE]').value)
    const dado = dano.querySelector('[name$=DADO]').value
    const bonus = Number(dano.querySelector('[name*=BONUS]').value)
    const atributo_dano_input = dano.querySelector('[name*=ATRIBUTO]')
    let atributo_dano = query(`[name=${atributo_dano_input.value}_MOD]`).value
    if (!atributo_dano) {atributo_dano = 0}
    const tipo = dano.querySelector('[name*=TIPO]').value

    danos += `
      <p class="texto-maior tab">
        <span data-soma-dano>
          ${dado_quantidade}${dado}+${bonus}${atributo_dano >= 0 ? `+${atributo_dano}` : `${atributo_dano}`}
          <span class="dano-tipo">${tipo}</span>
        </span>
    `
    danos += `</p>`
  })

  let linhas = `
    <div class="row button ataque">
      <div class="col">
        <label>${nome}</label>
      </div>
      <div class="col">            
        <label class="">
          ${total+primeiro_ataque >= 0 ? `+${total}` : `${total}`} 
          | ${total+segundo_ataque >= 0 ? `+${total+segundo_ataque}` : `${total+segundo_ataque}`}  
          | ${total+terceiro_ataque >= 0 ? `+${total+terceiro_ataque}` : `${total+terceiro_ataque}`} 

        </label>
      </div>
    </div>
    <div class="descrição" style="display:none;">
      <div class="row">
        <div class="col">
          <div class="area-descrição">
            ${traços_HTML}<br><br>

            <p class="texto-maior">Ataque:</p>

            <p class="texto-maior tab"><span data-soma-ataque>1D20+${atributo}+${proficiencia}+${item}</span></p><br>

            <p class="texto-maior">Dano:</p> 

            ${danos}

          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="editar" onclick="editar_ataque(this)">
        </div>
      </div>
    </div>
  `
  const div_mostrar = document.createElement('div')

  div_mostrar.innerHTML = linhas
  div_mostrar.className = 'mostrar'
  div_mostrar.onclick = (event)=>{
    if (event.target.className.includes('button') || event.target.className.includes('texto-menor') || event.target.tagName == 'IMG' || event.target.tagName == 'LABEL') {
      mostrar_descrição(event.target)
    }
  }

  div.appendChild(div_mostrar)
}

const reordenar_ataques = ()=>{

  const divs = document.querySelectorAll('#ataques [data-ataque]')

  divs.forEach((div, indice)=>{
    indice += 1
    const numero = div.dataset.ataque.replaceAll(/[^\d]/g, '')

    div.dataset.ataque = `ATAQUE_${indice}`

    div.querySelectorAll('[name*=ATAQUE_]').forEach(input=>{
      input.name = input.name.replaceAll(/\d/g, indice)
    })

  })

  reordenar_danos()

}

const remover_ataque = (elemento)=>{
  const resposta = confirm('Deseja remover ataque?')
  if (!resposta) {return}
  elemento.closest('[data-ataque]').remove()
  reordenar_ataques()
  update_all()
}

const update_ataques = (elemento)=>{
  
  const update = ()=>{
    const div = elemento.closest('[data-ataque]')
    const proficiencia = div.querySelector('[name*=PROFICIENCIA]:checked').value
    const atributo = div.querySelector('[name*=ATRIBUTO]').value
    const item = Number(div.querySelector('[name*=ITEM]').value)
    const input_total = div.querySelector('[name*=TOTAL]')

    const bonus_atributo = Number(query(`[name=${atributo}_MOD]`).value)

    input_total.value = proficiencias[proficiencia]()+item+bonus_atributo
  }

  if (!elemento) {
    const ataques = document.querySelectorAll('[data-ataque]')
    ataques.forEach(ataque=>{
      elemento = ataque
      update()
    })
  } else {
    update()
  }
    
}

const adicionar_ataque = ()=>{
  const add = (numero)=>{
    const div = document.createElement('div')
    div.dataset.ataque = `ATAQUE_${numero}`
    div.innerHTML = `
        <div class="editar">
          <div class="row">
            <div class="col">
              <span class="texto-maior">Ataque</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span class="texto-maior">Nome</span><br>
              <input type="text" name="ATAQUE_${numero}_NOME" class="ataque-nome">
            </div>
            <div class="col">
              <span class="texto-maior">Total</span><br>
              <input type="number" name="ATAQUE_${numero}_TOTAL" readonly value="0">
            </div>
            <div class="col">
              <span class="texto-maior">ATB</span><br>
              <select onchange="update_ataques(this)" name="ATAQUE_${numero}_ATRIBUTO">
                <!-- <option value="-">-</option> -->
                <option value="FOR">FOR</option>
                <option value="DES">DES</option>
                <option value="INT">INT</option>
                <option value="SAB">SAB</option>
                <option value="CAR">CAR</option>
              </select>
            </div>
            <div class="col">
              <span class="proficiencia_radio">${proficiencia_radio('ATAQUE_'+numero+'_PROFICIENCIA', '', 'update_ataques(this)')}</span>
            </div>
            <div class="col">
              <span class="texto-maior">Item</span><br>
              <input type="number" onchange="update_ataques(this)" min="0" name="ATAQUE_${numero}_ITEM" value="0">
            </div>
          </div>
          <div class="row">
            <div class="col">
                <span class="texto-maior">Traços</span><br>
                <input type="text" name="ATAQUE_${numero}_TRACOS" class="ataque-traços" placeholder="Ágil, Abertura...">
            </div>
          </div>
          <div class="row multiplos-ataques">
            <div class="col">
              <span class="texto-menor">1º</span><br>
              <input type="number" name="ATAQUE_${numero}_PRIMEIRO" value="-0">
            </div>
            <div class="col">
              <span class="texto-menor">2º</span><br>
              <input type="number" name="ATAQUE_${numero}_SEGUNDO" value="-5">
            </div>
            <div class="col">
              <span class="texto-menor">3º</span><br>
              <input type="number" name="ATAQUE_${numero}_TERCEIRO" value="-10">
            </div>
          </div>
          <div class="row"><hr></div>
          <div class="row">
            <div class="col">
              <span class="texto-maior">Dano</span>
            </div>
            <div class="col">
              <span class="texto-maior" onclick="adicionar_dano(this)">+</span>
            </div>
          </div>
          <div class="bloco-dano"></div>
          <div class="row">
            <div class="col">
              <input type="button" value="salvar" onclick="salvar_ataque(this)">
            </div>
            <div class="col">
              <input type="button" value="remover" onclick="remover_ataque(this)">
            </div>
          </div>
        </div>
    `
    ataques.appendChild(div)
    const elemento = div.querySelector('[onclick="adicionar_dano(this)"]')
    adicionar_dano(elemento)
    
  }
  const botões_remover = document.querySelectorAll('#ataques [value="remover"]')

  let valor = botões_remover.length+1

  add(valor)
  update_ataques()
}

const reordenar_danos = ()=>{
  const divs = document.querySelectorAll('#ataques [data-ataque]')

  divs.forEach((div, ataque_indice)=>{
    ataque_indice += 1
    div.querySelectorAll('[data-dano]').forEach((dano, dano_indice)=>{
      dano_indice += 1
      let nova_ordem = dano.dataset.dano.split('_')
      nova_ordem[1] = ataque_indice
      nova_ordem[2] = dano_indice
      nova_ordem = nova_ordem.join('_')
      dano.dataset.dano = nova_ordem

      dano.querySelectorAll('[name*=DANO]').forEach(input=>{
        input.name = input.name.replace(/DANO_\d*_\d*/, nova_ordem)
      })
    })

  })
}

const remover_dano = (elemento)=>{
  const resposta = confirm('Deseja remover dano?')
  if (!resposta) {return}
  elemento.closest('[data-dano]').remove()
  reordenar_danos()
  update_all()
}

const adicionar_dano = (elemento)=>{

  const add = (numero_1, numero_2)=>{
    const div = document.createElement('div')
    div.dataset.dano = `DANO_${numero_1}_${numero_2}`
    div.className = 'dano'
    div.innerHTML = `

    <div class="row">
      <div class="col">
          <span class="texto-maior">Dado</span><br>
          <input type="number" name="DANO_${numero_1}_${numero_2}_DADO_QUANTIDADE" value="1">
          <select name="DANO_${numero_1}_${numero_2}_DADO">
            <option value="D4">D4</option>
            <option value="D6">D6</option>
            <option value="D8">D8</option>
            <option value="D10">D10</option>
            <option value="D12">D12</option>
          </select>
      </div>
      <div class="col">
          <span class="texto-maior">Bônus</span><br>
          <input type="number" name="DANO_${numero_1}_${numero_2}_BONUS" value="0">
      </div>
      <div class="col">
          <span class="texto-maior">ATB</span><br>
          <select name="DANO_${numero_1}_${numero_2}_ATRIBUTO">
            <option value="-">-</option>
            <option value="FOR">FOR</option>
            <option value="DES">DES</option>
            <!-- <option value="CON">CON</option> -->
            <option value="INT">INT</option>
            <option value="SAB">SAB</option>
            <option value="CAR">CAR</option>
          </select>
      </div>
      <div class="col">
          <span class="texto-maior">Tipo</span><br>
          <input type="text" name="DANO_${numero_1}_${numero_2}_TIPO" class="ataque-tipo">
      </div>
    </div>
    <div class="row">
      <div class="col">
          <label class="texto-maior" onclick="remover_dano(this)">X</label>
      </div>
    </div>


  `
    bloco_dano.appendChild(div)
  }

  const ataque_div = elemento.closest('[data-ataque]')

  const bloco_dano = ataque_div.querySelector('.bloco-dano')

  const numero_1 = ataque_div.dataset.ataque.split('_')[1]

  const botões_remover_dano = bloco_dano.querySelectorAll('.dano')

  let numero_2 = botões_remover_dano.length+1

  add(numero_1, numero_2)

}

// ITENS

//  -------------------------inventario-------------------------

const reordenar_inventario = ()=>{

  const divs = document.querySelectorAll('#inventario div[data-item]')

  divs.forEach((div, indice)=>{
    indice += 1
    const numero = div.dataset.item.replaceAll(/[^\d]/g, '')

    div.dataset.item = `ITEM_${indice}`

    div.querySelectorAll('[name*=ITEM_]').forEach(input=>{
      input.name = input.name.replaceAll(/\d/g, indice)
    })

  })

}

const editar_item = (elemento)=>{
  // console.log(elemento.closest('[data-item]').querySelector('.editar'))
  elemento.closest('[data-item]').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_item = (elemento)=>{
  const div = elemento.closest('[data-item]')

  console.log(div.dataset.item.replaceAll(/\D/g, ''))
}

const salvar_item = (elemento)=>{
  update_all()
  const div = elemento.closest('[data-item]')

  const nome = div.querySelector('[name*="NOME"]').value
  let volume = div.querySelector('[name*="VOLUME"]').value
  const custo = div.querySelector(`[name*="CUSTO"]`).value
  const peça = div.querySelector(`[name*="PECA"]`).value
  const quantidade = div.querySelector(`[name*="QUANTIDADE"]`).value

  volume = volume.includes(' ') ? volume.replaceAll(/\s/g, '') : volume

  volume = volume.match(/\d/) ? Number(volume) : volume.toUpperCase()


  let descrição = div.querySelector('[name*="DESCRICAO"]').value.replaceAll('\n', '<br>')
  if (descrição.includes('*')) {
    descrição = descrição.replaceAll(/\*.*?\*/g, (group)=>{
      let output = group.replace('*', '<strong>')
      output = output.replace('*', '</strong>')
      return output
    })
  }

  elemento.closest('.editar').style.display = 'none'
  const div_mostrar = document.createElement('div')

  let linhas = `
    <div class="row button">
      <div class="col">
        <label class="item-nome">${nome}</label>
      </div>
      <div class="col">            
        <span class="texto-menor ${peça}">${custo}${peça}</span><span class="texto-menor volume">vol:${volume}</span><span class="texto-menor">quant:${quantidade}</span>
      </div>
    </div>
    <div class="descrição" style="display:none;">
      <div class="row">
        <div class="col">
          <div class="area-descrição">${descrição}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="chat" onclick="mostrar_chat_item(this)">
        </div>
        <div class="col">
          <input type="button" value="editar" onclick="editar_item(this)">
        </div>
      </div>
    </div>
  `

  div_mostrar.innerHTML = linhas
  div_mostrar.className = 'mostrar'
  div_mostrar.onclick = (event)=>{
    if (event.target.className.includes('button') || event.target.className.includes('texto-menor') || event.target.tagName == 'IMG' || event.target.tagName == 'LABEL') {
      mostrar_descrição(event.target)
    }
  }
  div.appendChild(div_mostrar)
}

const remover_item = (elemento)=>{
  const resposta = confirm('Deseja remover item?')
  if (!resposta) {return}
  elemento.closest('[data-item]').remove()
  reordenar_inventario()
  update_all()
}

const adicionar_item = ()=>{
  const add = (numero)=>{
    const div = document.createElement('div')
    div.dataset.item = `ITEM_${numero}`
    div.innerHTML = `

    <div class="editar">
      <div class="row">
        <div class="col">
          <span class="texto-maior">Nome</span><br>
          <input type="text" name="ITEM_${numero}_NOME">
        </div>
        <div class="col">
          <span class="texto-maior">Vol.</span><br>
          <input type="text" name="ITEM_${numero}_VOLUME" value="-">
        </div>
        <div class="col">
          <span class="texto-maior">Custo</span><br>
          <input type="number" name="ITEM_${numero}_CUSTO">
          <select name="ITEM_${numero}_PECA">
            <option value="PC">PC</option>
            <option value="PP" selected>PP</option>
            <option value="PO">PO</option>
            <option value="PL">PL</option>
          </select>
        </div>
        <div class="col">
          <span class="texto-menor">QUANT</span><br>
          <input type="number" name="ITEM_${numero}_QUANTIDADE" value="1">
        </div>
      </div>
      <div class="row">
      </div>
      <div class="row">
        <div class="col">
          <span class="texto-maior">Descrição <input type="checkbox" onclick="mostrar_enconder_descrição_item(this)"></span><br>
          <textarea name="ITEM_${numero}_DESCRICAO" rows="10" style="display: none;"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input type="button" value="salvar" onclick="salvar_item(this)">
        </div>
        <div class="col">
          <input type="button" value="remover" onclick="remover_item(this)">
        </div>
      </div>
    </div>

    `
    inventario.appendChild(div)
  }
  const botões_remover = document.querySelectorAll('#inventario [value="remover"]')

  let valor = botões_remover.length+1

  add(valor)

}

const mostrar_enconder_descrição_item = (elemento)=>{
  const textarea = elemento.closest('div').querySelector('textarea')
  const estado = textarea.style.display
  if (elemento.checked == true) {
    textarea.style.display = ''
  } else {
    textarea.style.display = 'none'
  }
}

const ficha_de_personagem = {}
const gerar_obj = ()=>{
  query('#geral [name]').forEach(i=>{ficha_de_personagem[i.name] = i.value})
  const radio_check = (element)=>{
    if (element.type == 'radio') {console.log(element)}
  }
  ficha_de_personagem.percepção
  query('#percepção [name]:not([type="radio"]), #percepção [name]').forEach(i=>{
    // ficha_de_personagem[i.name] = i.value
    // radio_check(i)
    console.log(i.value)
  })
  console.log(ficha_de_personagem)
}

editar_visualizar()