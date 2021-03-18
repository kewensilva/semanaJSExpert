const BTN_REINICIAR = "btnReiniciar"
const ID_CONTADOR = "contatdor"
const VALOR_CONTADOR = 1000
const PERIODO_INTERVALO = 100

class contadorComponent {

  constructor() {
    this.inicializar()
  }

  prepararContadorProxy() {
    const handler = {
      set: (currentContext, propertyKey, newValue) => {
        console.log({ currentContext, propertyKey, newValue });
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
    elementoContador.innerHTML = textoPadrão.replace(identificadorTexto, contador.valor++)
  }
  agendarParadaContatdor({ elementoContador, idIntervalo }) {
    return () => {
      clearInterval(idIntervalo)
      elementoContador.innerHTML = ""
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
      const argumentos = { elementoContador, idIntervalo }
      const paraContatdorFn = this.agendarParadaContatdor(argumentos)
    }
    // this.atualizarTexto(argumento)
    // this.atualizarTexto(argumento)
    // this.atualizarTexto(argumento)
  }
}