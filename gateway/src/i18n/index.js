import { createI18n } from 'react-router-i18n';

export const locales = [
  'en',
  'fr',
];

const translations = {
  "en": {
    header: {
      categories: {
        SoftwareNew: "New software / applications",
        SoftwareSupport: "",
        SoftwareTransfer: "",
        HardwareGet: "Get hardware",
        HardwareInstall: "Hardware installation",
        HardwareSupport: "Hardware support",
        HardwareReturn: "Hardware return",
        AccountNetwork: "Network accounts",
        AccountOutlook: "Outlook email accounts and lists",
        PhoneNew: "New phone and services",
        PhoneSupport: "Phone support",
        PhoneRemove: "Remove phone and services",
        PhoneInternetServices: "Internet and services",
        Conference: "Conferencing services",
        TV: "TV services",
        SecurityIT: "IT security",
        SecurityPhysical: "Physical security",
      },
    },
  },
  "fr": {
    header: {
      categories: {
        SoftwareNew: "Obtenir des logiciels",
        SoftwareSupport: "",
        SoftwareTransfer: "",
        HardwareGet: "Obtenir du matériel",
        HardwareInstall: "Installation du matériel",
        HardwareSupport: "Soutien du matériel",
        HardwareReturn: "Retour du matériel",
        AccountNetwork: "Comptes de réseau",
        AccountOutlook: "Listes de distribution et comptes de courriels d'Outlook",
        PhoneNew: "Nouveaux téléphones et services",
        PhoneSupport: "Soutien téléphonique",
        PhoneRemove: "Retour de téléphone ou annulation de service",
        PhoneInternetServices: "Internet et services",
        Conference: "Services de conférences",
        TV: "Services de télévision",
        SecurityIT: "Sécurité des TIs",
        SecurityPhysical: "Sécurité physique",
      },
    },
  },
};

export const i18n = createI18n( 
  locales,
  translations,
);

export default i18n;