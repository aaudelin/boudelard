# 🗺️ CARTES & PROMPTS — Le Masque de Henry Le Pottier

Cinq cartes pour la session. Pour chacune : **à quoi elle sert**, **ce qui doit absolument y figurer**, un **prompt Higgsfield prêt à copier**, et des **pistes de cartes existantes** si vous préférez ne rien générer.

---

## ⚙️ AVANT DE COMMENCER

### Déposer une carte dans l'app

1. Espace MJ (`/bestiaire`, mot de passe habituel) → panneau **Carte**.
2. Une **seule image active** à la fois : charger une nouvelle carte **réinitialise les positions des pions**. Chargez donc la carte *juste avant* la scène.
3. Réglez la **largeur réelle en mètres** (c'est l'échelle qui fait la portée des sorts). Les valeurs sont indiquées pour chaque carte ci-dessous.
4. Le bouton de **rotation à 90°** permet de basculer une carte paysage en portrait sans la réexporter — pratique sur téléphone.
5. L'image est **compressée côté client** (limite ~950 Ko une fois encodée). Exportez raisonnable : **1600-2200 px de large en JPG** passe très bien. Inutile de charger du 4K.
6. Les pions **PNJ et ennemis sont masqués par défaut** côté joueurs : révélez-les depuis la rencontre au moment voulu. Sur les cartes d'énigme, ça permet de cacher le piège.

### La recette générale des prompts

Tous les prompts ci-dessous sont bâtis sur le même squelette, réutilisable pour vos propres cartes :

```
top-down orthographic battle map, [LIEU], [AMBIANCE], [DÉTAILS CLÉS],
tabletop RPG battlemap, clean readable layout, soft even lighting,
no characters, no text, no labels, 16:9
```

- **Rendu du dessus**, toujours : `top-down orthographic`. Sans ça, Higgsfield vous fait une belle illustration inutilisable comme carte.
- **`no characters, no text, no labels`** est indispensable : les pions, c'est l'app qui les gère, et l'IA écrit n'importe quoi.
- **Ne demandez pas de grille.** Les IA font des grilles fausses (cases inégales) qui rendent la carte pire. Réglez plutôt l'échelle dans l'app.
- **Ratio :** `16:9` pour les extérieurs et les grandes salles, `1:1` pour les salles rondes (cartes 2 et 5).
- Si le rendu est trop illustratif, ajoutez : `flat lighting, no perspective, seen from directly above, architectural floor plan feel`.
- Pour la cohérence visuelle de la session, gardez le même suffixe de style sur les cinq : `muted palette, subtle green wireframe glitches bleeding through the edges` — c'est la signature du scénario, la simulation qui transparaît.

---

## 🗺️ CARTE N°1 — LA PLACE DE MÉCANIA EN FÊTE

**Sert à :** Énigme 1 (les sept fautes) puis Combat 1 (les Figurants).
**Échelle :** largeur ≈ **30 m**.

**Doit y figurer :**
- Une **place centrale** dégagée (il faut de la place pour 8 Figurants + 3 PJ + Mysteria)
- **Le puits** — bien visible, c'est la sortie du combat
- **Les statues** (il en faut **quatre**, dont une encapuchonnée un peu en retrait)
- Le **four du boulanger**, la fontaine, des guirlandes entre les maisons
- 3-4 ruelles d'accès sur les bords (les renforts entrent par là)

**Prompt Higgsfield :**
```
top-down orthographic battle map of a small medieval village square decorated
for a festival, colorful bunting and paper garlands strung between stone houses,
a central stone fountain, an old stone well to one side, a baker's oven with
bread crates, four stone statues on pedestals along the edge of the square,
cobblestone ground, four narrow alleys leading off the square, warm midday light
with hard unmoving shadows, tabletop RPG battlemap, clean readable layout,
muted palette, subtle green wireframe glitches bleeding through the edges,
no characters, no text, no labels, 16:9
```

**Variante « le monde craque »** (à recharger au moment du combat, effet garanti) — même prompt, en remplaçant la fin par :
```
...the festival frozen mid-air, spilled drinks hanging suspended, half the
square dissolving into a green wireframe grid, colors draining to grey,
tabletop RPG battlemap, no characters, no text, no labels, 16:9
```

