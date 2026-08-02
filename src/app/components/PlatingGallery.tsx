import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface GalleryImage {
  url: string;
  alt: string;
}

export function PlatingGallery() {
  const [galleryBlock1, setGalleryBlock1] = useState<GalleryImage[]>([]);
  const [galleryBlock2, setGalleryBlock2] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

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
      setGalleryBlock1(data.block1 || []);
      setGalleryBlock2(data.block2 || []);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      // Em caso de erro, mantém as imagens padrão
    } finally {
      setLoading(false);
    }
  };

  // Filtrar apenas imagens com URL válida
  const validBlock1 = galleryBlock1.filter(img => img.url && img.url.trim() !== '');
  const validBlock2 = galleryBlock2.filter(img => img.url && img.url.trim() !== '');

  // Se não houver nenhuma imagem válida, não renderiza a seção
  if (!loading && validBlock1.length === 0 && validBlock2.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-600">Carregando galeria...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Título da seção */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gray-900 mb-4">
            Nossos Parceiros em Ação
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Empresas especializadas e qualificadas realizando emplacamentos com segurança e profissionalismo em todo o Brasil
          </p>
        </motion.div>

        {/* Grid 3 colunas - primeiras 3 imagens */}
        {validBlock1.length > 0 && (
          <div className={`grid gap-6 mb-6 ${
            validBlock1.length === 1 
              ? 'grid-cols-1 md:max-w-md md:mx-auto' 
              : validBlock1.length === 2 
              ? 'grid-cols-1 md:grid-cols-2 md:max-w-3xl md:mx-auto' 
              : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {validBlock1.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group bg-gray-100"
                style={{ aspectRatio: '4/3' }}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">{image.alt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Grid 4 colunas - últimas 4 imagens */}
        {validBlock2.length > 0 && (
          <div className={`grid gap-6 ${
            validBlock2.length === 1 
              ? 'grid-cols-1 md:max-w-md md:mx-auto' 
              : validBlock2.length === 2 
              ? 'grid-cols-1 md:grid-cols-2 md:max-w-3xl md:mx-auto' 
              : validBlock2.length === 3 
              ? 'grid-cols-1 md:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {validBlock2.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (validBlock1.length + index) * 0.1 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group bg-gray-100"
                style={{ aspectRatio: '4/3' }}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">{image.alt}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA inferior */}
        <motion.div
          className="mt-12 text-center bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-white mb-3">
            Junte-se a milhares de brasileiros que emplacaram com segurança
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Processo rápido, seguro e sem complicações
          </p>
          <motion.button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Solicitar Emplacamento Agora →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}