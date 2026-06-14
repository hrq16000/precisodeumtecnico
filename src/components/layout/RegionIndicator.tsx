import { useState, useEffect } from "react";
import { MapPin, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserRegion } from "@/hooks/useUserRegion";

type Props = {
  className?: string;
  iconClassName?: string;
};

export function RegionIndicator({ className, iconClassName }: Props) {
  const { region, askPrompt, setManualRegion, dismissPrompt } = useUserRegion();
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  useEffect(() => {
    if (askPrompt) setOpen(true);
  }, [askPrompt]);

  useEffect(() => {
    if (open) {
      setCity(region.city || "");
      setUf(region.region || "");
    }
  }, [open, region.city, region.region]);

  const display = region.region ? `${region.city} – ${region.region}` : region.city;

  const handleSave = () => {
    if (!city.trim()) return;
    setManualRegion(city, uf);
    setOpen(false);
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) dismissPrompt();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "group flex items-center gap-2 hover:text-accent transition-colors"
        }
        aria-label={`Sua região: ${display}. Clique para alterar.`}
        title="Alterar minha região"
      >
        <MapPin className={iconClassName ?? "w-4 h-4"} />
        <span className="truncate max-w-[220px]">{display}</span>
        <Pencil className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>De onde você está acessando?</DialogTitle>
            <DialogDescription>
              Detectamos sua região automaticamente, mas você pode ajustar para indicarmos o
              técnico parceiro mais próximo. Atendemos <strong>Curitiba e Região Metropolitana</strong>{" "}
              diretamente e contamos com <strong>prestadores parceiros em todo o Brasil</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-[1fr_90px] gap-3 py-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="region-city" className="text-xs font-medium text-muted-foreground">
                Cidade
              </label>
              <Input
                id="region-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: São Paulo"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="region-uf" className="text-xs font-medium text-muted-foreground">
                UF
              </label>
              <Input
                id="region-uf"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Agora não
            </Button>
            <Button onClick={handleSave} disabled={!city.trim()}>
              Confirmar minha região
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
