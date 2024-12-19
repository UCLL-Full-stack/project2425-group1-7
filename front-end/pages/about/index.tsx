import Head from "next/head";
import '../../i18n';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <Head>
                <title>Yadig?</title>
            </Head>
            <div className="flex flex-col h-screen">
                <main className="flex-1 flex flex-col justify-center items-center gap-3 bg-bg1 p-10 overflow-y-auto">
                    <span className="text-text2 text-3xl main-font">{t('thanks')}</span>
                    <span className="text-text2 max-w-[50vw] text-center text-xl main-thin">{t('story')}</span>
                    <div className="flex">
                        <select 
                            className="rounded-md bg-text1 text-text2 p-5"
                            onChange={(e) => changeLanguage(e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                </main>
            </div>
        </>
    );
};

export default About;

