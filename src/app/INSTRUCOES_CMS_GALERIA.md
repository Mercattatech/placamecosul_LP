# 📸 CMS de Galeria - Instruções de Uso

## Como acessar o painel administrativo

1. **Acesse a URL:** `/admin-galeria`
2. **Senha padrão:** `admin2025`

## Como trocar as fotos da galeria

### Passo 1: Fazer login
- Acesse `/admin-galeria`
- Digite a senha: `admin2025`
- Clique em "Entrar"

### Passo 2: Fazer upload das imagens
O painel mostra 7 campos de imagem:
- **Bloco 1:** 3 imagens (exibidas em 3 colunas na galeria)
- **Bloco 2:** 4 imagens (exibidas em 4 colunas na galeria)

Para cada imagem:

**Se não há imagem ainda:**
1. Clique no botão "Clique para fazer upload"
2. Selecione uma imagem do seu computador
3. Aguarde o upload (você verá "Fazendo upload...")
4. A imagem aparecerá automaticamente

**Se já existe uma imagem:**
1. Clique no botão "Trocar" (canto inferior direito da imagem)
2. Selecione a nova imagem
3. A imagem será substituída

**Para remover uma imagem:**
- Clique no "X" vermelho no canto superior direito da imagem
- A imagem será removida da galeria
- **Importante:** Depois de remover, clique em "Salvar Alterações" para aplicar a mudança no site
- A imagem removida **não aparecerá** no site (o layout se ajusta automaticamente)

### Passo 3: Adicionar descrições
- Digite uma breve descrição para cada imagem no campo "Descrição (Alt Text)"
- Isso ajuda na acessibilidade e SEO do site

### Passo 4: Salvar alterações
- Clique no botão **"Salvar Alterações"** (botão azul grande)
- Aguarde a confirmação de sucesso
- As mudanças aparecem **imediatamente** no site para todos os visitantes

## Formatos de imagem aceitos

✅ **Formatos permitidos:**
- JPG / JPEG
- PNG
- WEBP
- GIF

⚠️ **Limitações:**
- Tamanho máximo: **5MB por imagem**
- Se a imagem for muito grande, você receberá um erro

## Dicas para melhores resultados

### Tamanho ideal das imagens
- **Largura recomendada:** 800-1200px
- **Proporção:** 4:3 (horizontal)
- **Qualidade:** Média-alta (não precisa ser máxima)

### Como reduzir o tamanho da imagem
Se você receber erro de "Arquivo muito grande":

