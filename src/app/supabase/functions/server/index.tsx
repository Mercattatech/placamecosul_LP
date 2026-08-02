import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Inicializar Supabase Client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Criar bucket de imagens na inicialização
const bucketName = "make-41141608-gallery";
const initStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
      });
      if (error) {
        console.log(`Erro ao criar bucket: ${error.message}`);
      } else {
        console.log(`Bucket ${bucketName} criado com sucesso`);
      }
    }
  } catch (error) {
    console.log(`Erro ao inicializar storage: ${error}`);
  }
};
initStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Analytics-Password"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-41141608/health", (c) => {
  return c.json({ status: "ok" });
});

// Galeria de imagens - GET (buscar imagens)
app.get("/make-server-41141608/gallery-images", async (c) => {
  try {
    const images = await kv.get("gallery_images");
    
    // Se não existir, retorna imagens padrão
    if (!images) {
      const defaultImages = {
        block1: [
          {
            url: "https://images.unsplash.com/photo-1645635116510-63daf84825a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pYyUyMGluc3RhbGxpbmclMjBsaWNlbnNlJTIwcGxhdGV8ZW58MXx8fHwxNzY3NDQ3NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Profissional instalando placa Mercosul"
          },
          {
            url: "https://images.unsplash.com/photo-1730485119620-4423e526676d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwc2VydmljZSUyMGNhciUyMHBsYXRlfGVufDF8fHx8MTc2NzQ0NzYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Serviço de emplacamento automotivo"
          },
          {
            url: "https://images.unsplash.com/photo-1720640783586-d38fd324d43a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pYyUyMHdvcmtpbmclMjBvbiUyMGNhcnxlbnwxfHx8fDE3Njc0NDc2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Mecânico trabalhando em veículo"
          }
        ],
        block2: [
          {
            url: "https://images.unsplash.com/photo-1767339736233-f4b02c41ee4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwd29ya3Nob3AlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY3NDI0MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Oficina profissional de emplacamento"
          },
          {
            url: "https://images.unsplash.com/photo-1744465721266-59937321026a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjByZWdpc3RyYXRpb24lMjBzZXJ2aWNlfGVufDF8fHx8MTc2NzQ0NzYzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Serviço de registro de veículo"
          },
          {
            url: "https://images.unsplash.com/photo-1760827797819-4361cd5cd353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXIlMjBzZXJ2aWNlfGVufDF8fHx8MTc2NzM5MDI1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            alt: "Serviço profissional automotivo"
          },
          {
            url: "https://i.ibb.co/hfFm9NC/car-cone-image.png",
            alt: "Veículo em processo de emplacamento"
          }
        ]
      };
      return c.json(defaultImages);
    }
    
    return c.json(images);
  } catch (error) {
    console.log(`Erro ao buscar imagens da galeria: ${error}`);
    return c.json({ error: "Erro ao buscar imagens" }, 500);
  }
});

// Galeria de imagens - PUT (atualizar imagens)
app.put("/make-server-41141608/gallery-images", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("gallery_images", body);
    return c.json({ success: true, message: "Imagens atualizadas com sucesso" });
  } catch (error) {
    console.log(`Erro ao atualizar imagens da galeria: ${error}`);
    return c.json({ error: "Erro ao atualizar imagens" }, 500);
  }
});

// Upload de imagem - POST
app.post("/make-server-41141608/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ error: "Nenhum arquivo enviado" }, 400);
    }

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF" }, 400);
    }

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ error: "Arquivo muito grande. Tamanho máximo: 5MB" }, 400);
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `gallery-${timestamp}-${randomStr}.${extension}`;

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log(`Erro ao fazer upload: ${uploadError.message}`);
      return c.json({ error: `Erro ao fazer upload: ${uploadError.message}` }, 500);
    }

    // Criar URL assinada (válida por 10 anos)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 315360000); // 10 anos em segundos

    if (signedUrlError) {
      console.log(`Erro ao gerar URL assinada: ${signedUrlError.message}`);
      return c.json({ error: "Erro ao gerar URL da imagem" }, 500);
    }

    return c.json({ 
      success: true, 
      url: signedUrlData.signedUrl,
      fileName: fileName 
    });
  } catch (error) {
    console.log(`Erro ao processar upload de imagem: ${error}`);
    return c.json({ error: "Erro ao processar upload" }, 500);
  }
});

