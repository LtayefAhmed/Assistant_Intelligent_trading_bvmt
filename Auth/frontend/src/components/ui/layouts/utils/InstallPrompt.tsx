import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/i18n';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            console.log('Before install prompt fired');
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowModal(true);
        };

        // Show iOS prompt if not in standalone mode
        if (isIOSDevice && !window.matchMedia('(display-mode: standalone').matches) {
            console.log('iOS device detected, showing install prompt');
            setShowModal(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            setDeferredPrompt(null);
            setShowModal(false);
        }
    };

    const handleClose = () => setShowModal(false);

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isIOS ? t('install.ios.title') : t('install.android.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {isIOS ? (
                            <div className="space-y-2">
                                <p>{t('install.ios.description')}</p>
                                <ol className="list-decimal pl-5 space-y-1 mt-2">
                                    <li>{t('install.ios.step1')}</li>
                                    <li>{t('install.ios.step2')}</li>
                                    <li>{t('install.ios.step3')}</li>
                                </ol>
                            </div>
                        ) : (
                            t('install.android.description')
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    {isIOS ? (
                        <Button variant="outline" onClick={handleClose}>
                            {t('install.buttons.close')}
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleClose}>
                                {t('install.buttons.cancel')}
                            </Button>
                            <Button onClick={handleInstallClick}>
                                {t('install.buttons.install')}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InstallPrompt;