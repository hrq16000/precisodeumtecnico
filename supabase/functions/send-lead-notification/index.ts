import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  name: string;
  email: string;
  phone: string;
  service?: string;
  city?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send lead notification");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadNotificationRequest = await req.json();
    console.log("Lead data received:", { name: leadData.name, email: leadData.email, service: leadData.service });

    // Email to the business owner
    const businessEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1565c0, #0288d1); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1565c0; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #1565c0; }
          .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #ff9800; margin-top: 10px; }
          .cta { display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎯 Novo Lead Recebido!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Preciso de Um Técnico</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Nome</div>
              <div class="value">${leadData.name}</div>
            </div>
            <div class="field">
              <div class="label">📧 E-mail</div>
              <div class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
            </div>
            <div class="field">
              <div class="label">📱 Telefone/WhatsApp</div>
              <div class="value">${leadData.phone}</div>
            </div>
            ${leadData.service ? `
            <div class="field">
              <div class="label">🔧 Serviço Solicitado</div>
              <div class="value">${leadData.service}</div>
            </div>
            ` : ''}
            ${leadData.city ? `
            <div class="field">
              <div class="label">📍 Cidade</div>
              <div class="value">${leadData.city}</div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">💬 Mensagem</div>
              <div class="message-box">${leadData.message.replace(/\n/g, '<br>')}</div>
            </div>
            <a href="https://wa.me/55${leadData.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(leadData.name)}! Recebemos sua solicitação no Preciso de Um Técnico. Como posso ajudá-lo?" class="cta">
              💬 Responder via WhatsApp
            </a>
          </div>
          <div class="footer">
            Este e-mail foi enviado automaticamente pelo sistema Preciso de Um Técnico.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send notification to business owner using Resend API directly
    const businessEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preciso de Um Técnico <onboarding@resend.dev>",
        to: ["contato@precisodeumtecnico.com"], // Change to actual business email
        subject: `🎯 Novo Lead: ${leadData.name} - ${leadData.service || 'Serviço Geral'}`,
        html: businessEmailHtml,
      }),
    });

    const businessResult = await businessEmailResponse.json();
    console.log("Business notification email result:", businessResult);

    // Email confirmation to the customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1565c0, #0288d1); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
          .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .cta { display: inline-block; background: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
          .cta-phone { display: inline-block; background: #1565c0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
          .footer { background: #333; color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
          .footer a { color: #4fc3f7; }
          ul { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Recebemos sua Solicitação!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Preciso de Um Técnico</p>
          </div>
          <div class="content">
            <p>Olá <strong>${leadData.name}</strong>,</p>
            <p>Recebemos sua solicitação de serviço técnico e nossa equipe já está analisando!</p>
            
            <div class="highlight">
              <p style="margin: 0;"><strong>📋 Resumo da sua solicitação:</strong></p>
              ${leadData.service ? `<p style="margin: 10px 0 0 0;">🔧 Serviço: <strong>${leadData.service}</strong></p>` : ''}
              ${leadData.city ? `<p style="margin: 5px 0 0 0;">📍 Cidade: <strong>${leadData.city}</strong></p>` : ''}
            </div>
            
            <p><strong>O que acontece agora?</strong></p>
            <ul>
              <li>Nossa equipe vai analisar sua solicitação</li>
              <li>Entraremos em contato em breve com um orçamento</li>
              <li>Você pode agendar o melhor horário para o atendimento</li>
            </ul>
            
            <p><strong>Precisa de atendimento mais rápido?</strong></p>
            <p style="text-align: center;">
              <a href="https://wa.me/5541997452053?text=Olá! Acabei de enviar uma solicitação pelo site e gostaria de um atendimento mais rápido." class="cta">💬 WhatsApp 24h</a>
              <a href="tel:+5541997452053" class="cta-phone">📞 Ligar Agora</a>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;"><strong>Preciso de Um Técnico</strong></p>
            <p style="margin: 5px 0;">A maior rede de técnicos do Brasil</p>
            <p style="margin: 10px 0 0 0;"><a href="https://precisodeumtecnico.com">precisodeumtecnico.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Preciso de Um Técnico <onboarding@resend.dev>",
        to: [leadData.email],
        subject: "✅ Recebemos sua solicitação - Preciso de Um Técnico",
        html: customerEmailHtml,
      }),
    });

    const customerResult = await customerEmailResponse.json();
    console.log("Customer confirmation email result:", customerResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        businessEmail: businessResult,
        customerEmail: customerResult 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
