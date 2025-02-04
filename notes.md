# thesis working notes, TODOs

## 28.1.2025

- prvni meeting
- stanoveni tematu - predikce cryptic binding sites, CryptoBench paper, AHoJ-DB a AHoJ -> vizualizace a webovy tool
- detekce pocketu ze 2 rezidui - clustering (ze dvou rezidui chceme urcovat cele pockety, ktere se k danemu binding spotu vazou)
- ukazat AHoJ-DB prekryv vice struktur?? 
- ukazat animaci mezi jednotlivymi stavy - treba v Mol*
- MDpocket - related paper

- otazky
  - jak to je s uniprot accession, je k jednomu proste vic PDB struktur? cim je to identifikovano, sekvenci??
  - co je lepsi, mensi resolution struktury?

## 4.2.2025

- recap
- workflow
  - zaciname se strukturou, muze byt z AFDB nebo RCSB PDB, pripadne i custom -> sequence -> (spolecne se strukturou) jdou do ML modelu, 
  ktery vyhodi residue-level predikce -> clustering, chceme z toho dostat pockety (resp. pocket-level predikce) -> GUI
  - GUI
    - "PrankWeb" cast - zobrazit pockety nejak obarvene, pripadne residue-level predikci a nejake informace o tom
    - query do AHoJ (pripadne PDB-KB), kde chceme dostat apo/holo (hlavne ty holo a jejich ligandy) struktury a pripadne jejich superpozice
    - superpozice pote chceme nejak vizualizovat, nejlepe aby to bylo videt pres sebe v Mol*
    - bylo by fajn tam mit moznost nejak vizualizovat motion ze snapshotu v PDB (napriklad pres dopocitani pres nejakou interpolaci)
    - pote take moznost z vysledku se dotazat do PDB
- next steps
  - pripravit architekturu tak, aby bylo mozne "neco poustet"
  - zkusit si rozbehnout nejaky model, viz zpravy s Vitou