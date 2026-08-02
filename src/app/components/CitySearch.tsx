import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Lista de estados brasileiros
const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" }
];

interface CitySearchProps {
  onStateChange?: (state: string) => void;
  onCityChange?: (city: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  namePrefix?: string;
}

export function CitySearch({ onStateChange, onCityChange, onValidationChange, namePrefix = "" }: CitySearchProps) {
  const [selectedState, setSelectedState] = useState<string>("");
  const [cityInput, setCityInput] = useState<string>("");

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setCityInput("");
    onStateChange?.(value);
    onCityChange?.("");
    // Sempre válido agora (sem validação)
    onValidationChange?.(true);
  };

  const handleCityChange = (value: string) => {
    setCityInput(value);
    onCityChange?.(value);
    // Sempre válido enquanto houver texto
    if (value.trim()) {
      onValidationChange?.(true);
    } else {
      onValidationChange?.(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Campo Estado */}
      <div>
        <Label htmlFor={`${namePrefix}estado`}>Estado *</Label>
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger className="mt-1" id={`${namePrefix}estado`}>
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {ESTADOS.map((estado) => (
              <SelectItem key={estado.uf} value={estado.uf}>
                {estado.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campo Cidade livre */}
      {selectedState && (
        <div>
          <Label htmlFor={`${namePrefix}cidade`}>Cidade *</Label>
          <div className="relative mt-1">
            <Input
              id={`${namePrefix}cidade`}
              type="text"
              placeholder="Digite o nome da sua cidade"
              value={cityInput}
              onChange={(e) => handleCityChange(e.target.value)}
            />
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            Digite o nome completo da sua cidade
          </p>
        </div>
      )}
    </div>
  );
}