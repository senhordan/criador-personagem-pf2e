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


const update_token = ()=>{
  console.log('update_token')
  // console.log(ficha)
  socket.emit('update token', [usuario(), token(), ficha])
}

const update_all = ()=>{
  update_geral()
  update_modificador_atributo()
  update_salvamentos()
  update_percepção()
  update_CA()
  update_armaduras()
  update_CD_classe()
  update_pericia()
  update_ataques()
  // checar_MaxHP()
  // gerar_ficha()
  update_token()
}

const update_geral = ()=>{
  query('#geral input, #geral select').forEach(i=>{
    ficha[i.name] = i.value
  })
}

const update_modificador_atributo = ()=>{
  ficha.atributos = {}
  query('#atributos .row:has(input)').forEach(linha=>{
    const [input_valor, input_mod] = linha.querySelectorAll('input')
    const atributo = linha.querySelector('.col').innerText

    input_mod.value = Math.floor((input_valor.value-10)/2)

    ficha.atributos[atributo] = {
      valor: input_valor.value,
      mod: input_mod.value
    }
  })
}

const update_salvamentos = ()=>{
  ficha.salvamentos = {}
  query('#salvamentos .row:has(table)').forEach(linha=>{
    const salvamento = linha.querySelector('.col').innerText.toLowerCase()
    const valor = linha.querySelector(`[name="valor"]`)
    const atributo_base = linha.querySelector(`[name="bonus_de_atributo"]`).dataset.atributo
    const bonus_de_atributo = linha.querySelector(`[name="bonus_de_atributo"]`)
    const bonus_de_item = Number(linha.querySelector(`[name="bonus_de_item"]`).value)
    const proficiencia = linha.querySelector('[type="radio"]:checked').value

    bonus_de_atributo.value = Number(query(`.${atributo_base.toLowerCase()} [name="mod"]`).value)

    valor.value = bonus_de_item+Number(bonus_de_atributo.value)+proficiencias[proficiencia]()

    ficha.salvamentos[salvamento] = {
        valor: valor.value,
        bonus_de_atributo: bonus_de_atributo.value,
        proficiencia: proficiencia,
        bonus_de_item: bonus_de_item
      }
  })
}

const update_percepção = ()=>{
  const linha = query(`#percepção .row:has(input)`)
  const valor = linha.querySelector('[name="valor"]')
  const bonus_de_atributo = linha.querySelector(`[name="bonus_de_atributo"]`)
  const atributo_base = linha.querySelector('.col:has([name="bonus_de_atributo"]) .texto-menor').innerText
  const proficiencia = linha.querySelector('[type="radio"]:checked').value
  const bonus_de_item = linha.querySelector(`[name="bonus_de_item"]`).value
  bonus_de_atributo.value = Number(query(`.${atributo_base.toLowerCase()} [name='mod']`).value)

  valor.value = Number(bonus_de_item)+Number(bonus_de_atributo.value)+proficiencias[proficiencia]()

  ficha.percepção = {
    valor: valor.value,
    bonus_de_atributo: bonus_de_atributo.value,
    proficiencia: proficiencia,
    bonus_de_item: bonus_de_item
  }
}

let ficha = {}
// ficha.habilidades = []

