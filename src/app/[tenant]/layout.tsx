import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConfigProvider } from "@/components/providers/ConfigProvider";

export default async function TenantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ tenant: string }>;
}) {
    const { tenant } = await params;

    // In a real app, fetch tenant config here to get the name
    // For now, capitalize the ID
    const tenantName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

    return (
        <ConfigProvider subdomain={tenant}>
            <div className="flex flex-col min-h-screen">
                <Header tenantId={tenant} tenantName={tenantName} />
                <main className="flex-grow pt-20">
                    {children}
                </main>
                <Footer tenantId={tenant} />
            </div>
        </ConfigProvider>
    );
}
