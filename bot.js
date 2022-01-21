import TelegramBot from 'node-telegram-bot-api'
import pjson from 'pjson'
import dotenv from 'dotenv'

dotenv.config()

console.log(`Booting up ${pjson.name} - v${pjson.version}`)

const bot = new TelegramBot(process.env.TOKEN, { polling: true })

const commands = [
  {
    command: '/commands',
    description: 'Get commands list'
  },
  {
    command: '/help',
    description: 'I give you basic info about me'
  }
]

if (process.env.PAYMENT_TOKEN) {
  commands.push({
    command: '/contribute',
    description: 'Contribute to this project with a small contribution'
  })
}

bot.setMyCommands(commands)

bot.on('message', (msg) => {
  // Do things on message received
  console.log('New message!')
})

bot.onText(/\/help/, async (msg, match) => {
  let text = `${pjson.name}\nv${pjson.version}\n` +
        `Source code <a href="${pjson.repository.url}">here</a>`
  if (process.env.PAYMENT_TOKEN) {
    text = text + '\n\nSupport this project with /support'
  }
  bot.sendMessage(msg.chat.id, text,
    {
      parse_mode: 'HTML'
    })
})

bot.onText(/\/commands/, (msg, match) => {
  let text = `Available commands (v${pjson.version})\n\n`
  commands.forEach(c => {
    text = text + `${c.command} - ${c.description}\n\n`
  })
  bot.sendMessage(msg.chat.id, text)
})

bot.onText(/\/contribute/, (msg, match) => {
  if (!process.env.PAYMENT_TOKEN) return
  bot.sendInvoice(msg.chat.id, 'Support this project', 'Help to keep this project alive with a small contribution', pjson.name, process.env.PAYMENT_TOKEN, null, 'EUR', [{
    label: 'Contribution',
    amount: 100 // Cents
  }])
})

bot.on('polling_error', (e) => console.log(e))