const importar = (json)=>{
  // console.log(json)

  Object.entries(json).forEach(i=>{
    if (typeof i[1] != 'object') {
      const elemento = document.querySelector(`[name=${i[0]}]`)
      elemento.value = i[1]
    }
  })
  
  //  percepção 
  Object.entries(json.percepção).forEach(i=>{
    const elemento = document.querySelector(`#percepção [name*="${i[0]}"]`)
    if (elemento.type == "radio") {
      query(`[name="${elemento.name}"][value="${i[1]}"]`).checked = true
    } else {
      elemento.value = i[1]
    }
  })

  // jogadas de salvamento
  Object.entries(json.salvamentos).forEach(i=>{
    Object.entries(json.salvamentos[i[0]]).forEach(o=>{
      const elemento = document.querySelector(`.${i[0]} [name*="${o[0]}"]`)
      if (elemento.type == "radio") {
        query(`[name="${elemento.name}"][value="${o[1]}"]`).checked = true
      } else {
        elemento.value = o[1]
      }
    })

  })

  //  cd de classe 
  Object.entries(json.cd_de_classe).forEach(i=>{
    const elemento = document.querySelector(`#CD_classe [name*="${i[0]}"]`)
    if (elemento.type == "radio") {
      query(`[name="${elemento.name}"][value="${i[1]}"]`).checked = true
    } else {
      elemento.value = i[1]
    }
  })

  // atributos
  Object.entries(json.atributos).forEach(i=>{
    Object.entries(json.atributos[i[0]]).forEach(o=>{
      const elemento = document.querySelector(`.${i[0].toLowerCase()} [name*="${o[0]}"]`)
      if (elemento.type == "radio") {
        query(`[name="${elemento.name}"][value="${o[1]}"]`).checked = true
      } else {
        elemento.value = o[1]
      }
    })

  })

  // pericias
  Object.entries(json.pericias).forEach(i=>{
    const div = document.querySelector(`.${i[0].toLowerCase().replace(' ', '_')}`)
    Object.entries(json.pericias[i[0]]).forEach(o=>{
      const elemento = div.querySelector(`[name*="${o[0]}"]`)
      if (elemento) {
        if (elemento.type == "radio") {
          query(`[name="${elemento.name}"][value="${o[1]}"]`).checked = true
        } else {
          elemento.value = o[1]
        }
      }
    })
    

  })
  ajustar_tamanho_input()

  //  CA
  Object.entries(json.ca).forEach(i=>{
    const elemento = document.querySelector(`#CA [name*="${i[0]}"]`)
    if (elemento.type == "radio") {
      query(`[name="${elemento.name}"][value="${i[1]}"]`).checked = true
    } else {
      elemento.value = i[1]
    }
  })

  //  armadura
  Object.entries(json.armadura).forEach(i=>{
    const elemento = document.querySelector(`#armaduras .${i[0]} input`)
    if (elemento.type == "radio") {
      query(`[name="${elemento.name}"][value="${i[1]}"]`).checked = true
    } else {
      elemento.value = i[1]
    }
  })

  //  escudo
  Object.entries(json.escudo).forEach(i=>{
    const elemento = document.querySelector(`#escudo [name*="${i[0]}"]`)
    if (elemento.type == "radio") {
      query(`[name="${elemento.name}"][value="${i[1]}"]`).checked = true
    } else {
      elemento.value = i[1]
    }
  });

  // habilidades
  json.habilidades.forEach(i=>{
    const nova_habilidade = adicionar_habilidade()
    Object.entries(i).forEach(o=>{
      nova_habilidade.querySelector(`[name="${o[0]}"]`).value = o[1]
    })
    nova_habilidade.querySelector('[onclick="salvar_habilidade(this)"]').click()

  })

  // acoes
  json.acoes.forEach(i=>{
    const nova_ação = adicionar_ação()
    Object.entries(i).forEach(o=>{
      nova_ação.querySelector(`[name="${o[0]}"]`).value = o[1]
    })
    nova_ação.querySelector('[onclick="salvar_ação(this)"]').click()

  })

  // ataques 
  json.ataques.forEach(i=>{
    const novo_ataque = adicionar_ataque()
    novo_ataque.querySelector('.dano').remove()
    Object.entries(i).forEach(o=>{
      // console.log(typeof o[1])
      if (o[0] != 'danos') {
        const elemento = novo_ataque.querySelector(`[name*="${o[0]}"]`)
        // console.log(elemento)
        if (elemento.type == "radio") {
          query(`[name="${elemento.name}"][value="${o[1]}"]`).checked = true
        } else {
          elemento.value = o[1]
        }

      } else {
        o[1].forEach(p=>{
          const novo_dano = adicionar_dano(novo_ataque)
          Object.entries(p).forEach(a=>{
            novo_dano.querySelector(`[name="${a[0]}"]`).value = a[1]
          })
        })
      }

    })
    novo_ataque.querySelector('[onclick="salvar_ataque(this)"]').click()
    console.log()

  })

  // inventario
  json.inventario.forEach(i=>{
    const nova_item = adicionar_item()
    Object.entries(i).forEach(o=>{
      nova_item.querySelector(`[name="${o[0]}"]`).value = o[1]
    })
    nova_item.querySelector('[onclick="salvar_item(this)"]').click()
  })

  editar_visualizar()
}

