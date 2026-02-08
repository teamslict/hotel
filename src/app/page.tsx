import { redirect } from "next/navigation";

// Root page - redirect to a default tenant
export default async function RootPage() {
    // Redirect to a default tenant (e.g., hilton)
    // In production, this could show a tenant selector or redirect to a marketing page
    redirect("/hilton");
}
