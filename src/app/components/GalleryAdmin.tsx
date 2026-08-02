import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Save, RefreshCw, ImageIcon, AlertCircle, CheckCircle2, Lock, Upload, X, Trash2 } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface GalleryImage {
  url: string;
  alt: string;
  fileName?: string;
}

interface GalleryData {
  block1: GalleryImage[];
  block2: GalleryImage[];
}

export function GalleryAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [galleryData, setGalleryData] = useState<GalleryData>({
    block1: [
      { url: "", alt: "" },
      { url: "", alt: "" },
      { url: "", alt: "" },
    ],
    block2: [
      { url: "", alt: "" },
      { url: "", alt: "" },
      { url: "", alt: "" },
      { url: "", alt: "" },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples: "admin2025" - você pode mudar no código
    if (password === "admin2025") {
      setIsAuthenticated(true);
      setAuthError(false);
      fetchImages();
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchImages();
    }
  }, [isAuthenticated]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41141608/gallery-images`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar imagens");
      }

      const data = await response.json();
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      setMessage({ type: "error", text: "Erro ao carregar imagens da galeria" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (block: "block1" | "block2", index: number, file: File) => {
    const uploadKey = `${block}-${index}`;
    setUploading(uploadKey);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41141608/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao fazer upload");
      }

      const data = await response.json();
      
      // Atualizar a URL da imagem no estado
      updateImage(block, index, "url", data.url);
      updateImage(block, index, "fileName", file.name);
      
      setMessage({ 
        type: "success", 
        text: `Imagem ${index + 1} carregada! Não esqueça de clicar em "Salvar Alterações"` 
      });

      // Limpa a mensagem após 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Erro ao fazer upload da imagem" 
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41141608/gallery-images`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(galleryData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar imagens");
      }

      setMessage({ type: "success", text: "Imagens salvas com sucesso! As mudanças já estão visíveis no site." });
      
      // Limpa a mensagem após 5 segundos
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Erro ao salvar imagens:", error);
      setMessage({ type: "error", text: "Erro ao salvar imagens. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  const updateImage = (block: "block1" | "block2", index: number, field: "url" | "alt" | "fileName", value: string) => {
    setGalleryData((prev) => ({
      ...prev,
      [block]: prev[block].map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    }));
  };

  const removeImage = (block: "block1" | "block2", index: number) => {
    updateImage(block, index, "url", "");
    updateImage(block, index, "fileName", "");
  };

  const triggerFileInput = (block: "block1" | "block2", index: number) => {
    const key = `${block}-${index}`;
    fileInputRefs.current[key]?.click();
  };

  // Se não estiver autenticado, mostra tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-900 p-4 rounded-xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-gray-900 text-center mb-2">Área Administrativa</h1>
          <p className="text-gray-600 text-center mb-8">Digite a senha para acessar</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {authError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  Senha incorreta
                </motion.p>
              )}
            </div>
            
            <motion.button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Entrar
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              💡 Dica: A senha padrão é <code className="bg-gray-100 px-2 py-1 rounded">admin2025</code>
            </p>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-blue-900 hover:text-blue-700 underline text-sm">
              ← Voltar ao site
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  const renderImageCard = (block: "block1" | "block2", index: number, image: GalleryImage, imageNumber: number) => {
    const uploadKey = `${block}-${index}`;
    const isUploading = uploading === uploadKey;

    return (
      <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="text-gray-700 mb-4">Imagem {imageNumber}</h3>
        
        {/* Input de arquivo oculto */}
        <input
          ref={(el) => (fileInputRefs.current[uploadKey] = el)}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(block, index, file);
            }
          }}
          className="hidden"
        />

        <div className="space-y-4">
          {/* Área de upload/preview */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Imagem (proporção 4:3)</label>
            {image.url ? (
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  onClick={() => removeImage(block, index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                  title="Remover imagem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => triggerFileInput(block, index)}
                  className="absolute bottom-2 right-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Trocar
                </button>
              </div>
            ) : (
              <button
                onClick={() => triggerFileInput(block, index)}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ aspectRatio: '4/3' }}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-blue-600">Fazendo upload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-600">Clique para fazer upload</span>
                    <span className="text-xs text-gray-500">JPG, PNG, WEBP ou GIF (máx. 5MB)</span>
                    <span className="text-xs text-blue-600">Proporção ideal: 4:3</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Descrição (Alt Text)</label>
            <input
              type="text"
              value={image.alt}
              onChange={(e) => updateImage(block, index, "alt", e.target.value)}
              placeholder="Descreva a imagem"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-900 p-3 rounded-xl">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">Gerenciar Galeria de Fotos</h1>
              <p className="text-gray-600">Faça upload das imagens para a seção "Nossos Parceiros em Ação"</p>
            </div>
          </div>

          {/* Mensagem de sucesso/erro */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p>{message.text}</p>
            </motion.div>
          )}

          {/* Instruções */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-blue-900 mb-2">📝 Como usar:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Clique em "Clique para fazer upload" ou "Trocar" para enviar suas imagens</li>
              <li>• Formatos aceitos: JPG, PNG, WEBP ou GIF (máximo 5MB por arquivo)</li>
              <li>• Escreva uma descrição alternativa para cada imagem</li>
              <li>• Clique em "Salvar Alterações" para aplicar as mudanças no site</li>
              <li>• As imagens ficam armazenadas permanentemente no servidor</li>
            </ul>
          </div>
        </div>

        {/* Bloco 1 - 3 imagens */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-gray-900 mb-6">📸 Primeiro Bloco (3 imagens)</h2>
          <div className="space-y-6">
            {galleryData.block1.map((image, index) => 
              renderImageCard("block1", index, image, index + 1)
            )}
          </div>
        </div>

        {/* Bloco 2 - 4 imagens */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-gray-900 mb-6">📸 Segundo Bloco (4 imagens)</h2>
          <div className="space-y-6">
            {galleryData.block2.map((image, index) => 
              renderImageCard("block2", index, image, index + 4)
            )}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex gap-4">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
          >
            {saving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </motion.button>

          <motion.button
            onClick={fetchImages}
            disabled={loading}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Recarregar
          </motion.button>
        </div>

        {/* Voltar ao site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-900 hover:text-blue-700 underline"
          >
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}