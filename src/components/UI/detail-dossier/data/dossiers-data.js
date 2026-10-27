// --- DONNÉES MOCK DES DOSSIERS ---
export const DATA_DOSSIERS = {
  "BESD-24-001": {
    id: "BESD-24-001",
    titre: "Dossier Café ODECA",
    statut: "Actif",

    documents: [
      {
        id: 1,
        name: "Rapport_Technique.pdf",
        size: "2.4 Mo",
        date: "20/01/2026",
        type: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        content: "Contenu du rapport technique...",
      },
      {
        id: 2,
        name: "Plan_Financement.xlsx",
        size: "1.1 Mo",
        date: "18/01/2026",
        type: "EXCEL",
        url: "https://go.microsoft.com/fwlink/?LinkID=521962",
        content: "Tableur de financement...",
      },
    ],
  },
  "ANAGESSA-02": {
    id: "ANAGESSA-02",
    titre: "Projet ANAGESSA",
    statut: "Urgent",
    documents: [
      {
        id: 3,
        name: "Bénéficiaires.pdf",
        size: "850 Ko",
        date: "15/01/2026",
        type: "PDF",
        url: "#",
        content: "Liste des bénéficiaires...",
      },
    ],
    cellule: "Cellule de Validation",
    assignation: "Direction Générale",
    dateFin: "10/04/2026",
    historique: [],
    notes: [],
  },
};