**Pistes de cartes existantes :**
- [Town Center — 2-Minute Tabletop](https://2minutetabletop.com/product/town-center/) — la plus proche du besoin
- [Medieval City Center](https://2minutetabletop.com/product/medieval-city-center/)
- [Snowy Plaza](https://2minutetabletop.com/product/snowy-plaza/) — si vous voulez une ambiance plus glaçante
- [Toutes les cartes gratuites de 2-Minute Tabletop](https://2minutetabletop.com/product-category/free/)

---

## 🗺️ CARTE N°2 — LE SANCTUAIRE DE FORMEUS

**Sert à :** tout l'Acte 2 (réveil de Ginny, Énigme 2, la forge). **Pas de combat** — c'est une carte d'ambiance, mais elle porte la meilleure scène de la session.
**Échelle :** largeur ≈ **15 m**. **Ratio 1:1.**

**Doit y figurer :**
- Une **salle ronde**, chaude, éclairée aux lampes
- Des **murs couverts de prothèses** : bras, jambes, mains, mâchoires, yeux de verre, classés par taille
- Une **table centrale** (c'est là qu'on pose Ginny)
- Un **établi de forge** avec trois anneaux de cuivre et trois cristaux (l'énigme)
- Une porte qui n'a pas l'air d'avoir toujours été là

**Prompt Higgsfield :**
```
top-down orthographic battle map of a round underground workshop, warm lamp
light, walls entirely covered with hanging mechanical prosthetic limbs — arms,
legs, hands, jaws, glass eyes — sorted by size on wooden racks, a stone
examination table in the centre, a cluttered forge workbench with copper rings
and three glowing crystals, tools, scattered blueprints, a small brazier,
cozy and cluttered and slightly unsettling, tabletop RPG battlemap, clean
readable layout, muted palette, subtle green wireframe glitches bleeding
through the edges, no characters, no text, no labels, 1:1
```

**Pistes de cartes existantes :**
- [Steampunk Laboratory — 2MT](https://2minutetabletop.com/product/steampunk-laboratory/) — le meilleur candidat
- [Wizarding School Classroom — 2MT](https://2minutetabletop.com/product/wizarding-school-classroom/) — clin d'œil Boudelard assumé
- [Cartes taguées « workshop » chez 2MT](https://2minutetabletop.com/product-tag/workshop/)

---

## 🗺️ CARTE N°3 — LES TERRES NON RENDUES

**Sert à :** la traversée et le Combat 2 (Effaceurs + Désencodeur).
**Échelle :** largeur ≈ **40 m** (il faut de l'espace, les Effaceurs se téléportent de 9 m).

**Doit y figurer :**
- Des **îlots de monde qui flottent dans du gris** : un bout de rue pavée, une moitié de forêt, un escalier qui monte vers rien
- **La même grange recopiée plusieurs fois en ligne** — c'est le détail qui vend l'idée
- Des passages étroits entre les îlots (les points de blocage tactiques)
- Du **vide** partout ailleurs : on marche dessus, mais ça n'a pas l'air praticable

**Prompt Higgsfield :**
```
top-down orthographic battle map of broken fragments of a world floating in
featureless grey void, disconnected islands of terrain — a section of
cobblestone street, half a pine forest cut cleanly in two, a stone staircase
rising to nothing, the exact same wooden barn duplicated four times in a
perfect row — narrow land bridges between the fragments, edges of the terrain
fraying into green wireframe grid, no sky, no horizon, flat even lighting,
eerie and empty, tabletop RPG battlemap, clean readable layout, muted grey
palette, no characters, no text, no labels, 16:9
```

**Pistes de cartes existantes :**
- [The Shattered Sky — 2MT](https://2minutetabletop.com/product/shattered-sky/) — presque parfait tel quel
- [The Shattered Bridge — 2MT](https://2minutetabletop.com/product/shattered-bridge/) — conçu pour se raccorder au précédent
- [The Shattered Sky Pack](https://2minutetabletop.com/product/shattered-sky-pack/) — 4 variantes, de quoi enchaîner plusieurs fragments

---

## 🗺️ CARTE N°4 — LE SEUIL DU PARE-FEU

**Sert à :** Touffu 2.0 (combat évitable) puis Énigme 3 (la porte acrostiche).
**Échelle :** largeur ≈ **24 m**.

**Doit y figurer :**
- Une **esplanade de pierre noire**, nette, finie — contraste total avec la carte 3
- Au fond, une **porte colossale sans poignée ni serrure**, couverte d'écriture minuscule
- De la place devant la porte pour que le molosse se couche en travers
- Deux ou trois piliers pour se mettre à couvert (sinon le combat est une boucherie)

**Prompt Higgsfield :**
```
top-down orthographic battle map of a polished black stone esplanade ending at
a colossal sealed door, the door has no handle and no keyhole and is covered
edge to edge in tiny engraved handwriting, three broken stone pillars on the
esplanade providing cover, the grey void pressing in at the outer edges of the
platform, cold blue light, solemn and finished and far too clean, tabletop RPG
battlemap, clean readable layout, muted palette, subtle green wireframe
glitches bleeding through the edges, no characters, no text, no labels, 16:9
```

> ⚠️ Higgsfield va probablement écrire du faux texte sur la porte malgré le `no text`. **Ce n'est pas grave** : du charabia gravé, c'est exactement le bon rendu. Le vrai poème, vous le tendez sur papier (`enigmes-joueurs.md`).

**Pistes de cartes existantes :**
- [Celestial Temple — 2MT](https://2minutetabletop.com/celestial-temple-battle-map/) — esplanade + grande entrée
- [Secret Research Facility — 2MT](https://2minutetabletop.com/product/secret-research-facility/) — si vous préférez la version sas blindé sci-fi

---

## 🗺️ CARTE N°5 — LE BUREAU 47

**Sert à :** tout l'Acte 4 (Belle, puis Henry, en deux phases).
**Échelle :** largeur ≈ **18 m**. **Ratio 1:1.**

**Doit y figurer :**
- Une **pièce ronde en haut d'une tour**, croulante de livres
- Une **cheminée allumée**, deux fauteuils fatigués, une théière
- Un **grand bureau** couvert de papiers, avec un livre ouvert et annoté
- Le **mur de cartes encadrées, numérotées** — avec un cadre vide qui attend
- Des **fenêtres qui donnent sur du gris**
- Assez de mobilier pour que la *Réécriture du décor* d'Henry ait quelque chose à déplacer

**Prompt Higgsfield :**
```
top-down orthographic battle map of a circular tower study, floor to ceiling
bookshelves overflowing with books and loose papers, a lit stone fireplace,
two worn armchairs and a tea set, a large cluttered wooden desk with an open
annotated book, one wall covered with dozens of small framed numbered maps in
neat rows with a single empty frame among them, tall arched windows looking out
onto featureless grey, warm firelight against cold grey light, scholarly and
lonely, tabletop RPG battlemap, clean readable layout, muted palette, subtle
green wireframe glitches bleeding through the edges, no characters, no text,
no labels, 1:1
```

**Variante Phase 2** (à recharger quand Henry brise le 2ᵉ Sceau — les joueurs adorent voir la carte changer sous les pions) :
```
...the same circular tower study now breaking apart, bookshelves toppled and
sliding, pages suspended in the air, half the floor dissolved into green
wireframe grid, the framed maps blank and empty, fire still burning, tabletop
RPG battlemap, no characters, no text, no labels, 1:1
```

**Pistes de cartes existantes :**
- [The Wizard's Tower — 2MT](https://2minutetabletop.com/the-wizards-tower/)
- [Wizarding School Library — 2MT](https://2minutetabletop.com/wizarding-school-library-battle-map/)

---

## 📚 AUTRES BANQUES DE CARTES

Si vous voulez chercher vous-même plutôt que générer :

| Source | Ce qu'on y trouve |
|---|---|
| [2-Minute Tabletop](https://2minutetabletop.com/product-category/free/) | Le meilleur rapport qualité/gratuité. Beaucoup de cartes libres, le reste en pack |
| [Dyson Logos](https://dysonlogos.blog/maps/my-dyson-logos-maps/) | Des centaines de plans noir & blanc, licence très permissive |
| [r/battlemaps](https://www.reddit.com/r/battlemaps/) | Le flux communautaire, énorme et gratuit |
| [Moonlight Maps](https://shop.moonlight-maps.com/collections/scifi-maps) | Sci-fi et cyberpunk, parfait pour tout ce qui est Mécania |
| [Miska's Maps](https://www.miskasmaps.com/) | Cartes gratuites, dont pas mal d'extérieurs |
| [SolutionMaps (Foundry, gratuit)](https://foundryvtt.com/packages/solutionmaps-freebies) | 40+ cartes cyberpunk/sci-fi |
| [Fragmaps (Foundry, gratuit)](https://foundryvtt.com/packages/fragmaps-free) | Cyberpunk dessiné à la main |

> ⚠️ Vérifiez le statut gratuit/payant sur la page avant de télécharger : les catalogues bougent, et certaines cartes citées ici sont dans des packs pour soutiens.
