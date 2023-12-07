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
  // console.log(selector)
    const elements = document.querySelectorAll(selector)
    if (elements.length == 1) {
        return elements[0]
    } else {
        return elements
    }
}

const Token = {
  "dados": {
    datasets: [{
      data: [0, 100],
      backgroundColor: ['red', 'green']
    }],

    // labels: ['Vermelho', 'Amarelo']
  },
  "opcoes": {
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.yLabel;
        }
      }
    }
  },

  "gerar": function (elemento) {
    const tokenHP = new Chart(elemento, {
      type: 'doughnut',
      data: this.dados,
      options: this.opcoes
    });

    this.propriedades = tokenHP
  },

  "update": function (maxHP, HP) {
    porcentagem_HP = (100*HP)/maxHP
    porcentagem_dano = 100-porcentagem_HP
    this.propriedades.config.data.datasets[0].data[0] = porcentagem_dano
    this.propriedades.config.data.datasets[0].data[1] = porcentagem_HP
    this.propriedades.update()

  }
}

const HP = {
  "novo": function (elemento, Max_HP, HP) {
    const background = document.createElement('div')
    const bar = document.createElement('div')
    background.style.minHeight = '1em'
    background.style.borderRadius = '3px'
    background.style.outline = 'groove 2px'
    bar.style.minHeight = '1em'
    bar.style.backgroundColor = '#1b991b'
    bar.style.width = '0%'
    bar.transition = 'width 0.5s ease-out 0s'
    bar.dataset.hp = 0
    bar.dataset.max_hp = 1000
    background.appendChild(bar)
    elemento.appendChild(background)
    this.background = background
    this.bar = bar
    this.update(Max_HP, HP)
  },
  "update": function (...args) {
    let HP = args[1]
    let Max_HP = args[0]

    hp_antigo = Number(this.bar.dataset.hp)
    max_hp_antigo = Number(this.bar.dataset.max_hp)

    if (args.length == 1) {
      Max_HP = Number(this.bar.dataset.max_hp)
      HP = args[0]
    }

    if (HP>Max_HP) {return}

    this.porcentagem_HP_antigo = Math.round((100*hp_antigo)/max_hp_antigo)
    this.porcentagem_HP = Math.round((100*HP)/Max_HP)

    this.bar.dataset.hp = HP
    this.bar.dataset.max_hp = Max_HP
    // console.log([this.porcentagem_HP_antigo,this.porcentagem_HP])
    if (this.porcentagem_HP_antigo - this.porcentagem_HP > 0) {
      // console.log('diminuiu')
      this.operador = -3
      this.animation()
    } else if (this.porcentagem_HP_antigo - this.porcentagem_HP < 0) {
      // console.log('aumentou')
      this.operador = +3
      this.animation()
    } else {
      // console.log('igual')
      this.bar.style.width = `${this.porcentagem_HP}%`
      this.bar.style.backgroundColor = `hsl(${this.porcentagem_HP}deg 100% 36.08%)`
    }
    // this.bar.style.width = `${this.porcentagem_HP}%`
    // this.update_color()
  },
  "animation": function () {

    this.porcentagem_HP_antigo += this.operador
    this.bar.style.backgroundColor = `hsl(${this.porcentagem_HP_antigo}deg 100% 36.08%)`
    this.bar.style.width = `${this.porcentagem_HP_antigo}%`

    if (Math.abs(this.porcentagem_HP_antigo - this.porcentagem_HP) <= 5) {
      if(this.operador > 0){this.operador = +0.5} else {this.operador = -0.5}
    }

    if (this.porcentagem_HP_antigo != this.porcentagem_HP) {
      requestAnimationFrame(this.animation.bind(this))
    }

  },
  "update_color": function () {
    // console.log(this.bar.style.width)
    // console.log(this.bar.style.backgroundColor)
  } 

}

const form = (array)=>{
  const form = document.createElement('form')
  form.method = 'post'
  form.style.display = 'none'
  array.forEach(i=>{
    console.log(i)
    const input = document.createElement('input')
    input.name = i.nome
    input.value = i.valor
    form.appendChild(input)

  })

  document.body.appendChild(form)
  form.submit()
}

