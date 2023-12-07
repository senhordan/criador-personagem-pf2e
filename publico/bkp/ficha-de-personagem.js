const rm_acentos = (texto)=>{
    texto = texto.replace(/[ÀÁÂÃÄÅ]/,"A");
    texto = texto.replace(/[àáâãäå]/,"a");
    texto = texto.replace(/[ÈÉÊË]/,"E");
    texto = texto.replace(/[Ç]/,"C");
    texto = texto.replace(/[ç]/,"c");
    return texto.replace(/[^a-z0-9]/gi,''); 
}

const remover_duplicatas = (array)=>{
  return [...new Set(array)];
}

const query = (selector)=>{
    const elements = document.querySelectorAll(selector)
    if (elements.length == 1) {
        return elements[0]
    } else {
        return elements
    }
}

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

const editar_visualizar = ()=>{
  const col = query('#editar_visualizar .col')

  if (col.innerText == 'Editar') {
    col.innerText = 'Visualizar'
    query('.container').className = 'container editar'

  } else {
    col.innerText = 'Editar'
    query('.container').className = 'container visualizar'

  }
}

const update_all = ()=>{
  update_CA()
  update_salvamentos()
  update_percepção()
  update_pericia()
  update_CD_classe()
  update_ataques()
}

//  -------------------------PERCEPÇÃO-------------------------

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
      CD_classe_input.value = CD_classe_item+proficiencias[CD_classe_proficiencia]()
    } else {
      // CD_classe_bonus_input.value = Number(query(`[name='${atributo_base}_MOD']`).value)

      CD_classe_input.value = CD_classe_item+proficiencias[CD_classe_proficiencia]()+Number(query(`[name='${atributo_base}_MOD']`).value)

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

const criação_atributos = ()=>{
  const atbs = atributos.map(i=>{return i.toUpperCase().slice(0, 3)})

  atbs.forEach(atb=>{
    const valor_aumento = document.querySelectorAll(`[name='aumento_atributo'][value='${atb}']:checked`).length
    const valor_penalidade = document.querySelectorAll(`[name='penalidade_atributo'][value='${atb}']:checked`).length
    query(`[name='${atb}']`).value = (valor_aumento-valor_penalidade)*2+10
  })
  update_modificador_atributo()
}

query(`#criação_atributos .col input[type='checkbox']`).forEach(input=>{
  input.onchange = criação_atributos
})

query(`#criação_atributos .row:not(:first-child)`).forEach(i=>i.style.display = 'none')


query(`#criação_atributos .col.subtitulo`).onclick = (event)=>{
    const elementos = query(`#criação_atributos .row:not(:first-child)`)
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
  update_all()
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
        <input type='number' onchange='update_modificador_atributo()' name='${atributo_formatado}' value=10></input>
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
        <input type='number' onchange='update_pericia()' name='pericias_penalidade_armadura' value=0 min="0" oninput="validity.valid||(value='');"></input>
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
          <input type='text' oninput="ajustar_tamanho_input(this)" onchange='update_pericia()'  name='${pericia_formatado}_tipo'>
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
        <span class='proficiencia_radio' data-nome='${pericia_formatado}_PROFICIENCIA' data-proficiencia='' data-funcao='update_pericia()'></span>
      </div>
      <div class='col'>
        <input type='number' name='${pericia_formatado}_BONUS_ITEM' value='0' onchange='update_pericia()'></input>
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

ficha.onsubmit = async (event)=> {
  event.preventDefault();
  const data = new FormData(event.target);

  const value = Object.fromEntries(data.entries());
  try {
    await navigator.clipboard.writeText(JSON.stringify(value));
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
  console.log(value);
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

  const nome = div.querySelector('[name*="NOME"]').value
  const tipo = div.querySelector('[name*="TIPO"]').value
  const classe = div.querySelector(`[value="${tipo}"]`).dataset.valor
  const descrição = div.querySelector('[name*="DESCRICAO"]').value
  console.log([nome, tipo, descrição])

}

const salvar_habilidade = (elemento)=>{
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
  elemento.closest('[data-habilidade]').remove()

  reordenar_habilidades()
}

const adicionar_habilidade = ()=>{
  const add = (numero)=>{
    const div = document.createElement('div')
    div.dataset.habilidade = `HABILIDADE_${numero}`
    div.innerHTML = `
    <div class="editar">
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

  let valor = botões_remover.length+1

  add(valor)

}


//  -------------------------AÇÃO-------------------------

const editar_ação = (elemento)=>{
  // console.log(elemento.closest('[data-ação]').querySelector('.editar'))
  elemento.closest('[data-ação]').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_ação = (elemento)=>{
  const div = elemento.closest('[data-ação]')

  const nome = div.querySelector('[name*="NOME"]').value
  const tipo = div.querySelector('[name*="TIPO"]').value
  const classe = div.querySelector(`[value="${tipo}"]`).dataset.valor
  const descrição = div.querySelector('[name*="DESCRICAO"]').value
  console.log([nome, tipo, descrição])

}

const salvar_ação = (elemento)=>{
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
          <img class="ação-icon" src="../publico/img/${tipo}.png">
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
  elemento.closest('[data-ação]').remove()
  reordenar_ações()
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

const mostrar_chat_ataque = (elemento)=>{
  const div = elemento.closest('[data-ataque]')

  const nome = div.querySelector('[name*="NOME"]').value
  const tipo = div.querySelector('[name*="TIPO"]').value
  const classe = div.querySelector(`[value="${tipo}"]`).dataset.valor
  const descrição = div.querySelector('[name*="DESCRICAO"]').value

}

const salvar_ataque = (elemento)=>{
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
        <span data-soma-dano="">
          ${dado_quantidade}${dado}+${bonus}${atributo_dano >= 0 ? `+${atributo_dano}` : `${atributo_dano}`}
        </span>
    `
    if (tipo) {
      danos += `<span class="dano-tipo">${tipo}</span>`
    } 
    danos += `</p>`
  })

  let linhas = `
    <div class="row button ação">
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

            <p class="texto-maior tab"><span data-soma-ataque>1D20+${atributo}+${proficiencia}+${item}</span> = ${total}</p><br>

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
  elemento.closest('[data-ataque]').remove()
  reordenar_ataques()
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
  elemento.closest('[data-dano]').remove()
  reordenar_danos()
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


// inportar json


const importar = (obj)=>{

  const salvar_tudo = ()=>{
    query('[value="salvar"]').forEach(i=>{i.click()})
  }

  let habilidades = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=HABILIDADE_)\d/g))

  habilidades.forEach(i=>{adicionar_habilidade()})

  let ações = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=ACAO_)\d/g))

  ações.forEach(i=>{adicionar_ação()})


  let ataques = remover_duplicatas(Object.keys(obj).join('\n').match(/(?<=ATAQUE_)\d/g))

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
      let input = document.querySelector(`[name=${i[0]}]`)
      if (input.type == 'radio') {
        // console.log()
        query(`[name=${input.name}][value="${i[1]}"]`).checked = 1
      } else {
        input.value = i[1]
      }
      
  })

  salvar_tudo()

  query('#criação_atributos .subtitulo').style.display = 'none'

  ajustar_tamanho_input()

}


obj = {
    "NOME": "Dan",
    "ANCESTRALIDADE_E_HERANCA": "Elfo das Florestas",
    "BIOGRAFIA": "Acólito",
    "CLASSE": "Ladino",
    "DIVINDADE": "",
    "IDIOMAS": "Comum, Élfico",
    "SENTIDOS": "Visão na Penumbra",
    "NIVEL": "1",
    "HP": "14",
    "MaxHP": "14",
    "RESISTENCIAS_IMUNIDADES": "",
    "VELOCIDADE": "10.5",
    "TAMANHO": "medium",
    "VISAO": "normal",
    "PERCEPCAO": "5",
    "PERCEPCAO_SAB_BONUS": "0",
    "PERCEPCAO_PROFICIENCIA": "especialista",
    "PERCEPCAO_BONUS_ITEM": "0",
    "FORTITUDE": "3",
    "FORTITUDE_CON_BONUS": "0",
    "FORTITUDE_PROFICIENCIA": "treinado",
    "FORTITUDE_BONUS_ITEM": "0",
    "REFLEXOS": "9",
    "REFLEXOS_DES_BONUS": "4",
    "REFLEXOS_PROFICIENCIA": "especialista",
    "REFLEXOS_BONUS_ITEM": "0",
    "VONTADE": "5",
    "VONTADE_SAB_BONUS": "0",
    "VONTADE_PROFICIENCIA": "especialista",
    "VONTADE_BONUS_ITEM": "0",
    "CD_CLASSE": "7",
    "CD_CLASSE_ATB_BONUS": "DES",
    "CD_CLASSE_PROFICIENCIA": "treinado",
    "CD_CLASSE_BONUS_ITEM": "0",
    "aumento_atributo": "CAR",
    "penalidade_atributo": "CON",
    "FOR": "10",
    "FOR_MOD": "0",
    "DES": "18",
    "DES_MOD": "4",
    "CON": "10",
    "CON_MOD": "0",
    "INT": "16",
    "INT_MOD": "3",
    "SAB": "10",
    "SAB_MOD": "0",
    "CAR": "14",
    "CAR_MOD": "2",
    "pericias_penalidade_armadura": "0",
    "ACROBATISMO": "7",
    "ACROBATISMO_BONUS_ATB": "4",
    "ACROBATISMO_PROFICIENCIA": "treinado",
    "ACROBATISMO_BONUS_ITEM": "0",
    "ACROBATISMO_penalidade": "0",
    "ARCANISMO": "6",
    "ARCANISMO_BONUS_ATB": "3",
    "ARCANISMO_PROFICIENCIA": "treinado",
    "ARCANISMO_BONUS_ITEM": "0",
    "ATLETISMO": "3",
    "ATLETISMO_BONUS_ATB": "0",
    "ATLETISMO_PROFICIENCIA": "treinado",
    "ATLETISMO_BONUS_ITEM": "0",
    "ATLETISMO_penalidade": "0",
    "DIPLOMACIA": "2",
    "DIPLOMACIA_BONUS_ATB": "2",
    "DIPLOMACIA_PROFICIENCIA": "destreinado",
    "DIPLOMACIA_BONUS_ITEM": "0",
    "DISSIMULACAO": "5",
    "DISSIMULACAO_BONUS_ATB": "2",
    "DISSIMULACAO_PROFICIENCIA": "treinado",
    "DISSIMULACAO_BONUS_ITEM": "0",
    "FURTIVIDADE": "7",
    "FURTIVIDADE_BONUS_ATB": "4",
    "FURTIVIDADE_PROFICIENCIA": "treinado",
    "FURTIVIDADE_BONUS_ITEM": "0",
    "FURTIVIDADE_penalidade": "0",
    "INTIMIDACAO": "2",
    "INTIMIDACAO_BONUS_ATB": "2",
    "INTIMIDACAO_PROFICIENCIA": "destreinado",
    "INTIMIDACAO_BONUS_ITEM": "0",
    "LADROAGEM": "7",
    "LADROAGEM_BONUS_ATB": "4",
    "LADROAGEM_PROFICIENCIA": "treinado",
    "LADROAGEM_BONUS_ITEM": "0",
    "LADROAGEM_penalidade": "0",
    "MANUFATURA": "6",
    "MANUFATURA_BONUS_ATB": "3",
    "MANUFATURA_PROFICIENCIA": "treinado",
    "MANUFATURA_BONUS_ITEM": "0",
    "MEDICINA": "3",
    "MEDICINA_BONUS_ATB": "0",
    "MEDICINA_PROFICIENCIA": "treinado",
    "MEDICINA_BONUS_ITEM": "0",
    "NATUREZA": "3",
    "NATUREZA_BONUS_ATB": "0",
    "NATUREZA_PROFICIENCIA": "treinado",
    "NATUREZA_BONUS_ITEM": "0",
    "OCULTISMO": "6",
    "OCULTISMO_BONUS_ATB": "3",
    "OCULTISMO_PROFICIENCIA": "treinado",
    "OCULTISMO_BONUS_ITEM": "0",
    "PERFORMANCE": "2",
    "PERFORMANCE_BONUS_ATB": "2",
    "PERFORMANCE_PROFICIENCIA": "destreinado",
    "PERFORMANCE_BONUS_ITEM": "0",
    "RELIGIAO": "3",
    "RELIGIAO_BONUS_ATB": "0",
    "RELIGIAO_PROFICIENCIA": "treinado",
    "RELIGIAO_BONUS_ITEM": "0",
    "SABER_1_tipo": "Escrita",
    "SABER_1": "6",
    "SABER_1_BONUS_ATB": "3",
    "SABER_1_PROFICIENCIA": "treinado",
    "SABER_1_BONUS_ITEM": "0",
    "SABER_2_tipo": "",
    "SABER_2": "3",
    "SABER_2_BONUS_ATB": "3",
    "SABER_2_PROFICIENCIA": "destreinado",
    "SABER_2_BONUS_ITEM": "0",
    "SOBREVIVENCIA": "3",
    "SOBREVIVENCIA_BONUS_ATB": "0",
    "SOBREVIVENCIA_PROFICIENCIA": "treinado",
    "SOBREVIVENCIA_BONUS_ITEM": "0",
    "SOCIEDADE": "6",
    "SOCIEDADE_BONUS_ATB": "3",
    "SOCIEDADE_PROFICIENCIA": "treinado",
    "SOCIEDADE_BONUS_ITEM": "0",
    "CA": "14",
    "CA_DES_BONUS": "4",
    "CA_LIMITE": "0",
    "CA_PROFICIENCIA": "destreinado",
    "CA_BONUS_ITEM": "0",
    "defesa_sem_armadura": "treinado",
    "armadura_leve": "treinado",
    "armadura_media": "destreinado",
    "armadura_pesada": "destreinado",
    "escudo": "0",
    "escudo_dureza": "0",
    "escudo_pv_max": "0",
    "escudo_limiar": "0",
    "escudo_pv_atual": "0",
    "HABILIDADE_1_NOME": "Elfo das Florestas",
    "HABILIDADE_1_TIPO": "Habilidade de Ancestralidade",
    "HABILIDADE_1_DESCRICAO": "Você é adaptado à vida nas florestas ou nas selvas e sabe escalar árvores e usar a folhagem em seu favor. Quando Escalar árvores, vinhas e outras folhagens, você se move à metade de sua Velocidade em um sucesso e à sua Velocidade total em um sucesso crítico (e se move à sua Velocidade total em um sucesso se possuir Escalada Rápida). Isto não o afeta se você estiver usando uma Velocidade de escalada.\n\nVocê sempre pode usar a ação Obter Cobertura enquanto estiver em terreno de floresta, mesmo que não esteja próximo a um obstáculo que ofereceria cobertura.",
    "HABILIDADE_2_NOME": "Elfo Ligeiro",
    "HABILIDADE_2_TIPO": "Talento de Ancestralidade",
    "HABILIDADE_2_DESCRICAO": "Seus músculos de caminhada são bastante trabalhados.\n\nSua Velocidade aumenta em 1,5 metros.\n\n",
    "HABILIDADE_3_NOME": "Estudante do Cânone",
    "HABILIDADE_3_TIPO": "Talento Geral",
    "HABILIDADE_3_DESCRICAO": "Você pesquisou muitas fés e religiões e, por isso, é capaz de reconhecer noções religiosas imprecisas ou errôneas. Se rolar uma falha crítica em um teste de Religião para Decifrar uma Escrita de natureza religiosa ou para Recordar Conhecimento sobre os princípios de religiões, trate o resultado como uma falha. Quando tentar Recordar Conhecimento sobre os princípios de sua própria fé, se rolar uma falha crítica, trate o resultado como uma falha e, se rolar um sucesso, trate o resultado como um sucesso crítico.",
    "HABILIDADE_4_NOME": "Esquema de Ladino(Ladrão)",
    "HABILIDADE_4_TIPO": "Habilidade de Classe",
    "HABILIDADE_4_DESCRICAO": "Nada supera a emoção de tomar algo que pertence a outra pessoa, especialmente se você conseguir passar completamente despercebido. Você pode ser um batedor de carteiras trabalhando nas ruas, um ladrão sorrateiro se esgueirando por janelas e fugindo por cima de telhados ou um arrombador saqueando cofres muito bem guardados. Você pode até mesmo trabalhar como um consultor, simulando roubos para testar as defesas dos objetos valiosos de clientes.\n\nQuando uma luta começa, você prefere armas rápidas e leves, golpeando onde causará mais dor. Quando atacar com uma arma corpo a corpo de acuidade, você pode adicionar seu modificador de Destreza em rolagens de dano em vez de seu modificador de Força. Você é treinado em Ladroagem.\n\n",
    "HABILIDADE_5_NOME": "Ataque Furtivo",
    "HABILIDADE_5_TIPO": "Habilidade de Classe",
    "HABILIDADE_5_DESCRICAO": "Quando seu inimigo não pode se defender apropriadamente, você tira vantagem para causar dano extra. Quando usar uma arma corpo a corpo ágil ou de acuidade, uma arma à distância, ou um ataque desarmado ágil ou de acuidade para Golpear uma criatura que tenha a condição desprevenida (página 619), você causa 1d6 de dano extra de precisão. Você também pode fazer isso com um ataque à distância usando uma arma de arremesso, mas essa arma deve ser ágil ou de acuidade.\n\nConforme seu nível de ladino aumenta, a quantidade de dados de dano de seu ataque furtivo também aumenta. Aumente a quantidade de dados em um no 5º, 11º e 17º níveis.",
    "HABILIDADE_6_NOME": "Ataque Surpresa",
    "HABILIDADE_6_TIPO": "Habilidade de Classe",
    "HABILIDADE_6_DESCRICAO": "Você entra em combate antes que seus adversários sejam capazes de reagir. Na primeira rodada do combate, se você rolar Dissimulação ou Furtividade para iniciativa, criaturas que ainda não tiverem agido ficam desprevenidas contra você.\n\n",
    "HABILIDADE_7_NOME": "Talentos de Perícia",
    "HABILIDADE_7_TIPO": "Habilidade de Classe",
    "HABILIDADE_7_DESCRICAO": "Você recebe talentos de perícia com maior frequência do que os outros. No 1º nível e a cada nível subsequente, você recebe um talento de perícia. Talentos de perícia podem ser encontrados no Capítulo 5 e possuem o traço perícia. Você deve possuir uma graduação de proficiência treinado ou melhor na perícia correspondente para selecionar um talento de perícia.",
    "HABILIDADE_8_NOME": "Descobridor de Armadilha",
    "HABILIDADE_8_TIPO": "Talento de Classe",
    "HABILIDADE_8_DESCRICAO": "Você possui um sentido intuitivo que o alerta sobre a presença de armadilhas. Você recebe +1 de bônus de circunstância em testes de Percepção para encontrar armadilhas, na CA contra ataques feitos por elas e em salvamentos contra seus efeitos. Mesmo que não esteja Procurando, você faz um teste para encontrar armadilhas que normalmente exigiriam essa atividade. Você ainda precisa atender a quaisquer outros requerimentos para encontrar a armadilha.\n\nVocê pode desativar armadilhas que requeiram graduação de proficiência mestre em Ladroagem. Se possuir graduação mestre em Ladroagem, você pode desativar armadilhas que requeiram graduação de proficiência lendária, e seu bônus de circunstância contra armadilhas aumenta para +2.",
    "ATAQUE_1_NOME": "Rapieira",
    "ATAQUE_1_TOTAL": "7",
    "ATAQUE_1_ATRIBUTO": "DES",
    "ATAQUE_1_PROFICIENCIA": "treinado",
    "ATAQUE_1_ITEM": "0",
    "ATAQUE_1_TRACOS": "DESARMAR,  ACUIDADE,  MORTAL(D8)",
    "ATAQUE_1_PRIMEIRO": "-0",
    "ATAQUE_1_SEGUNDO": "-5",
    "ATAQUE_1_TERCEIRO": "-10",
    "DANO_1_1_DADO_QUANTIDADE": "1",
    "DANO_1_1_DADO": "D6",
    "DANO_1_1_BONUS": "0",
    "DANO_1_1_ATRIBUTO": "DES",
    "DANO_1_1_TIPO": "Perfurante",
    "DANO_1_2_DADO_QUANTIDADE": "1",
    "DANO_1_2_DADO": "D6",
    "DANO_1_2_BONUS": "0",
    "DANO_1_2_ATRIBUTO": "DES",
    "DANO_1_2_TIPO": "Perfurante",
    "ACAO_1_NOME": "",
    "ACAO_1_TIPO": "1",
    "ACAO_1_TRACOS": "",
    "ACAO_1_PAGINA": "",
    "ACAO_1_REQUERIMENTO": "",
    "ACAO_1_ACIONAMENTO": "",
    "ACAO_1_DESCRICAO": ""
}