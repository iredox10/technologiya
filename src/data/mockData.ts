import type { Article, Author } from '../types';

const mockAuthor: Author = {
  id: '1',
  name: 'Musa Ibrahim',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Musa',
  bio: 'Marubucin labarai na fasaha'
};

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra: Bita Cikakke',
    slug: 'samsung-galaxy-s24-ultra-bita',
    excerpt: 'Wannan shine mafi kyawun wayar Samsung da aka taba samarwa. Mu duba abin da yake da shi.',
    content: `<h1>Samsung Galaxy S24 Ultra: Bita Cikakke</h1>

<p>Samsung ta sake yin tarihi ta kawo sabuwar wayarta Galaxy S24 Ultra, wacce ta zo da ingantattun fasaloli masu ban mamaki da suka sa ta zama daya daga cikin mafi kyawun wayoyin da ake samu a kasuwa a wannan lokacin.</p>

<h2>Ƙira da Gini</h2>

<p>Galaxy S24 Ultra tana da ƙira mai ƙyau da kuma inganci. Jikin wayar an yi shi da aluminum da gilashi masu ƙarfi. Launuka masu samuwa sun haɗa da Phantom Black, Phantom Silver, Phantom Violet da Phantom Green.</p>

<p>Wayar tana da nauyi na gram 234 kuma tana da kauri na 8.6mm. Duk da girman ta, tana da daɗin riƙewa saboda ƙirar ta ta zamani. An kuma yi mata kariya daga ruwa da ƙura ta hanyar IP68 rating.</p>

<h2>Allo (Display)</h2>

<p>Wannan wayar tana da allo mai girman 6.8-inch Dynamic AMOLED 2X mai inganci sosai. Resolution ɗin allo shine 1440 x 3088 pixels wanda ke ba da ƙarancin pixel kaɗai kaɗai.</p>

<p>Allo yana da refresh rate na 120Hz wanda ke sa ya zama mai santsi sosai yayin amfani. Ana iya amfani da shi a waje cikin hasken rana mai ƙarfi saboda haske na peak brightness na 2600 nits.</p>

<h2>Kamara</h2>

<p>Samsung ta ƙware wajen ƙirƙirar kamara a wannan wayar. Tana da kamara guda uku a baya:</p>

<ul>
<li><strong>Main Camera:</strong> 200MP mai aperture f/1.7 da OIS</li>
<li><strong>Telephoto Camera:</strong> 50MP mai 5x optical zoom</li>
<li><strong>Ultra-wide Camera:</strong> 12MP mai 120° field of view</li>
</ul>

<p>Kamara ta gaba tana da 12MP mai aperture f/2.2. Ana iya daukar hotuna masu inganci sosai da kuma yin bidiyo har zuwa 8K resolution.</p>

<h2>Ƙarfin Aiki (Performance)</h2>

<p>Galaxy S24 Ultra tana amfani da Qualcomm Snapdragon 8 Gen 3 processor wanda yake ɗaya daga cikin mafi ƙarfi a duniya. Tana da RAM na 12GB ko 16GB dangane da model ɗin da ka zaɓa.</p>

<p>Storage space yana farawa daga 256GB har zuwa 1TB. Wannan yana ba ka damar adana hotuna, bidiyo da manhajoji da yawa ba tare da damuwa ba.</p>

<h2>Baturi</h2>

<p>Wayar tana da baturi mai ƙarfi na 5000mAh wanda zai ɗauke ka tsawon yini guda ba tare da charging ba. Tana goyan bayan charging mai sauri na 45W da wireless charging na 15W.</p>

<h2>Software</h2>

<p>Samsung Galaxy S24 Ultra tana gudanar da Android 14 tare da One UI 6.1. One UI na Samsung yana da fasaloli masu yawa waɗanda ke sauƙaƙa amfani da wayar.</p>

<h2>S Pen</h2>

<p>Daya daga cikin abubuwan da ke keɓanta Galaxy S24 Ultra shine S Pen. Wannan alƙalami na zamani yana ba ka damar rubutawa, zana da sarrafa wayar cikin sauƙi.</p>

<h2>Farashi</h2>

<p>Galaxy S24 Ultra tana farawa daga $1,299 don model ɗin 256GB. Model na 512GB shine $1,419 yayin da na 1TB ya kai $1,659.</p>

<h2>Ƙarshe</h2>

<p>Samsung Galaxy S24 Ultra babbar wayar ce da za ta dace da duk wanda ke son wayar da ke da ƙarfi da inganci. Kamara ta na daga cikin mafi kyau, performance ta ba ta misali, kuma baturi na tana da ƙarfi sosai.</p>

<p>Idan kana neman wayar premium da za ta ɗauke ka shekaru da yawa, Galaxy S24 Ultra ita ce zaɓi mafi kyau.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    category: {
      id: '1',
      name: 'Wayoyi',
      slug: 'wayoyi'
    },
    tags: ['Samsung', 'Android', 'Bita'],
    author: mockAuthor,
    publishedAt: '2025-10-15T10:00:00Z',
    featured: true,
    views: 1250
  },
  {
    id: '2',
    title: 'Yadda Ake Kare Bayanan Sirri A Yanar Gizo',
    slug: 'yadda-ake-kare-bayanan-sirri',
    excerpt: 'Koyi yadda za ka kare bayanan sirri da kuma tsaron ka a yanar gizo ta hanyoyi masu sauki.',
    content: `<h1>Yadda Ake Kare Bayanan Sirri A Yanar Gizo</h1>

