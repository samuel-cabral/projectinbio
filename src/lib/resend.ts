import 'server-only'

import { Resend } from 'resend'

// Remetente de teste da Resend — funciona sem domínio verificado, mas em modo
// teste só entrega para o e-mail da própria conta. Trocar por um endereço de
// domínio verificado (ex: contato@luzomind.com) ao configurar DNS na Resend.
const DEFAULT_FROM = 'ProjectInBio <onboarding@resend.dev>'

let _resend: Resend | null = null
let _warned = false

function getResend(): Resend | null {
  if (_resend) return _resend
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (!_warned) {
      console.warn('[resend] RESEND_API_KEY ausente — envio de e-mails desabilitado')
      _warned = true
    }
    return null
  }
  _resend = new Resend(apiKey)
  return _resend
}

type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

/**
 * Envia um e-mail via Resend. Nunca lança: sem API key entra em no-op
 * silencioso, e qualquer falha é logada sem quebrar o fluxo do chamador.
 */
export async function sendEmail({ from = DEFAULT_FROM, ...rest }: SendEmailOptions): Promise<void> {
  const resend = getResend()
  if (!resend) return

  try {
    const { error } = await resend.emails.send({ from, ...rest })
    if (error) {
      console.error('[resend] envio falhou:', error)
    }
  } catch (error) {
    console.error('[resend] envio lançou exceção:', error)
  }
}
