import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
        thanks: 'Thank You for Joining "Yadig?"',
        story: "Welcome to Yadig?, where music discovery meets meaningful conversation. We're a community of passionate listeners, critics, and music enthusiasts who believe that every album tells a story worth sharing. Whether you're a vinyl junkie, a streaming explorer, or someone who just loves diving deep into their favorite records, Yadig? gives you the space to articulate your musical journey. Share detailed reviews that go beyond simple ratings, create curated lists that showcase your taste, and connect with fellow music lovers whose perspectives might just lead you to your next favorite album. Our platform celebrates the art of music criticism while fostering genuine discussions about the albums that move us. Follow other reviewers whose voices resonate with you, discover hidden gems through our community's diverse listening habits, and contribute to a growing archive of thoughtful music analysis. At Yadig?, we believe that music is more than just background noise—it's a conversation waiting to happen."
    }
  },
  fr: {
    translation: {
        thanks: "Merci d'avoir rejoint Yadig?",
        story: "Bienvenue sur yadig, où la découverte musicale rencontre des conversations enrichissantes. Nous sommes une communauté d'auditeurs passionnés, de critiques et de passionnés de musique qui croient que chaque album raconte une histoire qui mérite d'être partagée. Que vous soyez un accro du vinyle, un explorateur du streaming ou quelqu'un qui aime simplement plonger dans ses disques préférés, yadig vous offre l'espace nécessaire pour articuler votre parcours musical. Partagez des critiques détaillées qui vont au-delà des simples notes, créez des listes organisées qui mettent en valeur vos goûts et connectez-vous avec d'autres mélomanes dont les perspectives pourraient bien vous conduire à votre prochain album préféré. Notre plateforme célèbre l'art de la critique musicale tout en favorisant de véritables discussions sur les albums qui nous émeuvent. Suivez d'autres critiques dont les voix résonnent avec vous, découvrez des trésors cachés à travers les diverses habitudes d'écoute de notre communauté et contribuez à une archive croissante d'analyses musicales réfléchies. Chez yadig, nous pensons que la musique est plus qu'un simple bruit de fond : c'est une conversation qui attend d'avoir lieu."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
