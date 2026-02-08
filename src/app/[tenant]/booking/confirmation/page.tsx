import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function ConfirmationPage({ params }: { params: Promise<{ tenant: string }> }) {
    const t = await getTranslations("booking");
    const { tenant } = await params;

    return (
        <div className="container mx-auto py-24 px-4 text-center">
            <div className="flex justify-center mb-8">
                <CheckCircle2 className="w-24 h-24 text-green-500 animate-in zoom-in duration-500" />
            </div>

            <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">{t("bookingConfirmed")}</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                {t("confirmationMessage")}
            </p>

            <div className="flex gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href={`/${tenant}`}>{t("returnHome")}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                    <Link href={`/${tenant}/rooms`}>{t("viewBooking")}</Link>
                </Button>
            </div>
        </div>
    );
}
