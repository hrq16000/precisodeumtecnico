const brands = [
  "Dell", "HP", "Lenovo", "Apple", "Samsung", "LG",
  "Asus", "Acer", "Microsoft", "Sony", "Motorola", "Xiaomi",
  "Positivo", "Multilaser", "Intelbras", "Intel", "AMD", "Nvidia",
];

export function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-background border-y border-border">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium mb-4">
            Marcas Atendidas
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trabalhamos com as Melhores Marcas
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Técnicos certificados e especializados nas principais marcas do mercado
          </p>
        </div>

        {/* Brands Grid — text-based for speed & reliability (no external fetch) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex items-center justify-center h-16 md:h-20 px-3 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              aria-label={`Atendemos ${brand}`}
            >
              <span className="font-display font-bold text-base md:text-lg text-foreground/70 hover:text-primary transition-colors tracking-tight">
                {brand}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <p className="text-center text-muted-foreground mt-8 text-sm">
          E muitas outras marcas! Consulte-nos sobre a marca do seu equipamento.
        </p>
      </div>
    </section>
  );
}
