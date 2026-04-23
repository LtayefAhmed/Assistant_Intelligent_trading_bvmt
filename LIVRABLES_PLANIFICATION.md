# Documentation - Phase Planification : Assistant Intelligent Trading BVMT

Ce document rassemble l'ensemble des livrables de la phase de planification pour l'adaptation du projet "Assistant Intelligent Trading BVMT" dans le cadre d'une gestion de projet.

---

## 1. Cahier des charges (Synthèse)

**Contexte et Objectif :**
Concevoir un assistant de trading intelligent (IA) dédié à la Bourse des Valeurs Mobilières de Tunis (BVMT) permettant d'analyser le marché, d'extraire des recommandations d'achat/vente personnalisées et de simuler la gestion de portefeuille.

**Périmètre fonctionnel :**
1. **Intelligence de marché** : Dashboard temps réel, détection d'anomalies, analyse des sentiments.
2. **Agent de décision** : Recommandations basées sur des modèles ML (RSI, Tendances, Volumes) et profils de risque (Conservateur, Modéré, Agressif).
3. **Gestion de portefeuille** : Paper trading, suivi de la performance (ROI, Ratio de Sharpe).

**Contraintes techniques :**
- Frontend : React, Recharts
- Backend : FastAPI (Python)
- Machine Learning : Scikit-Learn (Régression linéaire, Z-Score)
- Déploiement et Temps de réponse rapide (ex: <50ms pour la détection d'anomalies).

---

## 2. WBS (Work Breakdown Structure)

La structure de découpage du projet (OTP) :

```mermaid
mindmap
  root((Assistant Intelligent BVMT))
    1 Management de Projet
      1.1 Cahier des charges
      1.2 Planification Gantt et PERT
      1.3 Reunions et Suivi
    2 Conception
      2.1 Architecture Systeme
      2.2 Maquettes UI UX
      2.3 Modelisation des donnees
    3 Developpement Data et ML
      3.1 Ingestion des donnees BVMT
      3.2 Modeles de prediction des prix
      3.3 Moteur analyse des sentiments
    4 Developpement Backend API
      4.1 Endpoints de marche
      4.2 Module Paper Trading
      4.3 Authentification et Securite
    5 Developpement Frontend
      5.1 Dashboard Temps Reel
      5.2 Composants Graphiques
      5.3 Integration API
    6 Tests et Deploiement
      6.1 Tests Unitaires Integration
      6.2 Recette Globale
      6.3 Mise en production
```

---

## 3. Réseau PERT

Le diagramme PERT illustre les dépendances entre les grandes tâches du projet.

```mermaid
graph LR
    A((Début)) --> B(1. Planification)
    B --> C(2. Conception UI/Arch)
    C --> D(3. Ingestion Données)
    C --> E(4. Setup Frontend)
    D --> F(5. Dev Modèles ML)
    F --> G(6. Dev Backend API)
    E --> H(7. Dev Composants UI)
    G --> I(8. Intégration Front/Back)
    H --> I
    I --> J(9. Tests & Validation)
    J --> K(10. Déploiement)
    K --> L((Fin))
```
*Chemin critique estimé : Planification -> Conception -> Données -> Modèles ML -> Backend API -> Intégration -> Tests -> Déploiement.*

---

## 4. Planning de Projet (Gantt)

Vue chronologique estimative du projet (sur une base de 6 semaines).

```mermaid
gantt
    title Planning du Projet : Assistant BVMT
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m
    
    section 1. Management
    Planification initiale       :a1, 2026-03-09, 4d
    Suivi de projet              :a2, after a1, 38d
    
    section 2. Conception
    Architecture et UI           :b1, 2026-03-13, 5d
    
    section 3. Data & ML
    Ingestion données BVMT       :c1, 2026-03-18, 5d
    Développement modèles ML     :c2, after c1, 7d
    
    section 4. Backend
    Création API FastAPI         :d1, 2026-03-30, 6d
    Agent de décision            :d2, after d1, 5d
    
    section 5. Frontend
    Mise en place React          :e1, 2026-03-18, 4d
    Dashboard & Graphiques       :e2, after e1, 7d
    
    section 6. Intégration & Prod
    Intégration API <-> UI       :f1, 2026-04-10, 5d
    Tests Globaux                :f2, after f1, 3d
    Déploiement                  :f3, after f2, 3d
```

---

## 5. Matrice RACI

Attribution des rôles et responsabilités :
*(R: Réalise / A: Approuve / C: Consulté / I: Informé)*

| Tâches / Rôles | Chef de Projet | Lead Tech (Backend/IA) | Développeur Frontend | Client / Sponsor |
| :--- | :---: | :---: | :---: | :---: |
| Définir le cahier des charges | **R** | C | C | **A** |
| Choix de l'architecture | **A** | **R** | C | I |
| Développer le moteur ML | **A** | **R** | I | I |
| Créer l'API Backend | **A** | **R** | C | I |
| Développer les Vues React | **A** | C | **R** | I |
| Intégration des composants | **A** | **R** | **R** | I |
| Validation et Tests finaux | **R** | C | C | **A** |

---

## 6. Plan de Gestion de la Communication

Ce plan définit comment, quand et à qui les informations du projet seront distribuées.

| Type de communication | Format / Outil | Fréquence | Participants | Objectif |
| :--- | :--- | :--- | :--- | :--- |
| **Mêlée quotidienne (Daily)** | Discord / Teams (15 min) | Quotidienne | Equipe Projet | Point d'avancement, blocages. |
| **Revue de sprint / Point Avancement** | Visioconférence (1h) | Hebdomadaire | Equipe + Chef de Projet | Présenter ce qui est terminé (Démo). |
| **Comité de pilotage (Copil)** | Rapport PPT / Document | Mensuelle | Chef de projet + Sponsor | Valider les jalons, budget, et risques. |
| **Suivi des Tâches** | Jira / Trello | En continu | Equipe Projet | Affectation des tickets de développement. |
| **Documentation technique** | GitHub / README / Notion | En continu | Equipe Projet | Capitalisation des connaissances. |

---

## 7. Plan de Management de Projet (PMP)

Le **PMP** est le document cadre qui régit l'exécution du projet.

1. **Cycle de vie et Méthodologie** : Le projet sera mené en méthode **Agile (Scrum)** avec des itérations courtes (Sprints de 1 ou 2 semaines) afin de valider rapidement les performances des modèles d'IA.
2. **Gestion du périmètre (Scope)** : Toute modification du cahier des charges après le lancement devra passer par une demande de changement formelle validée par le Sponsor pour éviter les dérives (*Scope Creep*).
3. **Gestion des risques majeurs** :
   * *Qualité des données BVMT* (Risque: Modéré) : Données parfois incomplètes. -> Action : Mise en place de scripts de nettoyage avancés (Pandas).
   * *Performance de l'IA (Précision)* (Risque: Élevé) : Les prédictions ne sont pas assez précises. -> Action : Commencer par la régression linéaire pour avoir une baseline, puis itérer si besoin.
   * *Fiabilité de l'infrastructure* (Risque: Modéré) : Lenteur de l'application ou surcharge du serveur en production. -> Action : Utiliser l'asynchrone de FastAPI et faire des tests de charge (locust).
   * *Sécurité et Authentification* (Risque: Critique) : Accès non autorisé au module de paper trading et manipulation des données. -> Action : Implémenter des tokens JWT sécurisés et chiffrer les mots de passe.
   * *Changement de format des fichiers BVMT* (Risque: Modéré) : Les sources de données peuvent évoluer ou casser le système d'ingestion. -> Action : Créer des alertes pour le dataloader et une validation de schéma des données.
4. **Assurance Qualité** : Mise en place de tests unitaires sur la logique de trading. Validation de l'UI/UX par des wireframes avant développement.
5. **Gestion des Ressources** : Mobilisation d'un Data Scientist pour le back-end/ML et d'un développeur React pour le front-end. Utilisation des crédits Cloud gratuits/étudiants pour limiter le budget de l'infrastructure.