// Deletar imagem do storage - DELETE
app.delete("/make-server-41141608/delete-image", async (c) => {
  try {
    const body = await c.req.json();
    const { fileName } = body;
    
    if (!fileName) {
      return c.json({ error: "Nome do arquivo não fornecido" }, 400);
    }

    // Deletar do Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (deleteError) {
      console.log(`Erro ao deletar arquivo: ${deleteError.message}`);
      return c.json({ error: "Erro ao deletar imagem do servidor" }, 500);
    }

    return c.json({ 
      success: true, 
      message: "Imagem deletada com sucesso do servidor" 
    });
  } catch (error) {
    console.log(`Erro ao processar deleção de imagem: ${error}`);
    return c.json({ error: "Erro ao processar deleção" }, 500);
  }
});

// =====================================================
// ANALYTICS ENDPOINTS
// =====================================================

function detectDevice(userAgent: string, screenWidth?: number): string {
  const ua = userAgent || '';
  const isMobile = /Mobile|Android|iPhone|iPod/i.test(ua) || (screenWidth !== undefined && screenWidth < 768);
  const isTablet = !isMobile && (/iPad|Tablet/i.test(ua) || (screenWidth !== undefined && screenWidth >= 768 && screenWidth < 1024));
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

// POST /analytics/event - Registrar evento (aberto, sem auth)
app.post("/make-server-41141608/analytics/event", async (c) => {
  try {
    const body = await c.req.json();
    const { event, sessionId, properties, url, referrer, userAgent, timestamp, language, screenWidth } = body;

    if (!event || !sessionId) {
      return c.json({ error: "Campos obrigatórios ausentes" }, 400);
    }

    const device = detectDevice(userAgent || '', screenWidth);
    const now = timestamp ? new Date(timestamp) : new Date();
    const date = now.toISOString().split('T')[0];
    const hour = String(now.getHours()).padStart(2, '0');
    const hourKey = `${date}_${hour}`;

    // Extrair hostname do referrer
    let referrerKey = 'direct';
    if (referrer && referrer !== 'direct' && referrer.startsWith('http')) {
      try { referrerKey = new URL(referrer).hostname; } catch { referrerKey = referrer; }
    }

    // Criar registro do evento
    const eventRecord = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      event,
      sessionId,
      properties: properties || {},
      url: url || '/',
      referrer: referrerKey,
      device,
      language: language || '',
      timestamp: now.toISOString(),
      hour: Number(hour),
      date,
    };

    // Atualizar log de eventos (manter últimos 500)
    const eventsLog = (await kv.get("analytics_events_log") as any[]) || [];
    eventsLog.unshift(eventRecord);
    if (eventsLog.length > 500) eventsLog.length = 500;
    await kv.set("analytics_events_log", eventsLog);

    // Buscar totais existentes
    const totals = (await kv.get("analytics_totals") as any) || {
      totalPageViews: 0,
      totalSessions: 0,
      eventCounts: {},
      devices: { mobile: 0, desktop: 0, tablet: 0 },
      referrers: {},
      faqClicks: {},
      sectionViews: {},
      scrollDepths: {},
      dailyPageViews: {},
      dailySessions: {},
      dailyEventCounts: {},
      hourlyPageViews: {},
    };

    // Garantir estrutura
    if (!totals.eventCounts) totals.eventCounts = {};
    if (!totals.devices) totals.devices = { mobile: 0, desktop: 0, tablet: 0 };
    if (!totals.referrers) totals.referrers = {};
    if (!totals.faqClicks) totals.faqClicks = {};
    if (!totals.sectionViews) totals.sectionViews = {};
    if (!totals.scrollDepths) totals.scrollDepths = {};
    if (!totals.dailyPageViews) totals.dailyPageViews = {};
    if (!totals.dailySessions) totals.dailySessions = {};
    if (!totals.dailyEventCounts) totals.dailyEventCounts = {};
    if (!totals.hourlyPageViews) totals.hourlyPageViews = {};

    // Contagem geral de eventos
    totals.eventCounts[event] = (totals.eventCounts[event] || 0) + 1;

    // Contagem diária de eventos
    if (!totals.dailyEventCounts[date]) totals.dailyEventCounts[date] = {};
    totals.dailyEventCounts[date][event] = (totals.dailyEventCounts[date][event] || 0) + 1;

    // Contagem de dispositivos
    totals.devices[device] = (totals.devices[device] || 0) + 1;

    // Eventos específicos
    if (event === 'page_view') {
      totals.totalPageViews = (totals.totalPageViews || 0) + 1;
      totals.dailyPageViews[date] = (totals.dailyPageViews[date] || 0) + 1;
      totals.hourlyPageViews[hourKey] = (totals.hourlyPageViews[hourKey] || 0) + 1;
      totals.referrers[referrerKey] = (totals.referrers[referrerKey] || 0) + 1;

      // Sessões únicas por dia
      const sessionKey = `analytics_sessions_${date}`;
      const dailySessions = (await kv.get(sessionKey) as string[]) || [];
      if (!dailySessions.includes(sessionId)) {
        dailySessions.push(sessionId);
        await kv.set(sessionKey, dailySessions.slice(0, 50000));
        totals.totalSessions = (totals.totalSessions || 0) + 1;
        totals.dailySessions[date] = (totals.dailySessions[date] || 0) + 1;
      }
    }

    if (event === 'faq_click' && properties?.question) {
      const q = String(properties.question).substring(0, 100);
      totals.faqClicks[q] = (totals.faqClicks[q] || 0) + 1;
    }

    if (event === 'section_view' && properties?.section) {
      const s = String(properties.section);
      totals.sectionViews[s] = (totals.sectionViews[s] || 0) + 1;
    }

    if (event === 'scroll_depth' && properties?.depth !== undefined) {
      const depthKey = String(properties.depth);
      totals.scrollDepths[depthKey] = (totals.scrollDepths[depthKey] || 0) + 1;
    }

    // Limpar dados antigos (>30 dias) para economizar espaço
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyStr = thirtyDaysAgo.toISOString().split('T')[0];

    Object.keys(totals.dailyPageViews).forEach(d => { if (d < thirtyStr) delete totals.dailyPageViews[d]; });
    Object.keys(totals.dailySessions).forEach(d => { if (d < thirtyStr) delete totals.dailySessions[d]; });
    Object.keys(totals.dailyEventCounts).forEach(d => { if (d < thirtyStr) delete totals.dailyEventCounts[d]; });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenStr = sevenDaysAgo.toISOString().split('T')[0];
    Object.keys(totals.hourlyPageViews).forEach(k => {
      const d = k.split('_')[0];
      if (d < sevenStr) delete totals.hourlyPageViews[k];
    });

    await kv.set("analytics_totals", totals);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Erro ao registrar evento analytics: ${error}`);
    return c.json({ error: "Erro ao registrar evento" }, 500);
  }
});

// GET /analytics/dashboard - Painel de analytics (requer senha)
app.get("/make-server-41141608/analytics/dashboard", async (c) => {
  try {
    const password = c.req.header('X-Analytics-Password');
    if (password !== 'admin2025') {
      return c.json({ error: "Acesso não autorizado" }, 401);
    }

    const [totals, eventsLog] = await Promise.all([
      kv.get("analytics_totals"),
      kv.get("analytics_events_log"),
    ]);

    return c.json({
      totals: totals || {},
      eventsLog: ((eventsLog as any[]) || []).slice(0, 200),
    });
  } catch (error) {
    console.log(`Erro ao buscar dados analytics: ${error}`);
    return c.json({ error: "Erro ao buscar dados do painel" }, 500);
  }
});

// POST /analytics/generate-report - Agente IA para gerar relatório
app.post("/make-server-41141608/analytics/generate-report", async (c) => {
  try {
    const password = c.req.header('X-Analytics-Password');
    if (password !== 'admin2025') {
      return c.json({ error: "Acesso não autorizado" }, 401);
    }

    const body = await c.req.json();
    const { analyticsData, config } = body;
    const {
      clientName = 'Cliente',
      period = '7 dias',
      focus = [],
      additionalNotes = '',
      reportType = 'completo',
    } = config || {};

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: "Chave OpenAI não configurada" }, 500);
    }

    // Montar resumo dos dados para o prompt
    const {
      pageViews = 0, sessions = 0, ctaClicks = 0, formStarts = 0,
      formSubmits = 0, formSuccess = 0, formErrors = 0, exitIntents = 0,
      faqClicks = 0, conversionRate = 0, formSuccessRate = 0, ctaRate = 0,
      avgTimeOnPage = 0, topReferrers = [], topSections = [], topFaq = [],
      devices = {}, scrollDepths = {}, dailyTrend = [],
    } = analyticsData || {};

    const systemPrompt = `Você é um analista de marketing digital sênior especializado em portais de serviços automotivos no Brasil. 
Sua tarefa é gerar relatórios profissionais, claros e acionáveis para clientes não técnicos.
Use linguagem executiva, direta e orientada a resultados.
Sempre escreva em português brasileiro formal.
Formate o relatório com seções bem definidas usando markdown (## para seções, **negrito** para destaques, - para listas).
Seja específico com os números fornecidos. Não invente dados que não foram fornecidos.
Ao final, sempre inclua recomendações práticas e priorizadas.`;

    const userPrompt = `Gere um relatório de marketing digital ${reportType} para o cliente "${clientName}".

**PERÍODO ANALISADO:** ${period}
**DATA DO RELATÓRIO:** ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}

**DADOS DE TRÁFEGO:**
- Visualizações de página: ${pageViews}
- Sessões únicas: ${sessions}
- Tempo médio na página: ${avgTimeOnPage > 0 ? avgTimeOnPage + 's' : 'sem dados'}
- Taxa de clique em CTA: ${ctaRate.toFixed(1)}% (${ctaClicks} cliques)

**DADOS DE CONVERSÃO (FUNIL COMPLETO):**
- Visitantes: ${pageViews}
- Clicaram em CTA: ${ctaClicks} (${ctaRate.toFixed(1)}% dos visitantes)
- Iniciaram formulário: ${formStarts}
- Enviaram formulário: ${formSubmits}
- Conversões com sucesso: ${formSuccess}
- Taxa de conversão geral: ${conversionRate.toFixed(2)}%
- Taxa de sucesso do formulário: ${formSuccessRate.toFixed(1)}%
- Erros no formulário: ${formErrors}

**ENGAJAMENTO:**
- Intenções de saída detectadas: ${exitIntents}
- Cliques no FAQ: ${faqClicks}
- Perguntas mais acessadas no FAQ: ${topFaq.slice(0, 3).map((f: any) => `"${f[0]}" (${f[1]}x)`).join(', ') || 'sem dados'}

**DISPOSITIVOS:**
- Desktop: ${devices.desktop || 0}
- Mobile: ${devices.mobile || 0}
- Tablet: ${devices.tablet || 0}

**ORIGENS DE TRÁFEGO (TOP 5):**
${topReferrers.slice(0, 5).map((r: any) => `- ${r.ref}: ${r.count} visitas`).join('\n') || '- Sem dados de origem disponíveis'}

**SEÇÕES MAIS VISUALIZADAS:**
${topSections.slice(0, 5).map((s: any) => `- ${s.section}: ${s.count}x`).join('\n') || '- Sem dados disponíveis'}

**PROFUNDIDADE DE ROLAGEM:**
- 25% da página: ${scrollDepths['25'] || 0} usuários
- 50% da página: ${scrollDepths['50'] || 0} usuários
- 75% da página: ${scrollDepths['75'] || 0} usuários
- 100% da página: ${scrollDepths['100'] || 0} usuários

**FOCO DO RELATÓRIO:** ${focus.length > 0 ? focus.join(', ') : 'Análise completa'}

${additionalNotes ? `**OBSERVAÇÕES ADICIONAIS DO GESTOR:** ${additionalNotes}` : ''}

---
Estruture o relatório com as seguintes seções:
1. Sumário Executivo (parágrafo conciso com os principais resultados)
2. Desempenho de Tráfego
3. Análise do Funil de Conversão (com diagnóstico dos pontos de abandono)
4. Comportamento do Usuário (dispositivos, scroll, seções, tempo na página)
5. Origens de Tráfego e Audiência
6. Pontos de Atenção e Riscos
7. Recomendações Prioritárias (mínimo 5, em ordem de impacto)
8. Próximos Passos Sugeridos

Seja analítico, use os números fornecidos, aponte padrões, compare com benchmarks do setor automotivo brasileiro quando relevante, e sempre justifique suas recomendações com base nos dados.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.log(`Erro OpenAI: ${JSON.stringify(err)}`);
      return c.json({ error: `Erro ao gerar relatório: ${err.error?.message || 'Erro desconhecido'}` }, 500);
    }

    const openaiData = await response.json();
    const reportText = openaiData.choices?.[0]?.message?.content || '';

    if (!reportText) {
      return c.json({ error: "Relatório vazio retornado pela IA" }, 500);
    }

    // Salvar histórico de relatórios
    const reportsHistory = (await kv.get("analytics_reports_history") as any[]) || [];
    reportsHistory.unshift({
      id: `report_${Date.now()}`,
      clientName,
      period,
      reportType,
      generatedAt: new Date().toISOString(),
      report: reportText,
    });
    if (reportsHistory.length > 20) reportsHistory.length = 20;
    await kv.set("analytics_reports_history", reportsHistory);

    return c.json({ success: true, report: reportText });
  } catch (error) {
    console.log(`Erro ao gerar relatório: ${error}`);
    return c.json({ error: `Erro interno ao gerar relatório: ${error}` }, 500);
  }
});

// GET /analytics/reports-history - Histórico de relatórios
app.get("/make-server-41141608/analytics/reports-history", async (c) => {
  try {
    const password = c.req.header('X-Analytics-Password');
    if (password !== 'admin2025') {
      return c.json({ error: "Acesso não autorizado" }, 401);
    }
    const history = (await kv.get("analytics_reports_history") as any[]) || [];
    return c.json({ history });
  } catch (error) {
    console.log(`Erro ao buscar histórico: ${error}`);
    return c.json({ error: "Erro ao buscar histórico" }, 500);
  }
});

Deno.serve(app.fetch);