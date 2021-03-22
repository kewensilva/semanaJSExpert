(() => {



  const BTN_REINICIAR = "btnReiniciar"
  const ID_CONTADOR = "contatdor"
  const VALOR_CONTADOR = 100
  const PERIODO_INTERVALO = 10

  class contadorComponent {

    constructor() {
      this.inicializar()
    }

    prepararContadorProxy() {
      const handler = {
        set: (currentContext, propertyKey, newValue) => {
          console.log({ currentContext, propertyKey, newValue });
          if (!currentContext.valor) {
            currentContext.efetuarParada()
          }
          currentContext[propertyKey] = newValue
          return true
        }
      }
      const contador = new Proxy({
        valor: VALOR_CONTADOR,
        efetuarParada: () => { }
      }, handler)
      return contador
    }

    atualizarTexto = ({ elementoContador, contador }) => () => {
      const identificadorTexto = '$$contador'
      const textoPadrão = `começando em <strong>${identificadorTexto}</strong> segundos...`
      elementoContador.innerHTML = textoPadrão.replace(identificadorTexto, contador.valor--)
    }
    agendarParadaContatdor({ elementoContador, idIntervalo }) {
      return () => {
        clearInterval(idIntervalo)
        elementoContador.innerHTML = ""
        this.desabilitarBotao(false)
      }
    }
    prepararBotao(elementoBotao, iniciarFn) {
      elementoBotao.addEventListener('click', iniciarFn.bind(this))
      return (valor = true) => {
        const atributo = 'disabled'
        if (valor) {
          elementoBotao.setAttribute(atributo, valor)
          return;
        }
        elementoBotao.removeAttribute(atributo)
      }
    }

    inicializar() {
      const elementoContador = document.getElementById(ID_CONTADOR)
      const contador = this.prepararContadorProxy()
      const argumento = {
        elementoContador,
        contador
      }

      const fn = this.atualizarTexto(argumento)
      const idIntervalo = setInterval(fn, PERIODO_INTERVALO)

      {
        const elementoBotao = document.getElementById(BTN_REINICIAR)
        const argumentos = { elementoContador, idIntervalo }
        const desabilitarBotao = this.prepararBotao(elementoBotao, this.inicializar)
        desabilitarBotao()
        const paraContatdorFn = this.agendarParadaContatdor.apply({ desabilitarBotao }, [argumentos]);
        contador.efetuarParada = paraContatdorFn
      }
    }

  }
  window.contadorComponent = contadorComponent
})()