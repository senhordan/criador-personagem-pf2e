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