socket.emit('ficha de personagem', url_base().split('/'))
socket.once('retorno ficha', json=>{
  ficha = json
  // console.log(json)
  importar(ficha)
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
  console.log('ficha')
  const div = query('.container.visualizar')
  div.innerHTML = ""
  div.innerHTML += `<div class="titulo"><h1>${ficha.nome.toUpperCase()}</h1> <h1>NIVEL ${ficha.nivel}</h1></div>`
  div.innerHTML += `<hr>`
  let traços = ''
  traços += `<span class="traço tamanho">${ficha.tamanho.toUpperCase()}</span>`
  ficha.tracos.toUpperCase().split(',').forEach(i=>{
    traços += `<span class="traço">${i.replaceAll(' ', '')}</span>`
  })
  div.innerHTML += `<div class="traços">${traços}</div>`
  div.innerHTML += `<div><strong>Percepção</strong> ${ficha.percepção.valor >= 0 ? `+${ficha.percepção.valor}` : ficha.percepção.valor}</div>`
  div.innerHTML += `<div><strong>Idiomas</strong> ${ficha.idiomas}</div>`

  let pericias_treinadas = []
  Object.entries(ficha.pericias).forEach(i=>{
      if (i[1].proficiencia != 'destreinado') {
          let nome_pericia = i[0].includes("Saber") ? `Saber ${i[1].nome}` :  i[0]
          let valor = Number(i[1].valor) < 0 ? `${i[1].valor}` : `+${i[1].valor}`
          pericias_treinadas.push(`${nome_pericia} ${valor}`) 
      }
  })
  div.innerHTML += `<div><strong>Pericias</strong> ${pericias_treinadas.join(', ')}</div>`

  let atributos_valores = []
  Object.entries(ficha.atributos).forEach(i=>{
      let mod = Number(i[1].mod) < 0 ? `${i[1].mod}` : `+${i[1].mod}`
      atributos_valores.push(`<strong>${i[0]}</strong> ${mod}`) 
  })
  div.innerHTML += `<div>${atributos_valores.join(', ')}</div>`
  div.innerHTML += `<hr>`

  let CA_linha = ''
  CA_linha += `<div><strong>CA</strong> ${ficha.ca.valor}; `
  let salvamentos_valores = []
  Object.entries(ficha.salvamentos).forEach(i=>{
      let valor = Number(i[1].valor) < 0 ? `${i[1].valor}` : `+${i[1].valor}`
      let salvamento = i[0].slice(0, 3)
      salvamento[0] = salvamento[0].toUpperCase()
      salvamento = salvamento[0].toUpperCase()+salvamento.slice(1,3)
      salvamentos_valores.push(`<strong>${salvamento}</strong> ${valor}`) 
  })
  CA_linha += `${salvamentos_valores.join(', ')}</div>`
  div.innerHTML += CA_linha
  div.innerHTML += `<div><strong>PV</strong> ${ficha.maxhp}</div>`
  div.innerHTML += `<hr>`
  div.innerHTML += `<div><strong>Velocidade</strong> ${ficha.velocidade} metros</div>`

  ficha.ataques.forEach(i=>{
    let ataque = ''

    ataque += `<div><strong>${i.tracos.toLowerCase().includes('incremento') ? `Distância` : `Corpo a Corpo`} </strong> <img class="ação-icon" src="../../publico/img/${i.acoes}.png"> 
          ${i.nome} ${i.total+i.primeiro_ataque >= 0 ? `+${i.total}` : `${i.total}`} 
           ${i.total+i.segundo_ataque >= 0 ? `+${i.total+i.segundo_ataque}` : `${i.total+i.segundo_ataque}`}  
           ${i.total+i.terceiro_ataque >= 0 ? `+${i.total+i.terceiro_ataque}` : `${i.total+i.terceiro_ataque}`} (${i.tracos}), <strong>Dano</strong>`

    let dano = []
    i.danos.forEach(o=>{
      let bonus_de_atributo_dano = 0
      if (o.atributo_base != '-') {
        bonus_de_atributo_dano = query(`.${o.atributo_base.toLowerCase()} [name="mod"]`).value
      }
      dano.push(`${o.quantidade_de_dados}${o.dado.toLowerCase()}${o.bonus != 0 ? `${o.bonus > 0 ? `+${o.bonus}` : `${o.bonus}`}` : ""}${bonus_de_atributo_dano != 0 ? `${bonus_de_atributo_dano > 0 ? `+${bonus_de_atributo_dano}` : `${bonus_de_atributo_dano}`}` : ""} ${o.tipo}`)
    })

    ataque += ` ${dano.join(' mais ')} </div>`
    div.innerHTML += ataque
  })

  // div.innerHTML += 
  let ações = ''
  ficha.acoes.forEach(i=>{
    if (i.descricao_curta != '') {
      ações += `<div>`
      ações += `<strong>${i.nome}</strong> <img class="ação-icon" src="../../publico/img/${i.tipo}.png"> `
      ações += `${i.acionamento != '' ? `<strong>Acionamento</strong> ${i.acionamento}. ` : ''}`
      ações += `${i.requerimento != '' ? `<strong>Requerimento</strong> ${i.requerimento}. ` : ''}`
      if (i.acionamento || i.requerimento) {
        ações += '<strong>Efeito </strong>'
      }
      ações += `${i.descricao_curta == '...' ? i.descricao : i.descricao_curta}`

      ações += `</div>`
    }
    // `</div>`
  })
  div.innerHTML += ações

  let habilidades = ''
  ficha.habilidades.forEach(i=>{
    if (i.descricao_curta != '') {
      habilidades += `<div>`
      habilidades += `<strong>${i.nome}</strong> ${i.descricao_curta == '...' ? i.descricao : i.descricao_curta}`
      habilidades += `</div>`
    }
  })
  div.innerHTML += habilidades



  


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


//  -------------------------SALVAMENTO-------------------------


//  -------------------------CD DE CLASSE------------------------

const update_CD_classe = ()=>{

  const linha = query('#CD_classe .row:has(input)')
  const [valor, bonus_de_item] = linha.querySelectorAll('[type="number"]')
  const atributo_chave = linha.querySelector('[name="atributo_chave"]').value
  const proficiencia = linha.querySelector('[type="radio"]:checked').value
  if (atributo_chave == '-') {
    valor.value = 10+Number(bonus_de_item.value)+proficiencias[proficiencia]()
  } else {
    const bonus_de_atributo = Number(query(`.${atributo_chave} [name="mod"]`).value)
    valor.value = 10+Number(bonus_de_item.value)+proficiencias[proficiencia]()+bonus_de_atributo
  }

  ficha.cd_de_classe = {
    valor: valor.value,
    atributo_chave: atributo_chave,
    proficiencia: proficiencia,
    bonus_de_item: bonus_de_item.value
  }

}
//  -------------------------CA-------------------------

const update_CA = ()=>{
  const linha = document.querySelector(`#CA .row:has(input)`)
  const [valor, bonus_de_atributo, limite, bonus_de_item] = linha.querySelectorAll('input:not([type="radio"])')
  const proficiencia = linha.querySelector('[type="radio"]:checked').value
  const atributo_base = linha.querySelector('[name="bonus_de_atributo"]').dataset.atributo
  bonus_de_atributo.value = Number(query(`.${atributo_base.toLowerCase()} [name="mod"]`).value)

  let valor_bonus_de_atributo = Number(bonus_de_atributo.value)
  const valor_limite = Number(limite.value)
  if (limite.value) {
    if (valor_bonus_de_atributo > valor_limite) {valor_bonus_de_atributo = valor_limite}
  }
  valor.value = 10+valor_bonus_de_atributo+Number(bonus_de_item.value)+proficiencias[proficiencia]()

  ficha.ca = {
    valor: valor.value,
    bonus_de_atributo: bonus_de_atributo.value,
    limite: limite.value,
    proficiencia: proficiencia,
    bonus_de_item: bonus_de_item.value
  }
}


// Armarduras

const update_armaduras = ()=>{
  ficha.armadura = {
    "sem_armadura": query('#armaduras .sem_armadura :checked').value,
    "leve": query('#armaduras .leve :checked').value,
    "media": query('#armaduras .media :checked').value,
    "pesada": query('#armaduras .pesada :checked').value
  }

}

// escudo

const update_escudo = ()=>{
  ficha.escudo = {
    "valor": query('#escudo [name="valor"]').value,
    "dureza": query('#escudo [name="dureza"]').value,
    "pv_max": query('#escudo [name="pv_max"]').value,
    "limiar": query('#escudo [name="limiar"]').value,
    "pv_atual": query('#escudo [name="pv_atual"]').value
  }
}

const checar_MaxHP = ()=>{
  if (HP.value > MaxHP.value) {HP.value = MaxHP.value}
}

const proficiencia_radio = (proficiencia_atual, funcao)=>{
  if (!proficiencia_atual) {proficiencia_atual='destreinado'}

  let radio = ''
  let numero = Math.ceil(Math.random()*100000)
  Object.keys(proficiencias).forEach(proficiencia=>{
    radio += `<td><span>${proficiencia[0].toUpperCase()}</span><br><input type='radio' name='proficiencia_${numero}' value='${proficiencia}'`
    if (proficiencia == proficiencia_atual) {radio += ' checked '}
    radio += `onchange='${funcao}'`
    radio += `></td>`
  })

  radio = `<table><tr>${radio}</tr></table>`
  return radio
}

query('#geral :is([type="number"], [type="text"])').forEach(input=>{
  input.onchange = update_all
})

query('#geral select').forEach(input=>{
  input.onchange = update_all
})



const gerar_atributos = ()=>{
  let linhas = `<div class="col table_titulo">Atributos</input></div>`
  atributos.forEach(atributo=>{
    atributo_formatado = atributo.toUpperCase().slice(0, 3)
    linhas += `
    <div class="row ${atributo_formatado.toLowerCase()}">
      <div class='col'>
        <label>${atributo_formatado}</label>
      </div>
      <div class='col'>
        <input type='number' onchange='update_all()' name='valor' value=10></input>
        <br>
        <span class='texto-menor'>valor</span>
      </div>
      <div class='col'>
        <input type='number' name='mod' readonly value='0'></input>
        <br>
        <span class='texto-menor'>modificador</span>
      </div>
    </div>
    `
  })


  return linhas
}

const update_pericia = ()=>{
  ficha.pericias = {}
  const pericias_penalidade_armadura = Number(query(`[name='pericias_penalidade_armadura']`).value)

  let penalidade_pericia = 0

  query(`#pericias [name='penalidade']`).forEach(elemento=>{
    elemento.value = pericias_penalidade_armadura
  })
  let nome = ''
  query(`#pericias .row`).forEach((linha, numero)=>{

    if (linha.querySelector('[name="valor"]')) {
      if (linha.querySelector('[name="penalidade"]')) {
        penalidade_pericia = pericias_penalidade_armadura
      } else {
        penalidade_pericia = 0
      }
      
      const [valor, bonus_de_atributo, bonus_de_item] = linha.querySelectorAll('input[type="number"]')
      const proficiencia = linha.querySelector('[type="radio"]:checked').value
      const atributo_base = linha.querySelector('[name="bonus_de_atributo"]').dataset.atributo
      // console.log(atributo_base)
      bonus_de_atributo.value = Number(query(`.${atributo_base} [name='mod']`).value)

      // console.log([valor, bonus_de_atributo, bonus_de_item, proficiencia, atributo_base])

      valor.value = Number(bonus_de_atributo.value)+proficiencias[proficiencia]()+Number(bonus_de_item.value)-penalidade_pericia

      ficha.pericias[pericias[(numero/2)-1]] = {
        nome: nome,
        valor: valor.value,
        bonus_de_atributo: bonus_de_atributo.value,
        proficiencia: proficiencia,
        bonus_de_item: bonus_de_item.value,
        penalidade: penalidade_pericia
      }
      ficha.pericias_penalidade_armadura = pericias_penalidade_armadura

    } else {
      if (linha.querySelector('[name="nome"]')) {
        nome = linha.querySelector('[name="nome"]').value
      }
    }


  })

}

const gerar_pericias = ()=>{
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
    // if (pericia_formatado.includes('ê')) {pericia_formatado = pericia_formatado.replace('ê', 'e')}
    // if (pericia_formatado.includes('ç')) {pericia_formatado = pericia_formatado.replace('ç', 'c')}
    // if (pericia_formatado.includes('ã')) {pericia_formatado = pericia_formatado.replace('ã', 'a')}

    pericia_formatado = pericia_formatado.toLowerCase()

    const atb_base = pericias_atb_base[pericia].toUpperCase().slice(0, 3)

    linhas += `
    <div class="${pericia_formatado}">
    <div class="row">
      <div class='col' >
    `
    if (pericia_formatado.includes('saber')) {
      linhas += `
          <label>${pericia.slice(0, -2)}</label>
          <input type='text' oninput="ajustar_tamanho_input(this)" onchange='update_all()' name='nome'>
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
        <input type='number' name='valor' readonly value=0></input>
        <br>
        <span class='texto-menor'>valor</span>
      </div>
      <div class='col'>
        <input type='number' data-atributo="${atb_base.toLowerCase()}" name='bonus_de_atributo' readonly value='0'></input>
        <br>
        <span class='texto-menor'>${atb_base}</span>
      </div>
      <div class='col'>
        <span class='proficiencia_radio' data-proficiencia='' data-funcao='update_all()'></span>
      </div>
      <div class='col'>
        <input type='number' name='bonus_de_item' value='0' onchange='update_all()'></input>
        <br>
        <span class='texto-menor'>Item</span>
      </div>
    `
    if (atb_base == 'FOR' || atb_base == 'DES') {
      linhas += `
        <div class='col'>
          <input type='number' name='penalidade' readonly value='0'></input>
          <br>
          <span class='texto-menor'>Armadura</span>
        </div>
      `
    }
    linhas += '</div></div>'
  })

  return linhas
}

query('#atributos').innerHTML += gerar_atributos()
query('#pericias').innerHTML += gerar_pericias()

document.querySelectorAll('.proficiencia_radio').forEach(elemento=>{
  elemento.innerHTML = proficiencia_radio(elemento.dataset.proficiencia, elemento.dataset.funcao)
})


const ajustar_tamanho_input = (input)=>{
  const ajustar = (input)=>{
    let hide = input.closest('.col').querySelector('.hide')

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
const adicionar_habilidade = ()=>{
  if (!document.querySelector('.habilidade')) {
    ficha.habilidades = []
  }
  const div = document.createElement('div')
  div.classList.add('habilidade')
  div.innerHTML = `    <div class="editar">
    <div class="row">
      <div class="col">
        <span class="texto-maior">Nome</span><br>
        <input type="text" name="nome">
      </div>
      <div class="col">
        <span class="texto-maior">Tipo</span><br>
        <select name="origem">
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
        <textarea name="descricao" rows="10"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="texto-maior">Descrição curta</span><br>
        <textarea name="descricao_curta" rows="5" placeholder="..."></textarea>
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
  return div
}

const salvar_habilidade = (elemento)=>{
  const div = elemento.closest('.habilidade')
  const nome = div.querySelector('[name="nome"]').value
  const origem = div.querySelector('[name="origem"]').value
  let descrição = div.querySelector('[name="descricao"]').value.replaceAll('\n', '<br>')
  let descrição_curta = div.querySelector('[name="descricao_curta"]').value.replaceAll('\n', '<br>')

  if (descrição.includes('*')) {
    descrição = descrição.replaceAll(/\*.*?\*/g, (group)=>{
      let output = group.replace('*', '<strong>')
      output = output.replace('*', '</strong>')
      return output
    })
  }
  if (descrição_curta.includes('*')) {
    descrição_curta = descrição_curta.replaceAll(/\*.*?\*/g, (group)=>{
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
        <label>${nome}</label>
      </div>
      <div class="col">            
        <span class="texto-menor">${origem}</span>
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

  let posição = 0
  document.querySelectorAll('.habilidade').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.habilidades[posição] = {
      nome: nome,
      origem: origem,
      descricao: descrição,
      descricao_curta: descrição_curta
    }

  update_token()
}

const editar_habilidade = (elemento)=>{
  elemento.closest('.habilidade').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_habilidade = (elemento)=>{
  const div = elemento.closest('.habilidade')
}

const remover_habilidade = (elemento)=>{
  const resposta = confirm('Deseja remover habilidade?')
  if (!resposta) {return}
  const div = elemento.closest('.habilidade')

  let posição = 0
  document.querySelectorAll('.habilidade').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.habilidades.splice(posição ,1)
  div.remove()


  update_token()
}
//  -------------------------AÇÃO-------------------------

const adicionar_ação = ()=>{
  if (!document.querySelector('.acao')) {
    ficha.acoes = []
  }
  const div = document.createElement('div')
  div.classList.add('acao')
  div.innerHTML = `
  <div class="editar">
    <div class="row">
      <div class="col">
        <span class="texto-maior">Nome</span><br>
        <input type="text" name="nome">
      </div>
      <div class="col">
        <span class="texto-maior">Ações</span><br>
        <select name="tipo" onchange="update_ação(this)">
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
        <input type="text" name="tracos">
      </div>
      <div class="col">
        <span class="texto-maior">Pagina</span><br>
        <input type="number" name="pagina">
      </div>
    </div>
    <div class="row">
      <div class="col"> 
        <span class="texto-maior">Requerimentos</span><br>
        <input type="text" name="requerimento">
      </div>
    </div>
    <div class="row acionamento" style="display: none;">
      <div class="col"> 
        <span class="texto-maior">Acionamento</span><br>
        <input type="text" name="acionamento">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="texto-maior">Descrição</span><br>
        <textarea name="descricao" rows="10"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="texto-maior">Descrição curta</span><br>
        <textarea name="descricao_curta" rows="5" placeholder="..."></textarea>
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
  return div
}

const salvar_ação = (elemento)=>{
  const div = elemento.closest('.acao')
  const nome = div.querySelector('[name="nome"]').value
  const tipo = div.querySelector('[name="tipo"]').value
  const pagina = div.querySelector(`[name="pagina"]`).value
  const traços = div.querySelector(`[name="tracos"]`).value
  const requerimentos = div.querySelector(`[name="requerimento"]`).value
  const acionamento = div.querySelector(`[name="acionamento"]`).value
  let descrição = div.querySelector('[name="descricao"]').value.replaceAll('\n', '<br>')
  let descrição_curta = div.querySelector('[name="descricao_curta"]').value.replaceAll('\n', '<br>')

  if (descrição.includes('*')) {
    descrição = descrição.replaceAll(/\*.*?\*/g, (group)=>{
      let output = group.replace('*', '<strong>')
      output = output.replace('*', '</strong>')
      return output
    })
  }
  if (descrição_curta.includes('*')) {
    descrição_curta = descrição_curta.replaceAll(/\*.*?\*/g, (group)=>{
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


  let posição = 0
  document.querySelectorAll('.acao').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.acoes[posição] = {
      nome: nome,
      tipo: tipo,
      tracos: traços,
      pagina: pagina,
      requerimento: requerimentos,
      acionamento: acionamento,
      descricao: descrição,
      descricao_curta: descrição_curta
    }

  update_token()
}

const editar_ação = (elemento)=>{
  elemento.closest('.acao').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_ação = (elemento)=>{
}

const update_ação = (elemento)=>{
  const ação = elemento.value
  if (ação == 'livre' || ação == 'reação') {
    elemento.closest('.acao').querySelector('.acionamento').style.display = ''
    // query('#')
  } else {
    elemento.closest('.acao').querySelector('.acionamento').style.display = 'none'
  }
    
}

const remover_ação = (elemento)=>{
  const resposta = confirm('Deseja remover ação?')
  if (!resposta) {return}
  const div = elemento.closest('.acao')

  let posição = 0
  document.querySelectorAll('.acao').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.acoes.splice(posição ,1)
  div.remove()


  update_token()
}

//  -------------------------ATAQUE-------------------------
const adicionar_ataque = ()=>{
  if (!document.querySelector('.ataque')) {
    ficha.ataques = []
  }
  const div = document.createElement('div')
  div.classList.add('ataque')
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
            <input type="text" name="nome" class="ataque-nome">
          </div>
          <div class="col">
            <span class="texto-maior">Total</span><br>
            <input type="number" name="total" readonly value="0">
          </div>
          <div class="col">
            <span class="texto-maior">ATB</span><br>
            <select onchange="update_ataques(this)" name="atributo_base">
              <!-- <option value="-">-</option> -->
              <option value="FOR">FOR</option>
              <option value="DES">DES</option>
              <option value="CON">CON</option>
              <option value="INT">INT</option>
              <option value="SAB">SAB</option>
              <option value="CAR">CAR</option>
            </select>
          </div>
          <div class="col">
            <span class="proficiencia_radio">${proficiencia_radio('', 'update_ataques(this)')}</span>
          </div>
          <div class="col">
            <span class="texto-maior">Item</span><br>
            <input type="number" onchange="update_ataques(this)" min="0" name="bonus_de_item" value="0">
          </div>
        </div>
        <div class="row">
          <div class="col">
              <span class="texto-maior">Ações</span><br>
              <select name="acoes">
                <option data-valor="ação" value="1">1</option>
                <option data-valor="ação" value="2">2</option>
                <option data-valor="ação" value="3">3</option>
              </select>
          </div>
        </div>
        <div class="row">
          <div class="col">
              <span class="texto-maior">Traços</span><br>
              <input type="text" name="tracos" class="ataque-traços" placeholder="Ágil, Abertura...">
          </div>
        </div>
        <div class="row multiplos-ataques">
          <div class="col">
            <span class="texto-menor">1º</span><br>
            <input type="number" name="primeiro_ataque" value="-0">
          </div>
          <div class="col">
            <span class="texto-menor">2º</span><br>
            <input type="number" name="segundo_ataque" value="-5">
          </div>
          <div class="col">
            <span class="texto-menor">3º</span><br>
            <input type="number" name="terceiro_ataque" value="-10">
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
        <div class="danos"></div>
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
  return div
}
const salvar_ataque = (elemento)=>{

  elemento.closest('.editar').style.display = 'none'

  const div = elemento.closest('.ataque')

  const nome = div.querySelector('[name=nome]').value
  const total = Number(div.querySelector('[name=total]').value)
  const atributo_base = div.querySelector('[name="atributo_base"]').value.toLowerCase()
  const bonus_de_atributo = Number(query(`.${atributo_base} [name="mod"]`).value)
  const proficiencia = proficiencias[div.querySelector('[type=radio]:checked').value]()
  const bonus_de_item = Number(div.querySelector('[name=bonus_de_item]').value)
  const primeiro_ataque = Number(div.querySelector('[name=primeiro_ataque]').value)
  const segundo_ataque = Number(div.querySelector('[name=segundo_ataque]').value)
  const terceiro_ataque = Number(div.querySelector('[name=terceiro_ataque]').value)
  const traços = div.querySelector('[name=tracos]').value
  const ações = div.querySelector('[name=acoes]').value
  // .replaceAll(/\s/g, '')

  let traços_HTML = ''
  if (traços) {
    traços.split(',').forEach(traço=>{
      traços_HTML += `<span class="traço">${traço}</span>`
    })
  }

  let posição = 0
  document.querySelectorAll('.ataque').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.ataques[posição] = {
      nome: nome,
      acoes: ações,
      total: total,
      atributo_base: atributo_base.toUpperCase(),
      proficiencia: div.querySelector('[type=radio]:checked').value,
      bonus_de_item: bonus_de_item,
      tracos: traços,
      primeiro_ataque: primeiro_ataque,
      segundo_ataque: segundo_ataque,
      terceiro_ataque: terceiro_ataque,
      danos: []
    }
  

  let danos = ''
  div.querySelectorAll('.dano').forEach((dano, posição_dano)=>{
    const quantidade_de_dados = Number(dano.querySelector('[name="quantidade_de_dados"]').value)
    const dado = dano.querySelector('[name="dado"]').value
    const bonus = Number(dano.querySelector('[name="bonus"]').value)
    const atributo_base_dano = dano.querySelector('[name="atributo_base"]').value.toLowerCase()
    let bonus_de_atributo_dano = 0
    if (atributo_base_dano != '-') {
      bonus_de_atributo_dano = query(`.${atributo_base_dano} [name="mod"]`).value
    }
    const tipo = dano.querySelector('[name="tipo"]').value

    danos += `
      <p class="texto-maior tab">
        <span data-soma-dano>
          ${quantidade_de_dados}${dado}${bonus != 0 ? `${bonus > 0 ? `+${bonus}` : `${bonus}`}` : ""}${bonus_de_atributo_dano != 0 ? `${bonus_de_atributo_dano > 0 ? `+${bonus_de_atributo_dano}` : `${bonus_de_atributo_dano}`}` : ""}
          <span class="dano-tipo">${tipo}</span>
        </span>
    `
    danos += `</p>`

    ficha.ataques[posição].danos[posição_dano] = {
      quantidade_de_dados: quantidade_de_dados,
      dado: dado,
      bonus: bonus,
      atributo_base: atributo_base_dano.toUpperCase(),
      tipo: tipo
    }

  })

  let linhas = `
    <div class="row button">
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
            
            ${danos ? `<p class="texto-maior">Dano:</p> `+danos : ''}
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


  update_token()
}

const editar_ataque = (elemento)=>{
  elemento.closest('.ataque').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const remover_ataque = (elemento)=>{
  const resposta = confirm('Deseja remover ataque?')
  if (!resposta) {return}
  const div = elemento.closest('.ataque')

  let posição = 0
  document.querySelectorAll('.ataque').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })

  ficha.ataques.splice(posição ,1)
  div.remove()

  update_token()
}

const update_ataques = (elemento)=>{
  const update = ()=>{

    const div = elemento.closest('.ataque')

    const total = div.querySelector('[name=total]')
    const atributo_base = div.querySelector('[name=atributo_base]').value.toLowerCase()
    const bonus_de_atributo = Number(query(`.${atributo_base} [name="mod"]`).value)
    const proficiencia = div.querySelector('[type=radio]:checked').value
    const bonus_de_item = Number(div.querySelector('[name=bonus_de_item]').value)

    total.value = proficiencias[proficiencia]()+bonus_de_item+bonus_de_atributo

    if (div.querySelector('.editar').style.display == 'none') {
      div.querySelector('.mostrar').remove()
      salvar_ataque(elemento.querySelector('[value="salvar"]'))
    }
  }

  if (!elemento) {
    const ataques = document.querySelectorAll('.ataque')
    ataques.forEach(ataque=>{
      elemento = ataque
      update()
    })
  } else {
    update()
  }
}

const adicionar_dano = (elemento)=>{
  const div = document.createElement('div')
  div.classList.add('dano')
  div.innerHTML = `
  <div class="row">
    <div class="col">
        <span class="texto-maior">Dado</span><br>
        <input type="number" name="quantidade_de_dados" value="1">
        <select name="dado">
          <option value="D4">D4</option>
          <option value="D6">D6</option>
          <option value="D8">D8</option>
          <option value="D10">D10</option>
          <option value="D12">D12</option>
        </select>
    </div>
    <div class="col">
        <span class="texto-maior">Bônus</span><br>
        <input type="number" name="bonus" value="0">
    </div>
    <div class="col">
        <span class="texto-maior">ATB</span><br>
        <select name="atributo_base">
          <option value="-">-</option>
          <option value="FOR">FOR</option>
          <option value="DES">DES</option>
          <option value="CON">CON</option>
          <option value="INT">INT</option>
          <option value="SAB">SAB</option>
          <option value="CAR">CAR</option>
        </select>
    </div>
    <div class="col">
        <span class="texto-maior">Tipo</span><br>
        <input type="text" name="tipo" class="ataque-tipo">
    </div>
  </div>
  <div class="row">
    <div class="col">
        <label class="texto-maior" onclick="remover_dano(this)">X</label>
    </div>
  </div>
`
  elemento.closest('.ataque').querySelector('.danos').appendChild(div)
  return div
}

const remover_dano = (elemento)=>{
  const resposta = confirm('Deseja remover dano?')
  if (!resposta) {return}
  const div = elemento.closest('.dano')
  const div_ataque = elemento.closest('.ataque')

  let posição_ataque = 0
  document.querySelectorAll('.ataque').forEach((a,i)=>{
    if (a == div_ataque) {posição_ataque = i}    
  })
  let posição_dano = 0
  elemento.closest('.danos').querySelectorAll('.dano').forEach((a,i)=>{
    if (a == div) {posição_dano = i}    
  })

  try {
    ficha.ataques[posição_ataque].danos.splice(posição_dano ,1)
  } catch(e) {
  }
  div.remove()

  update_token()
}

// ITENS

//  -------------------------inventario-------------------------

// const reordenar_inventario = ()=>{

//   const divs = document.querySelectorAll('#inventario div[data-item]')

//   divs.forEach((div, indice)=>{
//     indice += 1
//     const numero = div.dataset.item.replaceAll(/[^\d]/g, '')

//     div.dataset.item = `ITEM_${indice}`

//     div.querySelectorAll('[name*=ITEM_]').forEach(input=>{
//       input.name = input.name.replaceAll(/\d/g, indice)
//     })

//   })

// }

const editar_item = (elemento)=>{
  // console.log(elemento.closest('[data-item]').querySelector('.editar'))
  elemento.closest('.item').querySelector('.editar').style.display = ''
  elemento.closest('.mostrar').remove()
}

const mostrar_chat_item = (elemento)=>{
  const div = elemento.closest('[data-item]')

  console.log(div.dataset.item.replaceAll(/\D/g, ''))
}

const salvar_item = (elemento)=>{

  const div = elemento.closest('.item')

  const nome = div.querySelector('[name*="nome"]').value
  let volume = div.querySelector('[name*="volume"]').value
  const custo = div.querySelector(`[name*="custo"]`).value
  const peça = div.querySelector(`[name*="peca"]`).value
  const quantidade = div.querySelector(`[name*="quantidade"]`).value

  volume = volume.includes(' ') ? volume.replaceAll(/\s/g, '') : volume

  volume = volume.match(/\d/) ? Number(volume) : volume.toUpperCase()


  let descrição = div.querySelector('[name*="descricao"]').value.replaceAll('\n', '<br>')
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


  let posição = 0
  document.querySelectorAll('.item').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })
  // console.log(posição)
  // console.log([nome,volume,custo,peça,quantidade,descrição])

  ficha.inventario[posição] = {
      nome: nome,
      volume: volume,
      custo: custo,
      peca: peça,
      quantidade: quantidade,
      descricao: descrição
    }

  update_token()
}

const remover_item = (elemento)=>{
  const resposta = confirm('Deseja remover item?')
  if (!resposta) {return}
  const div = elemento.closest('.item')

  let posição = 0
  document.querySelectorAll('.item').forEach((a,i)=>{
    if (a == div) {posição = i}    
  })
  ficha.inventario.splice(posição ,1)
  div.remove()

  update_token()
}

const adicionar_item = ()=>{

  if (!document.querySelector('.item')) {
    ficha.inventario = []
  }
  const add = (numero)=>{
    const div = document.createElement('div')
    div.className = `item`
    div.innerHTML = `

    <div class="editar">
      <div class="row">
        <div class="col">
          <span class="texto-maior">Nome</span><br>
          <input type="text" name="nome">
        </div>
        <div class="col">
          <span class="texto-maior">Vol.</span><br>
          <input type="text" name="volume" value="-">
        </div>
        <div class="col">
          <span class="texto-maior">Custo</span><br>
          <input type="number" name="custo">
          <select name="peca">
            <option value="PC">PC</option>
            <option value="PP" selected>PP</option>
            <option value="PO">PO</option>
            <option value="PL">PL</option>
          </select>
        </div>
        <div class="col">
          <span class="texto-menor">QUANT</span><br>
          <input type="number" name="quantidade" value="1">
        </div>
      </div>
      <div class="row">
      </div>
      <div class="row">
        <div class="col">
          <span class="texto-maior">Descrição <input type="checkbox" onclick="mostrar_enconder_descrição_item(this)"></span><br>
          <textarea name="descricao" rows="10" style="display: none;"></textarea>
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

    return div
  }
  const botões_remover = document.querySelectorAll('#inventario [value="remover"]')

  let valor = botões_remover.length+1

  return add(valor)

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

editar_visualizar()