const convert = ()=>{
  nova_ficha = {}
  nova_ficha.nome = obj.NOME,
  nova_ficha.ancestralidade_e_heranca = obj.ANCESTRALIDADE_E_HERANCA,
  nova_ficha.biografia = obj.BIOGRAFIA,
  nova_ficha.classe = obj.CLASSE,
  nova_ficha.divindade = obj.DIVINDADE,
  nova_ficha.idiomas = obj.IDIOMAS,
  nova_ficha.sentidos = obj.SENTIDOS,
  nova_ficha.resistencias_imunidades = obj.RESISTENCIAS_IMUNIDADES,
  nova_ficha.tracos = obj.TRACOS,
  nova_ficha.nivel = obj.NIVEL,
  nova_ficha.maxhp = obj.MaxHP,
  nova_ficha.hp = obj.HP,
  nova_ficha.velocidade = obj.VELOCIDADE,
  nova_ficha.tamanho = obj.TAMANHO,
  nova_ficha.visao = obj.VISAO,
  nova_ficha.percepcao = {
    "valor": obj.PERCEPCAO,
    "bonus_de_atributo": obj.PERCEPCAO_SAB_BONUS,
    "proficiencia": obj.PERCEPCAO_PROFICIENCIA,
    "bonus_de_item": obj.PERCEPCAO_BONUS_ITEM
  };

  nova_ficha.salvamentos = {
    "fortitude": {
      "valor": obj.FORTITUDE,
      "bonus_de_atributo": obj.FORTITUDE_CON_BONUS,
      "proficiencia": obj.FORTITUDE_PROFICIENCIA,
      "bonus_de_item": obj.FORTITUDE_BONUS_ITEM
    },
    "reflexos": {
      "valor": obj.REFLEXOS,
      "bonus_de_atributo": obj.REFLEXOS_DES_BONUS,
      "proficiencia": obj.REFLEXOS_PROFICIENCIA,
      "bonus_de_item": obj.REFLEXOS_BONUS_ITEM
    },
    "vontade": {
      "valor": obj.VONTADE,
      "bonus_de_atributo": obj.VONTADE_SAB_BONUS,
      "proficiencia": obj.VONTADE_PROFICIENCIA,
      "bonus_de_item": obj.VONTADE_BONUS_ITEM
    }
  }
  nova_ficha.cd_de_classe = {
    "valor": obj.CD_CLASSE,
    "bonus_de_atributo": obj.CD_CLASSE_ATB_BONUS,
    "proficiencia": obj.CD_CLASSE_PROFICIENCIA,
    "bonus_de_item": obj.CD_CLASSE_BONUS_ITEM
  }
  nova_ficha.atributos = {
    "for": {
      "valor": obj.FOR,
      "mod": obj.FOR_MOD
    },
    "des": {
      "valor": obj.DES,
      "mod": obj.DES_MOD
    },
    "con": {
      "valor": obj.CON,
      "mod": obj.CON_MOD
    },
    "int": {
      "valor": obj.INT,
      "mod": obj.INT_MOD
    },
    "sab": {
      "valor": obj.SAB,
      "mod": obj.SAB_MOD
    },
    "car": {
      "valor": obj.CAR,
      "mod": obj.CAR_MOD
    }
  }
  nova_ficha.pericias_penalidade_armadura = obj.pericias_penalidade_armadura

  nova_ficha.pericias = {};

  ["ACROBATISMO","ARCANISMO","ATLETISMO","DIPLOMACIA","DISSIMULACAO","FURTIVIDADE","INTIMIDACAO","LADROAGEM","MANUFATURA","MEDICINA","NATUREZA","OCULTISMO","PERFORMANCE","RELIGIAO","SABER_1","SABER_2","SOBREVIVENCIA","SOCIEDADE"].forEach(i=>{
    let nome = ''
    const valor = query(`[name="${i}"]`).value
    const atributo = query(`[name="${i}_BONUS_ATB"]`).value
    const proficiencia = query(`[name="${i}_PROFICIENCIA"]:checked`).value
    const item = query(`[name="${i}_BONUS_ITEM"]`).value
    if (query(`[name="${i}_tipo"]`).value) {
      nome = query(`[name="${i}_tipo"]`).value
    }

    penalidade = query(`[name="${i}_penalidade"]`).value

    nova_ficha.pericias[i.toLowerCase()] = {
      "nome": nome,
      "valor": valor,
      "bonus_de_atributo": atributo,
      "proficiencia": proficiencia,
      "bonus_de_item": item,
      "penalidade": penalidade
    }
  })
  nova_ficha.ca = {
    "valor": obj.CA,
    "bonus_de_atributo": obj.CA_DES_BONUS,
    "limite": obj.CA_LIMITE,
    "proficiencia": obj.CA_PROFICIENCIA,
    "bonus_de_item": obj.CA_BONUS_ITEM
  }
  nova_ficha.armadura = {
    "sem_armadura": obj.defesa_sem_armadura,
    "leve": obj.armadura_leve,
    "media": obj.armadura_media,
    "pesada": obj.armadura_pesada
  }
  nova_ficha.escudo = {
    "valor": obj.escudo,
    "dureza": obj.escudo_dureza,
    "pv_max": obj.escudo_pv_max,
    "limiar": obj.escudo_limiar,
    "pv_atual": obj.escudo_pv_atual
  }
  nova_ficha.habilidades = []
  document.querySelectorAll('[data-habilidade*="HABILIDADE"]').forEach(i=>{
    nova_ficha.habilidades.push({
      "nome": i.querySelector('[name*="NOME"]').value,
      "origem": i.querySelector('[name*="TIPO"]').value,
      "descricao": i.querySelector('[name*="DESCRICAO"]').value
    })
  })

  nova_ficha.acoes = []
  document.querySelectorAll('[data-ação*="ACAO"]').forEach(i=>{
    // console.log(i)
    nova_ficha.acoes.push({
      "nome": i.querySelector('[name*="NOME"]').value,
      "tipo": i.querySelector('[name*="TIPO"]').value,
      "tracos": i.querySelector('[name*="TRACOS"]').value,
      "pagina": i.querySelector('[name*="PAGINA"]').value,
      "requerimento": i.querySelector('[name*="REQUERIMENTO"]').value,
      "acionamento": i.querySelector('[name*="ACIONAMENTO"]').value,
      "descricao": i.querySelector('[name*="DESCRICAO"]').value
    })
  })
  nova_ficha.ataques = []
  document.querySelectorAll('[data-ataque*="ATAQUE"]').forEach(i=>{
    console.log(i)
    const danos = []
    i.querySelectorAll('[data-dano*="DANO"]').forEach(ii=>{
      danos.push({
        "quantidade_de_dados": ii.querySelector('[name*="DADO_QUANTIDADE"]').value,
        "dado": ii.querySelector('[name$="DADO"]').value,
        "bonus": ii.querySelector('[name*="BONUS"]').value,
        "atributo_base": ii.querySelector('[name*="ATRIBUTO"]').value,
        "tipo": ii.querySelector('[name*="TIPO"]').value
      })
    })

    nova_ficha.ataques.push({
      "nome": i.querySelector('[name*="NOME"]').value,
      "total": i.querySelector('[name*="TOTAL"]').value,
      "atributo_base": i.querySelector('[name*="ATRIBUTO"]').value,
      "proficiencia": i.querySelector('[name*="PROFICIENCIA"]').value,
      "bonus_de_item": i.querySelector('[name*="ITEM"]').value,
      "tracos": i.querySelector('[name*="TRACOS"]').value,
      "primeiro_ataque": i.querySelector('[name*="PRIMEIRO"]').value,
      "segundo_ataque": i.querySelector('[name*="SEGUNDO"]').value,
      "terceiro_ataque": i.querySelector('[name*="TERCEIRO"]').value,
      "danos": danos
    })

  })
  console.log(nova_ficha.ataques)

  nova_ficha.inventario = []
  document.querySelectorAll('[data-item*="ITEM"]').forEach(i=>{
    // console.log(i)
    nova_ficha.inventario.push({
      "nome": i.querySelector('[name*="NOME"]').value,
      "volume": i.querySelector('[name*="VOLUME"]').value,
      "custo": i.querySelector('[name*="CUSTO"]').value,
      "peca": i.querySelector('[name*="PECA"]').value,
      "quantidade": i.querySelector('[name*="QUANTIDADE"]').value,
      "descricao": i.querySelector('[name*="DESCRICAO"]').value
    })
  })
  
  

}