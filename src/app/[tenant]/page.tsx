import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";

export default async function TenantPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  // In real app, fetch tenant config API here.
  const tenantName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HeroSection tenantId={tenant} tenantName={tenantName} />

      <FeaturedRooms tenantId={tenant} />

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-foreground">Welcome to {tenantName}</h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Discover a world of luxury and comfort tailored just for you.
            Whether you are here for business or leisure, we ensure an unforgettable experience.
          </p>
        </div>
      </section>
    </div>
  );
}
