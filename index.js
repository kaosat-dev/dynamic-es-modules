if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker-test.js').then(function (reg) { //, { scope: './' }
    if (reg.installing) {
      console.log('Service worker installing')
    } else if (reg.waiting) {
      console.log('Service worker installed')
    } else if (reg.active) {
      console.log('Service worker active')
    }
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error)
  })
}

function send_message_to_sw (msg) {
  return new Promise(function (resolve, reject) {
    // Create a Message Channel
    var msg_chan = new MessageChannel()

    // Handler for recieving message reply from service worker
    msg_chan.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error)
      } else {
        resolve(event.data)
      }
    }

    // Send message to service worker along with port for reply
    navigator.serviceWorker.controller.postMessage(msg, [msg_chan.port2])
  })
}

const createModule = (name, source) => {
  if (source.includes(`'@jscad`)) {
    source = source.replace(`from '@jscad/core'`, `from './@jscad/core'`)
  }

  const script = document.createElement('script')
  script.text = source
  script.type = 'module'

  // script.src = './main.js'
  // script.name = 'main'
  document.body.appendChild(script)
  send_message_to_sw({ name, source })
}

document.getElementById('createModule').addEventListener('click', function () {
  send_message_to_sw({ name: 'reset' })
  document.getElementById('consoleOut').innerText = ''
  // const oldConsole = console.log

  console.log = (...bla) => {
    document.getElementById('consoleOut').innerText += `${JSON.stringify(bla)}\n`
  }
  // console.log('module', window)
  const othermoduleContent = document.getElementById('secondDynamicModule').value
  createModule('other.js', othermoduleContent)

  const moduleContent = document.getElementById('mainDynamicModule').value
  createModule('index.js', moduleContent)
})
