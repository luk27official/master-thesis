# thesis working notes, TODOs

## 28.1.2025 (meeting)

- prvni meeting
- stanoveni tematu - predikce cryptic binding sites, CryptoBench paper, AHoJ-DB a AHoJ -> vizualizace a webovy tool
- detekce pocketu ze 2 rezidui - clustering (ze dvou rezidui chceme urcovat cele pockety, ktere se k danemu binding spotu vazou)
- ukazat AHoJ-DB prekryv vice struktur?? 
- ukazat animaci mezi jednotlivymi stavy - treba v Mol*
- MDpocket - related paper

- otazky
  - jak to je s uniprot accession, je k jednomu proste vic PDB struktur? cim je to identifikovano, sekvenci??
  - co je lepsi, mensi resolution struktury?

## 4.2.2025 (meeting)

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

## 16.2.2025

- prvni sketch architektury
  - budeme chtit 4 services
  - frontend: React - chceme proste neco, co se pouziva
  - backend pro server a postprocessing: FastAPI - chceme neco nejlepe v Pythonu, ale je to celkem jedno, spis pro konzistenci
  - backend pro ML: FastAPI - chceme neco, co se da pustit na GPU i CPU, proto to je separatni service, pozadavek Python kvuli ML
  - NginX: reverse proxy - chceme pod 1 domenou mit vsechny porty namapovane spravne
  - flow
    - User uploads a file from the frontend -> File is sent to backend 
    - Backend stores the file and forwards it to the ML machine -> Uses an HTTP request to ML Server (http://ml-server:9000/process)
    - ML Machine processes the file and returns results -> Runs ML inference, stores results, and sends back a response
    - Backend post-processes results and sends updates to frontend -> Uses WebSockets for real-time updates
    - Frontend receives and displays the final results
  - cele to bude zabalene do Docker Compose

## 23.2.2025

- mam prvni navrzenou architekturu
  - frontend: NginX, ktery dokaze servnout static files a je tam React
  - backend: FastAPI pro pousteni predikci
  - worker: Celery, CUDA support
  - redis: pro komunikaci FastAPI a Celery
  - chceme checkovat postupne task-status, asi se vykaslat na WebSockets a radsi to udelat pres polling? idk
  - 32 GB RAM requirement...
- TODO:
  - zacit pracovat na frontendu
  - poresit GPU, kde se to da poustet
  - zacit se ptat na ten clustering
  - podivat se na custom Celery status... https://celery.school/custom-celery-task-states
  - fix warningy z Celery apod.

## 27.2.2025 (meeting)

- Vita mi pretrenoval model na mensi, takze uz to rozjedu = pog
- TODOs:
  - zacit delat clustering, pripadne si promyslet, jak by se dalo na CryptoBench datasetu natrenovat neco pro ty pockety
  - podivat se na single-linkage clustering
  - insight: muze se hodit pocitat pairwise distances
  - po clusteringu se muzeme posunout dal

## 13.3.2025

- zacal jsem delat na clusteringu, zatim mam nejaky DBScan clustering
- TODOs:
  - zejmena se podivat na frontend, zprovoznit Mol*, udelat nejakou dalsi stranku, kde budou videt ty vysledky
- na co se zeptat
  - Mol* funkcionalita - co presne budeme chtit? taky ruzne reprezentace, nebo staci cartoon? jak s temi barvami, potrebujeme neco togglable? budeme mit vice struktur? co se bude nakonec animovat?
  - vypsat v SISu tema podle abstraktu
  - u clusteringu - chceme teda delat nejaky "fine-tuning"? nemusi to byt vylozene primo trenovany model, ale minimalne gridsearch k tem parametrum

## 25.3.2025 (meeting)

- na co se zamerit do priste
  - PrankWeb features: pridat tam to prepinani reprezentaci jako mam v PW, pridat i cartoon pro pockety, vylepsit trochu vizualy k tomu stavajicimu interface
  - AHoJ integrace - co bude potreba, je vlastne udelat nejakou query do AHoJ podle PDB ID a potom zas nejaky prostredni residuum, AHoJ nebude dostupna v pripade custom struktury, dostanu list APO/HOLO struktur pro kazdy pocket, takze to chci nejak zobrazit. pak pro kazdou strukturu chci nejake info o tom (treba pritomnost ligandu, seq shoda s orig. strukturou), pro nejakou vyssi shodu struktur pak chci umet udelat interpolaci - vystrihnu stejna rezidua a udelam mezi nima interpolaci, kterou pak vlastne animuju po kliknuti na nejaky play tlacitko
  - dal se taky podivat co v AHoJ je pro me uzitecne a jak by se dalo improvnout API, nejlepe treba vytvorit pouze jeden JSON soubor
  - clustering - pridat metriky, pomerit to s nejakym existujicim datasetem (CryptoBench)

## TODOs checklist

### DevOps

- [ ] poresit GPU s Klimkem/Yaghobem
- [x] pridat auto-deployment Dockeru do GitHub repa
- [ ] pridat auto-deployment Dockeru na Docker Hub https://docs.github.com/en/actions/use-cases-and-examples/publishing-packages/publishing-docker-images#publishing-images-to-docker-hub-and-github-packages
- [ ] pridat nejaky CI blbosti do GitHubu
- [x] pridat Docker healthcheck
- [ ] test healthchecks

### Backend

- [x] udelat si initial clustering
- [x] implementovat Celery status
- [ ] fix TODOs v kodu
- [ ] dodelat clustering poradne, implementovat metriky pro lepsi pocket creation (nechceme jen brat podle thresholdu)
- [x] misto UUID nastavit nazvy jobu na MD5 nebo nejaky hash toho .cif/.pdb file a udelat caching
- [x] pridat OpenAPI specifikaci, nejlepsi by bylo to delat nejak automaticky
- [ ] improvnout OpenAPI, pridat response types, pridat errory, ...
- [x] zamyslet se nad tim, jestli nebude lepsi pridat error codes jako 400 etc.
- [x] zkusit pridat nejakou lepsi hlasku na zacatek processingu (mozna na frontend), protoze ted se tam kvuli cachovani stahuje struktura a vypada to pomaly
- [x] poresit pripad, kdy vypocet failne - momentalne se ten result neulozi, takze se to vlastne resi timhle :)

