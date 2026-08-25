# Deploy-Checkliste: „Stand"-Veröffentlichung

Diese Checkliste ergänzt `CMS_SETUP.md` und beschreibt den Weg vom aktuellen Branch
(`feat/content-cms`) zum scharfen Betrieb des **Stand-Modells** (mehrere Einträge sammeln,
mit einem Klick als ein Commit veröffentlichen). Reihenfolge einhalten – die Schritte
bauen aufeinander auf und sind bewusst so gelegt, dass die Live-Seite bis zuletzt
unangetastet bleibt.

## Wichtige Vorbedingung (leicht übersehen)

`repository_dispatch`-Workflows laufen bei GitHub **nur, wenn die Workflow-Datei auf dem
Standard-Branch (`master`) liegt**. Das betrifft:

- `content-promote.yml` (Event `publish-stand`) – der „Stand veröffentlichen"-Knopf,
- die Weiterreichung `continue-content-publish` in `content-publish.yml`,
- die Deploy-Auslösung `deploy-pages` in `pages.yml`.

**Konsequenz:** Der „Stand veröffentlichen"-Knopf funktioniert erst, wenn diese CMS-Infrastruktur
nach `master` gemergt ist. Das ist gewollt – die Infrastruktur ist bewusst vom Inhalt getrennt.

---

## A. Was noch fehlt

- [ ] **1. Diese Branch nach `master` bringen.** `feat/content-cms` (Workflows + `public/admin/*`
      + `scripts/*`) auf `master` mergen, damit die Dispatch-Workflows greifen. Enthält **keine**
      Inhaltsänderungen an der Live-Seite.
- [ ] **2. Online-Backend einrichten** (falls noch nicht geschehen, siehe `CMS_SETUP.md`,
      „Online setup after approval"):
      Redakteurs-GitHub-Konto als Collaborator, GitHub-OAuth-App, `sterlingwes/decap-proxy`
      als Cloudflare Worker, Repo-Variable `CMS_OAUTH_URL`, Branch `cms-content` aus `master`.
- [ ] **3. Token-Rechte für den Publish-Knopf klären.** Der Knopf feuert `repository_dispatch`
      mit dem OAuth-Token, das Decap ohnehin hält (`auth_scope: public_repo`). Das reicht für ein
      **öffentliches** Repo. Beim Wegwerftest (Schritt B-2) prüfen: Kommt beim Knopfdruck der
      `content-promote`-Lauf zustande? Falls **nein** (403): als saubere Alternative einen
      `/publish`-Endpunkt in den decap-proxy-Worker aufnehmen (Token bleibt serverseitig) und den
      Knopf dorthin zeigen lassen.
- [ ] **4. Branch-Schutz für `master`.** Direkte Pushes sperren; die Übernahme erfolgt nur über
      den `content-promote`-Merge. (Kein Status-Check als *required* auf `master` erzwingen, der auf
      dem PR nie grün wird – die Prüfung läuft auf `cms-content`, nicht auf dem Promote-PR.)
- [ ] **5. Pages vorerst auf `gh-pages` lassen.** `ENABLE_PAGES_ACTIONS` **nicht** setzen, bis der
      Wegwerftest (B-2/B-3) sauber durchläuft.

---

## B. Was auf dem Weg dahin auszuprobieren ist

### B-0. Lokal (jetzt, ohne Konten)
```sh
npm ci
npm run dev
```
- Editor `http://localhost:3000/admin/` → „Lokal öffnen".
- Zwei bis drei Einträge anlegen und **„Lokal speichern"**.
- Prüfen: Beide erscheinen live auf `http://localhost:3000/` (Atlas + Galerie); die JSON-Dateien
  sammeln sich unter `src/content/locations/`; der „Stand veröffentlichen"-Knopf ist ausgeblendet.
- `git status` / `git diff` zeigt genau diese Dateien – nichts wird gepusht.

### B-1. Automatische Prüfungen grün (vor dem Online-Test)
```sh
npm run validate-content -- --strict-media
npm run test:admin
HEAD_REF=cms-content BASE_SHA=origin/master HEAD_SHA=HEAD npm run validate-cms-pr
```
Der letzte Befehl muss auch mit **mehreren** geänderten Einträgen „gültig" melden.

### B-2. Online-Wegwerftest – Veröffentlichen ohne Live-Risiko
Voraussetzung: A-1 bis A-4 erledigt, Pages weiterhin auf `gh-pages` (A-5).
- Im Online-Editor (`/admin/`) einloggen, **zwei** Einträge anlegen und „Speichern".
- Beobachten: Statuszeile „Prüfung läuft …" → **„Stand ist veröffentlichbar."** (grün).
  Auf GitHub sollte der Lauf **Content Publish** auf `cms-content` grün sein.
- **„Stand veröffentlichen"** klicken → „Veröffentlicht." Prüfen auf GitHub:
  - **Content Promote** lief,
  - auf `master` landete **genau ein** Merge-Commit mit beiden Einträgen,
  - `cms-content` zeigt danach wieder auf denselben Stand (kein offener Diff),
  - `pages.yml` wurde angestoßen, tut aber wegen `ENABLE_PAGES_ACTIONS ≠ true` **nichts** –
    die Live-Seite (noch über `gh-pages`) bleibt unverändert.

### B-3. Negativtest – das Quality-Gate greift
- Einen Eintrag absichtlich ungültig machen (z. B. zwei Einträge mit **gleicher**
  Galerie-Position oder ein PNG mit Transparenz) und speichern.
- Erwartung: Status **rot** („Der Stand enthält Fehler."), der Knopf ist **gesperrt**,
  `master` bleibt unverändert. Fehler beheben → wieder grün.

### B-4. Scharfschalten von Pages
- Erst wenn B-2 und B-3 sauber sind: Repo-Variable `ENABLE_PAGES_ACTIONS=true` setzen.
- `pages.yml` einmal manuell starten (Actions → Pages → „Run workflow") und den Build/Deploy
  beobachten (er re-validiert und baut neu = **Tor 3**).
- Pages in den Repo-Einstellungen auf **„GitHub Actions"** umstellen.
- `https://www.vtfalte.de/` prüfen.

---

## Rückweg (Recovery)

Kein Workflow verändert oder löscht `gh-pages`. Zum Zurückrollen in den Repo-Einstellungen
Pages wieder auf **„Deploy from a branch"** stellen, `gh-pages` / `/(root)` wählen und
`https://www.vtfalte.de/` prüfen.