1. **Online (grátis):**
   - Acesse [tinypng.com](https://tinypng.com) ou [compressor.io](https://compressor.io)
   - Faça upload da imagem
   - Baixe a versão comprimida

2. **No computador:**
   - Windows: Abra a imagem no Paint, vá em "Redimensionar"
   - Mac: Abra no Preview, vá em "Tools" > "Adjust Size"

### Tipo de fotos recomendadas
Para esta galeria de "Parceiros em Ação", use fotos que mostrem:
- Profissionais instalando placas
- Oficinas de emplacamento
- Veículos sendo emplacados
- Equipes de trabalho
- Ambientes profissionais

## Como mudar a senha

A senha está definida no código. Para alterá-la:

1. Abra o arquivo `/components/GalleryAdmin.tsx`
2. Encontre a linha: `if (password === "admin2025")`
3. Substitua `"admin2025"` pela senha desejada
4. Salve o arquivo

## Estrutura técnica

### Frontend
- **Componente principal:** `/components/PlatingGallery.tsx`
- **Painel admin:** `/components/GalleryAdmin.tsx`
- **Rota de acesso:** `/admin-galeria`

### Backend
- **Servidor:** `/supabase/functions/server/index.tsx`
- **Endpoint GET:** `/make-server-41141608/gallery-images` (buscar imagens)
- **Endpoint PUT:** `/make-server-41141608/gallery-images` (salvar configuração)
- **Endpoint POST:** `/make-server-41141608/upload-image` (fazer upload)
- **Armazenamento:**
  - URLs das imagens: Supabase KV Store (chave: `gallery_images`)
  - Arquivos de imagem: Supabase Storage (bucket: `make-41141608-gallery`)

### Fluxo de funcionamento

1. **Upload:**
   - Usuário seleciona arquivo → Frontend envia para servidor
   - Servidor valida (tipo, tamanho) → Salva no Supabase Storage
   - Servidor gera URL assinada (válida por 10 anos) → Retorna para frontend
   - Frontend atualiza preview com a nova URL

2. **Salvamento:**
   - Usuário clica em "Salvar Alterações"
   - Frontend envia todas as URLs + descrições para o servidor
   - Servidor salva no KV Store
   - Configuração fica permanente

3. **Exibição no site:**
   - PlatingGallery busca configuração do servidor ao carregar
   - Exibe as imagens com as URLs salvas
   - Atualiza automaticamente quando há mudanças

### Dados salvos

As configurações são armazenadas permanentemente no Supabase com esta estrutura:

```json
{
  "block1": [
    { 
      "url": "https://supabase.co/storage/.../gallery-123456.jpg?token=...", 
      "alt": "Profissional instalando placa" 
    },
    { 
      "url": "https://supabase.co/storage/.../gallery-789012.jpg?token=...", 
      "alt": "Oficina de emplacamento" 
    },
    { 
      "url": "https://supabase.co/storage/.../gallery-345678.jpg?token=...", 
      "alt": "Veículo sendo emplacado" 
    }
  ],
  "block2": [
    { "url": "...", "alt": "..." },
    { "url": "...", "alt": "..." },
    { "url": "...", "alt": "..." },
    { "url": "...", "alt": "..." }
  ]
}
```

## Solução de problemas

### ❌ Erro: "Arquivo muito grande"
**Solução:** Reduza o tamanho da imagem para menos de 5MB usando as dicas acima.

### ❌ Erro: "Tipo de arquivo não permitido"
**Solução:** Certifique-se de usar JPG, PNG, WEBP ou GIF. Outros formatos (BMP, TIFF, etc.) não são aceitos.

### ❌ A imagem não aparece após upload
**Solução:**
1. Verifique se o upload foi concluído (mensagem de sucesso)
2. Aguarde alguns segundos
3. Clique em "Recarregar" para atualizar os dados

### ❌ Mudanças não aparecem no site
**Solução:**
1. Certifique-se que clicou em "Salvar Alterações"
2. Aguarde a mensagem de confirmação
3. Limpe o cache do navegador (Ctrl + F5 ou Cmd + Shift + R)
4. Recarregue a página principal do site

### ❌ Upload travado em "Fazendo upload..."
**Solução:**
1. Aguarde 30 segundos (arquivos grandes podem demorar)
2. Se continuar travado, recarregue a página admin
3. Tente com uma imagem menor
4. Verifique sua conexão com internet

### ❌ Imagem aparece cortada ou distorcida
**Solução:**
- Use imagens com proporção 4:3 (horizontal)
- Exemplos: 800x600px, 1200x900px, 1600x1200px

## Segurança

⚠️ **Importante:**
- Não compartilhe a senha com pessoas não autorizadas
- As imagens ficam em storage privado (não são acessíveis diretamente)
- URLs são assinadas e válidas por 10 anos
- Apenas você (admin) pode fazer upload e trocar imagens

## Acesso rápido ao admin

Um link discreto para a área administrativa está disponível no rodapé do site (parte inferior da página), com o texto "Área administrativa".

## Benefícios do upload direto

✅ **Vantagens:**
- Não precisa hospedar imagens em sites externos
- Imagens ficam seguras no Supabase
- URLs não expiram (válidas por 10 anos)
- Upload é rápido e direto
- Não depende de serviços terceiros (Imgur, ImgBB, etc.)

## Layout adaptativo inteligente

O sistema possui um layout que se adapta automaticamente ao número de imagens:

### Bloco 1 (primeiras 3 imagens):
- **3 imagens:** Layout em 3 colunas (desktop)
- **2 imagens:** Layout em 2 colunas centralizadas
- **1 imagem:** Layout centralizado
- **0 imagens:** Bloco não aparece

### Bloco 2 (últimas 4 imagens):
- **4 imagens:** Layout em 4 colunas (desktop)
- **3 imagens:** Layout em 3 colunas
- **2 imagens:** Layout em 2 colunas centralizadas
- **1 imagem:** Layout centralizado
- **0 imagens:** Bloco não aparece

### Seção completa:
- Se **nenhuma imagem** for cadastrada, a seção inteira "Nossos Parceiros em Ação" **não aparece** no site
- Isso garante que o site sempre tenha uma aparência profissional

**Exemplo prático:**
- Se você remover 2 imagens do Bloco 1, restará apenas 1 imagem que será exibida centralizada
- Se você remover todas as 7 imagens, a seção inteira desaparece do site

Isso garante que o design sempre fique correto, independente de quantas imagens você decidir usar! 🎨

## Suporte

Para dúvidas ou problemas técnicos, entre em contato com o desenvolvedor.

---

**Última atualização:** Sistema com upload direto de imagens implementado.