### Frontend

- [ ] fix TODOs v kodu
- [ ] moznost dat treba export do PyMOLu by se celkem hodila (jako vytvorit z toho nejaky prikaz do PyMOL na zobrazeni tech pocketu)
- [ ] pridat templating pro head apod.
- [x] custom upload struktury
- [x] pridat moznost videt stare joby (asi ukladat v localStorage)
- [x] pridat do Mol* barvy
- [x] pridat do Mol* label, ktery bude obsahovat informaci o predikci, pripadne i o pocketu
- [ ] u clusteringu pridat threshold (ted tam je fixni), aby se dal menit uzivatelem?? uvidim podle toho clusteringu
- [ ] pridat do Mol* animaci (viz meeting 25/3)
- [ ] pridat query do AHoJ

### Others

- [x] napsat abstrakt do SIS
- [ ] vypsat zadani v SISu
- [ ] nechat si zapsat zapocty
- [ ] pridat testy??

## SIS proposal

Proteins are a key element in many biological interactions. Some amino acids (also called residues) of proteins have more potential to bind additional molecules, which is important in drug design and research. So-called cryptic binding sites (CBS) are spots on the proteins interacting with these molecules. However, detecting CBS requires specialized models. The goal of this thesis is to leverage existing models focused on CBS, and create a new web interface enabling easy user interaction, allowing the user to predict the CBS and view the results. The user provides a protein structure, for which a residue-level prediction is computed by the model. These results are then post-processed into individual binding sites by clustering and shown to the user.

## Architecture sketch

<img src="./img/sketch.jpg" />