<p>A zamanin da muke ciki yau, yanar gizo ya zama wani muhimmin bangare na rayuwarmu. Muna amfani da shi don ayyuka daban-daban kamar saye-saye, sadarwa, aiki da dai sauransu. Saboda haka, tsaron bayanan sirri ya zama muhimmi sosai.</p>

<p>A wannan labarin, za mu tattauna hanyoyi masu muhimmanci da za ka bi don kare bayanan ka na sirri a yanar gizo.</p>

<h2>1. Yi Amfani da Kalmomin Sirri Masu Ƙarfi</h2>

<p>Kalmar sirrin da kake amfani da shi ita ce ƙofa ta farko ta tsaron asusun ka. Saboda haka, dole ne ya kasance mai ƙarfi da kuma wuya a tsince shi.</p>

<p>Shawarwari don ƙirƙirar kalmar sirri mai ƙarfi:</p>

<ul>
<li>Yi amfani da aƙalla haruffa 12</li>
<li>Haɗa haruffa manya da ƙanana (A-Z, a-z)</li>
<li>Ƙara lambobi (0-9)</li>
<li>Haɗa alamomi na musamman (!@#$%^&*)</li>
<li>Kada ka yi amfani da kalmomi da ake sani (kamar sunan ka, ranar haihuwa)</li>
<li>Kada ka yi amfani da kalmar sirri ɗaya don asusunan ka duka</li>
</ul>

<p>Misali na kalmar sirri mai ƙarfi: <strong>T3chn0!0g1y@2025#Ha</strong></p>

<h2>2. Kunna Two-Factor Authentication (2FA)</h2>

<p>Two-Factor Authentication ko 2FA wata hanya ce ta ƙara tsaro ga asusunan ka. Da wannan hanyar, ko da wani ya sami kalmar sirrin ka, ba zai iya shiga asusun ka ba sai ya sami lambar tabbatarwa ta biyu.</p>

<p>Irin lambar biyu na iya zama:</p>

<ul>
<li>Lambar da za a aika ta SMS</li>
<li>Lambar daga manhaja kamar Google Authenticator ko Authy</li>
<li>Biometric authentication (fingerprint ko face ID)</li>
<li>Hardware security key</li>
</ul>

<p>Kunna 2FA akan duk muhimman asusunan ka kamar email, banking, da kafofin watsa labarun.</p>

<h2>3. Yi Amfani da VPN</h2>

<p>VPN (Virtual Private Network) yana taimaka wajen boye ayyukan ka a yanar gizo. Yana canza IP address ɗin ka kuma yana ɓoye bayanan ka daga masu satar bayanai.</p>

<p>Amfanin VPN:</p>

<ul>
<li>Yana kare bayanan ka akan WiFi na jama'a</li>
<li>Yana ba ka damar shiga shafukan da aka hana a yankin ka</li>
<li>Yana hana websites daga bin ka</li>
<li>Yana ɓoye ayyukan browsing ɗin ka</li>
</ul>

<h2>4. Yi Hankali da Phishing Attacks</h2>

<p>Phishing wata hanya ce da masu fasaha ke amfani da ita don satar bayanan mutane. Sukan aika email ko saƙon da ke kama da na kamfanoni masu gaskiya don neman bayanan sirri.</p>

<p>Yadda za ka gane phishing:</p>

<ul>
<li>Duba adireshin email mai aiko (ko yana daidai?)</li>
<li>Gani idan akwai kurakurai a rubutun</li>
<li>Kada ka danna links daga emails da ba ka tsammani ba</li>
<li>Ko da wani ya ce asusun ka na cikin haɗari, je kai tsaye zuwa shafin don dubawa</li>
</ul>

<h2>5. Sabunta Software ɗin Ka</h2>

<p>Sabuntawa yana kawo gyaran matsalolin tsaro. Kullum sabunta:</p>

<ul>
<li>Operating system ɗin ka (Windows, macOS, Android, iOS)</li>
<li>Browsers ɗin ka</li>
<li>Manhajoji duka</li>
<li>Antivirus software</li>
</ul>

<h2>6. Yi Amfani da HTTPS</h2>

<p>Kafin shigar da bayanan sirri akan kowane shafi, tabbatar cewa shafin yana amfani da HTTPS (ba HTTP kawai ba). HTTPS yana nufin cewa bayanan ka suna da encryption.</p>

<p>Duba alamar kulle (🔒) a gefen URL bar a browser ɗin ka.</p>

<h2>7. Ka Lura da Bayanan da Kake Rabawa</h2>

<p>A kafofin watsa labarun:</p>

<ul>
<li>Kada ka raba bayanan da suka shafi adireshin gidan ka</li>
<li>Kada ka yi post game da tafiye-tafiye kafin ka komo</li>
<li>Saita privacy settings ɗin ka</li>
<li>Duba abokan da kake acceptance ɗinsu</li>
</ul>

<h2>Ƙarshe</h2>

<p>Tsaron bayanan sirri a yanar gizo shine alhakin kowa da kowa. Ta hanyar bin shawarwarin da muka bayar, za ka iya kare kanka da bayanan ka daga haɗari.</p>

<p>Ka tuna: Tsaro ya fara daga kai! Kasance mai hankali koyaushe.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
    category: {
      id: '4',
      name: 'Dabaru',
      slug: 'dabaru'
    },
    tags: ['Tsaro', 'Privacy', 'Dabaru'],
    author: mockAuthor,
    publishedAt: '2025-10-14T14:30:00Z',
    featured: true,
    views: 890
  },
  {
    id: '3',
    title: 'WhatsApp Ya Ƙara Sabbin Fasaloli',
    slug: 'whatsapp-sabbin-fasaloli',
    excerpt: 'WhatsApp ya sanar da sabbin fasaloli da za su inganta hanyar sadarwa tsakanin mutane.',
    content: `<h1>WhatsApp Ya Ƙara Sabbin Fasaloli Masu Ban Mamaki</h1>

<p>WhatsApp, manhaja mafi shahara ta sadarwa a duniya, ta sake kawo sabbin fasaloli da za su inganta hanyar sadarwa tsakanin mutane. Mun tattara muku duk sabbin fasalolin da suka fito a baya-bayan nan.</p>

<h2>1. Channels (Tashoshi) - Samun Labarai Kai Tsaye</h2>

<p>WhatsApp Channels wata sabuwar hanya ce ta samun labarai da updates daga mutane da kamfanoni da kake so. Ya bambanta da groups saboda:</p>

<ul>
<li>Kawai mai kafa channel ne ke iya aika saƙonni</li>
<li>Lambar wayar ka ba za ta bayyana ba</li>
<li>Ba za ka ga sauran masu bin channel ba</li>
<li>Za ka iya bin channels da yawa ba tare da cika wayar ka ba</li>
</ul>

<p>Don bin channel:</p>

<ol>
<li>Bude WhatsApp</li>
<li>Danna tab na "Updates"</li>
<li>Zaɓi "Find channels"</li>
<li>Nemo channel da kake so ka bi</li>
<li>Danna "Follow"</li>
</ol>

<p>Za ka iya bin channels na labarai, wasanni, 'yan wasan kwaikwayo, da sauransu.</p>

<h2>2. Edit Messages - Gyara Saƙonnin Da Ka Aika</h2>

<p>Yanzu za ka iya gyara saƙon da ka riga ka aika a cikin minti 15. Wannan yana taimaka idan:</p>

<ul>
<li>Ka yi kuskure a rubutu</li>
<li>Ka manta ka ƙara wani abu</li>
<li>Ka yi kuskure a sunan mutum</li>
</ul>

<p>Don gyara saƙon:</p>

<ol>
<li>Danna saƙon da ka aika mai tsawo</li>
<li>Zaɓi "Edit" daga menu</li>
<li>Yi gyaran da kake so</li>
<li>Danna alamar duba (✓) don ajiye</li>
</ol>

<p>Za ka ga kalmar "edited" kusa da saƙon don nuna cewa an yi gyara.</p>

<h2>3. Voice Status - Yi Amfani Da Murya</h2>

<p>Yanzu za ka iya yin status ta hanyar murya maimakon rubutu ko hotuna kawai. Wannan yana ba ka damar:</p>

<ul>
<li>Raba tunaninku cikin sauri</li>
<li>Ba da saƙon da ya fi ma'ana</li>
<li>Sadarwa da abokai cikin hanya ta musamman</li>
</ul>

<p>Voice status zai ɓace bayan awa 24 kamar yadda sauran status suke yi.</p>

<h2>4. Screen Sharing - Raba Allo</h2>

<p>Wannan fasali yana ba ka damar raba abin da ke a allo ɗin ka yayin video call. Ana iya amfani da shi don:</p>

<ul>
<li>Nuna hoto ko bidiyo ga aboki</li>
<li>Taimaka wani wajen koyar da amfani da manhaja</li>
<li>Raba presentation a cikin business meeting</li>
</ul>

<h2>5. Community - Haɗa Groups Da Yawa</h2>

<p>WhatsApp Communities yana ba ka damar haɗa groups da yawa a ƙarƙashin rufin ɗaya. Misali:</p>

<ul>
<li>Community na makaranta mai groups daban-daban don aji ɗaya ɗaya</li>
<li>Community na masallaci mai groups don maza, mata, da matasa</li>
<li>Community na kasuwanci mai groups don sassa daban-daban</li>
</ul>

<h2>6. Sakonni Masu Ɓacewa (View Once)</h2>

<p>Wannan fasali ya riga ya kasance, amma yanzu an ƙara inganta shi. Za ka iya aika hotuna ko bidiyo da za su ɓace bayan an kalla su sau ɗaya.</p>

<p>Don yin hakan:</p>

<ol>
<li>Zaɓi hoton ko bidiyon da kake so ka aika</li>
<li>Danna alamar "1" a ƙasa</li>
<li>Aika saƙon</li>
</ol>

<h2>7. Polls - Yi Zaɓe A Cikin Group</h2>

<p>Yanzu za ka iya ƙirƙirar polls a cikin groups don samun ra'ayoyin mutane. Misali:</p>

<ul>
<li>Zaɓen wurin taro</li>
<li>Zaɓen lokacin hadawa</li>
<li>Zaɓen abinci don liyafa</li>
</ul>

<h2>8. Larger File Sharing</h2>

<p>WhatsApp yanzu yana goyan bayan aika fayiloli har zuwa 2GB (a wasu ƙasashe). Wannan yana nufin za ka iya aika:</p>

<ul>
<li>Bidiyo masu tsawo</li>
<li>PDF fayiloli masu girma</li>
<li>Tsarin aiki</li>
</ul>

<h2>9. Ingantaccen Security</h2>

<p>WhatsApp ya ƙara sabbin fasalolin tsaro:</p>

<ul>
<li><strong>End-to-End Encryption Backup:</strong> Backups na yanzu suna da encryption</li>
<li><strong>Privacy Checkup:</strong> Guide mai sauƙi don saita privacy settings</li>
<li><strong>Account Protection:</strong> Karin tsaro idan ka canza wayar</li>
</ul>

<h2>10. Message Reactions - Amsa Da Emoji</h2>

<p>Za ka iya amsa saƙon da emoji maimakon rubuta reply. Wannan yana ba ka damar:</p>

<ul>
<li>Yi sauri a amsawa</li>
<li>Nuna yadda ka ji game da saƙon</li>
<li>Rage yawan saƙonni a cikin group</li>
</ul>

<p>Don yin reaction, danna saƙon sau biyu kuma zaɓi emoji da kake so.</p>

<h2>Ƙarshe</h2>

<p>WhatsApp yana ci gaba da inganta manhaja ɗin don ƙara sauƙaƙa hanyar sadarwa. Duk waɗannan sabbin fasaloli suna samuwa kyauta kuma suna aiki a duk na'urori.</p>

<p>Tabbatar cewa ka sabunta WhatsApp ɗin ka don samun duk sabbin fasalolin. Je zuwa App Store ko Google Play Store don sabuntawa.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop',
    category: {
      id: '2',
      name: 'Manhajoji',
      slug: 'manhajoji'
    },
    tags: ['WhatsApp', 'Sadarwa', 'Sabbin Fasaloli'],
    author: mockAuthor,
    publishedAt: '2025-10-13T09:15:00Z',
    views: 2100
  },
  {
    id: '4',
    title: 'Yadda Ake Yin Screenshot A Wayoyi Daban-daban',
    slug: 'yadda-ake-yin-screenshot',
    excerpt: 'Koya yadda ake daukar hoton allo (screenshot) akan iPhone, Samsung, da sauran wayoyi.',
    content: `<h1>Yadda Ake Yin Screenshot A Wayoyi Daban-daban</h1>

<p>Screenshot (hoton allo) wani muhimmin fasalin ne a wayoyin zamani. Yana ba ka damar adana abin da kake gani a allon wayar ka a matsayin hoto. Wannan yana da amfani don:</p>

<ul>
<li>Adana muhimman bayanai</li>
<li>Raba abubuwan ban sha'awa da abokanka</li>
<li>Adana shaida na ma'amala</li>
<li>Koyar da wasu yadda ake yin wani abu</li>
</ul>

<p>A wannan labarin, za mu koya yadda ake yin screenshot akan wayoyi daban-daban.</p>

<h2>iPhone (Apple)</h2>

<p>Akwai hanyoyi biyu na daukar screenshot akan iPhone, dangane da irin model ɗin da kake da shi.</p>

<h3>iPhone da Face ID (iPhone X zuwa 15 Pro Max)</h3>

<p>Idan wayar ka tana da Face ID (ba ta da home button):</p>

<ol>
<li>Matsa maɓallin ƙara sauti (Volume Up) da maɓallin Power (gefen dama) lokaci guda</li>
<li>Saki su nan da nan</li>
<li>Za ka ga allo ya yi walƙiya da sauti na kamara</li>
<li>Thumbnail na screenshot zai bayyana a kusurwar hagu na ƙasa</li>
<li>Danna thumbnail ɗin don gyarawa ko rarrabawa, ko kuma bari ya ɓace</li>
</ol>

<h3>iPhone da Home Button (iPhone 8 zuwa ƙasa)</h3>

<p>Idan wayar ka tana da home button:</p>

<ol>
<li>Matsa home button da maɓallin Power lokaci guda</li>
<li>Saki su nan da nan</li>
<li>Screenshot zai kasance a cikin Photos app</li>
</ol>

<p><strong>Inda Za Ka Sami Screenshots:</strong> Bude Photos app > Albums > Screenshots</p>

<h2>Samsung (Android)</h2>

<p>Samsung wayoyi suna da hanyoyi da yawa don yin screenshot.</p>

<h3>Hanya Ta Farko: Maɓallan Wayar</h3>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti (Volume Down) lokaci guda</li>
<li>Riƙe su na ɗan lokaci</li>
<li>Za ka ji sauti kuma allo zai yi walƙiya</li>
</ol>

<h3>Hanya Ta Biyu: Palm Swipe</h3>

<p>Wannan hanya mai sauƙi ce amma dole ne a kunna ta tukuna:</p>

<ol>
<li>Je zuwa Settings > Advanced Features > Motions and Gestures</li>
<li>Kunna "Palm swipe to capture"</li>
<li>Don yin screenshot, riƙa tafin hannun ka daga gefe zuwa gefe akan allo</li>
</ol>

<h3>Scroll Screenshot (Screenshot Na Tsayi)</h3>

<p>Idan kana son screenshot wanda ya ɗauki duk shafin da ke ƙasa da sama:</p>

<ol>
<li>Yi screenshot na al'ada</li>
<li>Nan da nan danna "Scroll capture" button a ƙasa</li>
<li>Ci gaba da danna har sai ka isa wurin da kake so</li>
</ol>

<p><strong>Inda Za Ka Sami Screenshots:</strong> Gallery > Screenshots folder</p>

<h2>Google Pixel</h2>

<h3>Hanya Ta Farko: Maɓallan Wayar</h3>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti lokaci guda</li>
<li>Riƙe su na ɗan lokaci kaɗan</li>
</ol>

<h3>Hanya Ta Biyu: Google Assistant</h3>

<ol>
<li>Ce "Hey Google" ko riƙa maɓallin home mai tsawo</li>
<li>Ce "Take a screenshot"</li>
<li>Google Assistant zai ɗauki screenshot</li>
</ol>

<h3>Hanya Ta Uku: Recent Apps Menu</h3>

<ol>
<li>Bude Recent Apps (swipe up kuma riƙe)</li>
<li>Danna "Screenshot" button a ƙasan allo</li>
</ol>

<p><strong>Inda Za Ka Sami Screenshots:</strong> Photos app > Library > Screenshots</p>

<h2>Xiaomi / Redmi / POCO</h2>

<p>Wayoyin Xiaomi suna da hanyoyi da yawa:</p>

<h3>Hanya Ta Farko</h3>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti lokaci guda</li>
</ol>

<h3>Hanya Ta Biyu: Three-Finger Swipe</h3>

<ol>
<li>Je zuwa Settings > Additional Settings > Button shortcuts</li>
<li>Kunna "Take a screenshot"</li>
<li>Saura yatsu uku daga sama zuwa ƙasa akan allo</li>
</ol>

<h3>Hanya Ta Uku: Quick Ball</h3>

<ol>
<li>Kunna Quick Ball daga Settings</li>
<li>Danna Quick Ball kuma zaɓi Screenshot</li>
</ol>

<h2>OnePlus</h2>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti lokaci guda</li>
<li>Ko kuma yi amfani da three-finger swipe (idan an kunna)</li>
</ol>

<h2>Oppo / Realme</h2>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti lokaci guda</li>
<li>Ko kuma yi amfani da three-finger swipe</li>
</ol>

<h2>Vivo</h2>

<ol>
<li>Matsa maɓallin Power da maɓallin rage sauti</li>
<li>Ko kuma kunna S-Capture daga notification panel</li>
</ol>

<h2>Gyara da Raba Screenshot</h2>

<p>Bayan yin screenshot, zaka iya:</p>

<ul>
<li><strong>Gyarawa:</strong> Yanke, ƙara rubutu, zana, ko ƙara filters</li>
<li><strong>Rabawa:</strong> Aika ta WhatsApp, Email, ko sauran manhajoji</li>
<li><strong>Sharewa:</strong> Goge screenshots da ba ka buƙata ba</li>
</ul>

<h2>Dabaru Masu Amfani</h2>

<ul>
<li>Yi organize na screenshots ɗin ka a folders daban-daban</li>
<li>Goge tsoffin screenshots don rage cunkoso</li>
<li>Yi backup na muhimman screenshots a cloud</li>
<li>Yi amfani da screenshot apps don ƙarin fasaloli</li>
</ul>

<h2>Ƙarshe</h2>

<p>Yanzu ka koyi yadda ake yin screenshot akan wayoyi daban-daban. Ko dai kana da iPhone, Samsung, Pixel, ko wani nau'in wayar Android, kana da hanya ta yin screenshot.</p>

<p>Yi gwaji akan wayar ka kuma zaɓi hanyar da ta fi maka sauƙi!</p>`,
    coverImage: 'https://images.unsplash.com/photo-1592286927505-5d49b87f8c4a?w=800&h=600&fit=crop',
    category: {
      id: '5',
      name: 'Koyarwa',
      slug: 'koyarwa'
    },
    tags: ['Koyarwa', 'Screenshot', 'Tips'],
    author: mockAuthor,
    publishedAt: '2025-10-12T11:45:00Z',
    views: 1567
  },
  {
    id: '5',
    title: 'iPhone 15 Pro Max: Me Ya Saba?',
    slug: 'iphone-15-pro-max-sabbin-fasaloli',
    excerpt: 'Apple ta fito da iPhone 15 Pro Max mai kyakkyawan ƙira da sabbin fasaloli masu ban mamaki.',
    content: `<h1>iPhone 15 Pro Max: Me Ya Saba?</h1>

<p>Apple ta sake yin abin mamaki ta kawo iPhone 15 Pro Max mai cike da sabbin fasaloli da gyare-gyare masu ban mamaki. Wannan wayar ta zo da sauye-sauye masu yawa da suka sa ta bambanta da tsoffin models.</p>

<h2>Titanium Design - Ƙira Mai Ƙarfi da Nauyi Kaɗan</h2>

<p>Wannan shine karo na farko da Apple za ta yi amfani da titanium don ginin wayarta. Sabili da haka:</p>

<ul>
<li>Wayar ta fi tsoffin models nauyi kaɗan da kusan gram 19</li>
<li>Titanium ya fi ƙarfi fiye da aluminum da aka yi amfani da shi a baya</li>
<li>Yana da ƙira mai tsafta kuma mai kyau</li>
<li>Launuka masu samuwa: Natural Titanium, Blue Titanium, White Titanium, da Black Titanium</li>
</ul>

<p>Jikin wayar yana da kauri na 8.25mm kuma yana da nauyi na gram 221, wanda ya sa ta zama iPhone mafi sauƙi da ka riƙe.</p>

<h2>Action Button - Sabon Maɓalli Mai Aiki Da Yawa</h2>

<p>Apple ta cire tsohon toggle button na shiru kuma ta maye gurbinsa da sabon Action Button. Wannan maɓallin yana ba ka damar:</p>

<ul>
<li>Yi switching tsakanin silent mode da ring mode</li>
<li>Kunna flashlight nan da nan</li>
<li>Fara recording na murya</li>
<li>Kunna kamara</li>
<li>Fara workout</li>
<li>Kunna Focus mode</li>
<li>Yi amfani da Shortcuts</li>
</ul>

<p>Kana iya saita Action Button don yin abin da kake so ta hanyar Settings.</p>

<h2>USB-C Port - Ƙarshe Ga Lightning</h2>

<p>Bayan shekaru da yawa na amfani da Lightning port, Apple ta ƙarshe ta canza zuwa USB-C. Wannan yana kawo amfanoni da yawa:</p>

<ul>
<li>Charging mai sauri har zuwa 27W</li>
<li>Ana iya amfani da cable ɗaya don iPhone, iPad, da MacBook</li>
<li>Ana iya haɗa na'urorin waje kamar hard drives da cameras</li>
<li>Data transfer mai sauri har zuwa USB 3 speeds (10Gbps)</li>
</ul>

<p>Wannan yana nufin za ka iya charging iPhone ɗin ka da cable ɗin da kake amfani da shi don iPad ko laptop ɗin ka.</p>

<h2>A17 Pro Chip - Ƙarfin Aiki Mai Ban Mamaki</h2>

<p>Apple ta ƙirƙiri sabon A17 Pro chip wanda shine processor na farko da aka gina akan 3-nanometer technology. Wannan yana kawo:</p>

<ul>
<li>CPU mai sauri har zuwa 10% fiye da A16</li>
<li>GPU mai sauri har zuwa 20% fiye da A16</li>
<li>Neural Engine mai sauri har zuwa 2x</li>
<li>Ƙarfin aiki na wasanni kamar console games</li>
<li>Machine learning mai sauri</li>
</ul>

<p>Da wannan chip, za ka iya yin wasanni masu nauyi kamar Resident Evil Village da Assassin's Creed Mirage akan wayar ka.</p>

<h2>Kamara - Ingantattun Hotuna da Bidiyo</h2>

<p>iPhone 15 Pro Max tana da kamara guda uku a baya:</p>

<ul>
<li><strong>Main Camera:</strong> 48MP mai sensor mai girma</li>
<li><strong>Ultra Wide Camera:</strong> 12MP mai 120° field of view</li>
<li><strong>Telephoto Camera:</strong> 12MP mai 5x optical zoom (sabon!)</li>
</ul>

<p>Sabon 5x optical zoom yana ba ka damar ɗaukar hotuna daga nesa ba tare da rasa quality ba. Ana kuma iya yin bidiyo akan ProRes da LOG format don masu ƙwararru.</p>

<h2>Allo (Display)</h2>

<p>Wayar tana da allo mai girma 6.7-inch Super Retina XDR mai ProMotion technology. Refresh rate yana daga 1Hz har zuwa 120Hz dangane da abin da kake yi.</p>

<p>Allo yana da haske mai ƙarfi har zuwa 2000 nits, wanda ke sa ka iya amfani da wayar a waje cikin hasken rana mai ƙarfi.</p>

<h2>Baturi</h2>

<p>iPhone 15 Pro Max tana da rayuwar baturi mai kyau wanda zai ɗauke ka:</p>

<ul>
<li>Har zuwa awa 29 na kallon bidiyo</li>
<li>Har zuwa awa 25 na streaming bidiyo</li>
<li>Har zuwa awa 95 na sauraron waƙa</li>
</ul>

<h2>Fasalolin Ƙari</h2>

<ul>
<li>5G connectivity</li>
<li>Wi-Fi 6E</li>
<li>Bluetooth 5.3</li>
<li>Emergency SOS via satellite</li>
<li>Crash Detection</li>
<li>IP68 water resistance</li>
<li>Face ID</li>
<li>Spatial Audio</li>
</ul>

<h2>Farashi</h2>

<p>iPhone 15 Pro Max tana farawa daga:</p>

<ul>
<li>256GB: $1,199</li>
<li>512GB: $1,399</li>
<li>1TB: $1,599</li>
</ul>

<h2>Ƙarshe</h2>

<p>iPhone 15 Pro Max babbar wayar ce da ta zo da gyare-gyare masu mahimmanci. Daga titanium design zuwa Action Button, USB-C, da A17 Pro chip, wannan wayar tana da abubuwa masu yawa da suka sa ta zama ta musamman.</p>

<p>Idan kana neman wayar premium da za ta ɗauke ka tsawon lokaci mai tsawo, iPhone 15 Pro Max ita ce babbar zaɓi.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
    category: {
      id: '1',
      name: 'Wayoyi',
      slug: 'wayoyi'
    },
    tags: ['iPhone', 'Apple', 'Bita'],
    author: mockAuthor,
    publishedAt: '2025-10-11T16:20:00Z',
    views: 3200
  },
  {
    id: '6',
    title: 'Mafi Kyawun Manhajoji Na AI A 2025',
    slug: 'mafi-kyawun-manhajoji-na-ai',
    excerpt: 'Duba mafi kyawun manhajojin AI da za ka iya amfani da su don inganta aikin ka.',
    content: `<h1>Mafi Kyawun Manhajoji Na AI A 2025</h1>

<p>Artificial Intelligence (AI) ya canza yadda muke aiki a yau. Manhajoji masu yawa sun fito waɗanda ke amfani da ƙarfin AI don taimaka mana a ayyuka daban-daban. A wannan labarin, za mu duba mafi kyawun manhajojin AI da za ka iya amfani da su a shekarar 2025.</p>

<h2>1. ChatGPT - Mai Taimako A Rubuce-rubuce</h2>

<p>ChatGPT manhaja ce ta OpenAI wacce ta zama mashahuriya sosai a duk duniya. Tana iya:</p>

<ul>
<li>Amsa tambayoyi a harsuna daban-daban</li>
<li>Rubuta labari, wasiƙu, da taƙaitawar bayanai</li>
<li>Taimaka wajen koyi da bincike</li>
<li>Rubuta code don masu shirya-shirya</li>
<li>Fassara harsuna</li>
<li>Bayar da shawarwari masu amfani</li>
</ul>

<p><strong>Farashi:</strong> Akwai version na kyauta da kuma ChatGPT Plus ($20/wata) mai ƙarin fasaloli.</p>

<p><strong>Amfani:</strong> Ziyarci chat.openai.com ko sauke manhaja akan wayar ka.</p>

<h2>2. Midjourney - Ƙirƙirar Hotuna Da AI</h2>

<p>Midjourney manhaja ce mai ban mamaki don ƙirƙirar hotuna ta hanyar AI. Kawai rubuta abin da kake so, kuma AI zai ƙirƙiro hoto mai kyau.</p>

<ul>
<li>Ƙirƙirar hotuna masu ban mamaki</li>
<li>Ƙira don websites da social media</li>
<li>Art da zane-zane</li>
<li>Concepts don products</li>
</ul>

<p><strong>Farashi:</strong> Tuna farawa daga $10/wata</p>

<p><strong>Amfani:</strong> Ta hanyar Discord server</p>

<h2>3. GitHub Copilot - Mataimakin Masu Shirya-shirya</h2>

<p>Idan kai mai shirya-shirya ne (developer), GitHub Copilot zai taimake ka sosai. Yana:</p>

<ul>
<li>Ba da shawarwarin code yayin da kake rubuta</li>
<li>Kammala functions da classes</li>
<li>Rubuta comments da documentation</li>
<li>Taimaka wajen gyara bugs</li>
<li>Koyar da sabbin harsuna na shirya-shirya</li>
</ul>

<p><strong>Farashi:</strong> $10/wata ko $100/shekara</p>

<p><strong>Amfani:</strong> Haɗa shi da VS Code, Visual Studio, ko JetBrains IDEs</p>

<h2>4. Notion AI - Aikin Ofis Mai Ƙarfi</h2>

<p>Notion AI yana ƙara ƙarfin AI ga Notion workspace. Yana taimaka wajen:</p>

<ul>
<li>Rubuta da gyara rubutu</li>
<li>Taƙaita dogon bayanai</li>
<li>Fassara zuwa harsuna daban-daban</li>
<li>Ƙirƙira to-do lists</li>
<li>Bayar da ra'ayoyi don ayyuka</li>
</ul>

<p><strong>Farashi:</strong> $10/wata (ƙari akan Notion subscription)</p>

<h2>5. Grammarly - Gyara Rubuce-rubuce</h2>

<p>Grammarly yana taimaka wajen gyara kurakurai a rubutun Turanci. Yana:</p>

<ul>
<li>Gano kurakurai na spelling da grammar</li>
<li>Ba da shawarwarin inganta rubutu</li>
<li>Duba tone da clarity</li>
<li>Kiyaye plagiarism</li>
</ul>

<p><strong>Farashi:</strong> Akwai version na kyauta da Premium ($12/wata)</p>

<h2>6. Canva AI - Ƙira Mai Sauki</h2>

<p>Canva ta ƙara AI features waɗanda ke sauƙaƙa ƙira. Za ka iya:</p>

<ul>
<li>Ƙirƙirar hotuna da AI (Magic Media)</li>
<li>Cire background daga hotuna</li>
<li>Inganta quality na hotuna</li>
<li>Ƙirƙirar presentations cikin mintuna</li>
</ul>

<p><strong>Farashi:</strong> Akwai version na kyauta, Canva Pro shine $12.99/wata</p>

<h2>7. Otter.ai - Rubuta Magana</h2>

<p>Otter.ai yana juyar da magana zuwa rubutu (transcription). Mai amfani don:</p>

<ul>
<li>Taron video da audio</li>
<li>Interviews</li>
<li>Lectures</li>
<li>Podcasts</li>
</ul>

<p><strong>Farashi:</strong> Akwai kyauta da Premium versions</p>

<h2>8. Jasper AI - Content Writing</h2>

<p>Jasper yana kwararre wajen rubuta content don:</p>

<ul>
<li>Blog posts</li>
<li>Social media posts</li>
<li>Marketing copy</li>
<li>Product descriptions</li>
</ul>

<p><strong>Farashi:</strong> Daga $49/wata</p>

<h2>9. DALL-E 3 - Ƙirƙirar Hotuna</h2>

<p>DALL-E 3 na OpenAI wata manhaja ce mai ƙirƙirar hotuna masu inganci. Tana:</p>

<ul>
<li>Ƙirƙirar hotuna daga rubutu</li>
<li>Gyara hotuna</li>
<li>Ƙirƙirar variations na hoton da yake</li>
</ul>

<p><strong>Farashi:</strong> Ana samun ta ta hanyar ChatGPT Plus</p>

<h2>10. Copy.ai - Marketing Content</h2>

<p>Copy.ai yana kwararre wajen rubuta marketing content:</p>

<ul>
<li>Social media posts</li>
<li>Ad copy</li>
<li>Email marketing</li>
<li>Product descriptions</li>
<li>Blog ideas</li>
</ul>

<p><strong>Farashi:</strong> Akwai kyauta da Pro version ($49/wata)</p>

<h2>Shawarwari Don Amfani Da Manhajojin AI</h2>

<ul>
<li><strong>Fara da Version na Kyauta:</strong> Yawancin manhajoji suna da free trials. Gwada su kafin ka biya</li>
<li><strong>Koyi Yadda Ake Amfani:</strong> AI tools suna buƙatar practice don samun kyakkyawan sakamakon</li>
<li><strong>Gauraya da Aikin Mutum:</strong> AI yana taimakawa, amma bai maye gurbin tunanin ɗan adam ba</li>
<li><strong>Kiyaye Privacy:</strong> Lura da irin bayanan da kake rabawa da AI</li>
</ul>

<h2>Ƙarshe</h2>

<p>Manhajojin AI sun zo don sauƙaƙa rayuwarmu da inganta aikin da muke yi. Ko dai kana son taimako wajen rubuce-rubuce, ƙirƙirar hotuna, ko shirya-shirya, akwai AI tool da zai taimake ka.</p>

<p>Zaɓi manhajojin da suka dace da buƙatun ka kuma fara yin amfani da su yau. Kada ka manta: AI yana nan don taimaka mana, ba don maye gurbinmu ba!</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    category: {
      id: '2',
      name: 'Manhajoji',
      slug: 'manhajoji'
    },
    tags: ['AI', 'Manhajoji', 'Technology'],
    author: mockAuthor,
    publishedAt: '2025-10-10T08:00:00Z',
    featured: true,
    views: 4100
  }
];

// Helper functions
export function getArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return mockArticles.filter(article => article.category.slug === categorySlug);
}

export function getFeaturedArticles(): Article[] {
  return mockArticles.filter(article => article.featured);
}

export function getRelatedArticles(currentArticleId: string, limit: number = 3): Article[] {
  const currentArticle = mockArticles.find(a => a.id === currentArticleId);
  if (!currentArticle) return [];
  
  return mockArticles
    .filter(article => 
      article.id !== currentArticleId && 
      article.category.id === currentArticle.category.id
    )
    .slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const lowerQuery = query.toLowerCase();
  return mockArticles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
