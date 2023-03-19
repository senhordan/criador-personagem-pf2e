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
        // col.style.background = '#5A0A00'
        col.style.background = 'linear-gradient(0deg, #112352 0%, #152b61 100%)'

      } else {
        col.innerText = 'Editar'
        // col.style.background = '#13265F'
        col.style.background = 'linear-gradient(0deg, #420700 0%, #5a0a00 100%)'

      }
    }

    const update_all = ()=>{
      update_CA()
      update_salvamentos()
      update_percepção()
      update_pericia()
      update_CD_classe()
    }

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

    const update_percepção = ()=>{
      percepção_valor_input = query(`[name='PERCEPCAO']`)
      percepção_bonus_input = query(`[name='PERCEPCAO_SAB_BONUS']`)
      percepção_proficiencia = query(`[name='PERCEPCAO_PROFICIENCIA']:checked`).value
      percepção_item = query(`[name='PERCEPCAO_BONUS_ITEM']`).value

      percepção_bonus_input.value = Number(query(`[name='SAB_MOD']`).value)
      percepção_valor_input.value = Number(percepção_item)+Number(percepção_bonus_input.value)+proficiencias[percepção_proficiencia]()

    }


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

    const tendência_update_color = ()=>{
      query('#tendência td').forEach(i=>{
        i.style.backgroundColor = '#5A0A00'
        // i.style.backgroundColor = '#13265F'
      })
    }
    query('#tendência td').forEach(td=>{
      td.onclick = ()=>{
        tendência_update_color()
        query('[name="TENDENCIA"]').forEach(i=>{i.value = td.dataset.tendencia})
        td.style.backgroundColor = '#13265F'
        toggle_tendencia()
        // td.style.backgroundColor = '#5A0A00'
      }
    })

    const toggle_tendencia = ()=>{
      const elemento = query('#tendência')
      if (elemento.style.display == 'none') {
        elemento.style.display = ''
      } else {
        elemento.style.display = 'none'
      }
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
        if(linha.querySelectorAll('.col').length == 10) {
          penalidade_pericia = 0
        } else {
          penalidade_pericia = pericias_penalidade_armadura
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
              <input type='text' onchange='update_pericia()'  name='${pericia_formatado}_tipo'></input>
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

    query('#pericias [name*="_tipo"]').forEach(input=>{
      input.oninput = ()=>{
        input_caracteres = input.value.length
        caractere_tamanho = 14.4

        if (input_caracteres*caractere_tamanho >= 72) {
          input.style.width = `${input_caracteres*caractere_tamanho}px`
        } else {
          input.style.width = `72px`
        }
      }
    })

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

    const reordenar_habilidades = ()=>{

      const divs = document.querySelectorAll('#habilidades_talentos div[data-habilidade]')

      divs.forEach((div, indice)=>{
        indice += 1
        const numero = div.dataset.habilidade.replaceAll(/[^\d]/g, '')
        // console.log(numero)
        // console.log(`${indice}`)

        div.dataset.habilidade = `HABILIDADE_${indice}`

        query(`[name="HABILIDADE_${numero}_NOME"]`).name = `HABILIDADE_${indice}_NOME`
        query(`[name="HABILIDADE_${numero}_TIPO"]`).name = `HABILIDADE_${indice}_TIPO`
        query(`[name="HABILIDADE_${numero}_DESCRICAO"]`).name = `HABILIDADE_${indice}_DESCRICAO`

      })

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
      const descrição = div.querySelector('[name*="DESCRICAO"]').value.replaceAll('\n', '<br>')
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


    // asssssssssssssssssssssssssssssssssssssssssssssssssss

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
        console.log(numero)
        console.log(`${indice}`)

        div.dataset.ação = `ACAO_${indice}`

        query(`[name="ACAO_${numero}_NOME"]`).name = `ACAO_${indice}_NOME`
        query(`[name="ACAO_${numero}_TIPO"]`).name = `ACAO_${indice}_TIPO`
        query(`[name="ACAO_${numero}_DESCRICAO"]`).name = `ACAO_${indice}_DESCRICAO`
        query(`[name="ACAO_${numero}_PAGINA"]`).name = `ACAO_${indice}_PAGINA`
        query(`[name="ACAO_${numero}_TRACOS"]`).name = `ACAO_${indice}_TRACOS`
        query(`[name="ACAO_${numero}_REQUERIMENTO"]`).name = `ACAO_${indice}_REQUERIMENTO`
        query(`[name="ACAO_${numero}_ACIONAMENTO"]`).name = `ACAO_${indice}_ACIONAMENTO`

      })

    }

    const remover_ação = (elemento)=>{
      elemento.closest('[data-ação]').remove()
      reordenar_ações()
    }

    const update_ação = (elemento)=>{
      console.log(elemento.closest('[data-ação]'))
      const ação = elemento.value
      if (ação == 'livre' || ação == 'reação') {
        elemento.closest('[data-ação]').querySelector('.acionamento').style.display = ''
        elemento.closest('[data-ação]').querySelector('.acionamento input').disabled = 0
        // query('#')
      } else {
        elemento.closest('[data-ação]').querySelector('.acionamento').style.display = 'none'
        elemento.closest('[data-ação]').querySelector('.acionamento input').disabled = 1
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
              <input type="text" name="ACAO_${numero}_ACIONAMENTO" disabled>
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
    // query('#adicionar_habilidade').addEventListener('click', adicionar_habilidade)

    