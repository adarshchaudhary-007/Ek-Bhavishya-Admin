export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-8">
            <div className="w-full max-w-md space-y-8">
                {children}
            </div>
            {/* Optional: Add a subtle starry background or graphic here */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-5"></div>
        </div>
    );
}
