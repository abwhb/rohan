import type { TopicLearningContent } from "@/src/types/study";

export const topicLearningContent: Partial<Record<string, TopicLearningContent>> = {
  "p1-quadratics": {
    video: {
      id: "ka-quadratics-completing-square",
      title: "Quadratics: completing the square",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/algebra-home/alg-quadratics",
      durationMinutes: 18,
      whyItHelps: "Connects standard form, completed-square form, roots, and turning points with worked examples.",
      followUp: "Close the video, rewrite x² − 6x + 5 in completed-square form, then solve three exam questions.",
    },
    urduLesson: {
      id: "urdu-quadratic-method-choice",
      title: "Quadratic میں صحیح طریقہ کیسے چنیں؟",
      summary:
        "پہلے سوال کی demand پہچانو: roots چاہئیں، turning point چاہیے، یا roots کی nature؟ اسی demand کے مطابق factorisation، completing the square یا discriminant استعمال کرو۔",
      steps: [
        {
          title: "Step 1 · سوال کی demand",
          body: "Roots کے لیے factorisation یا quadratic formula؛ turning point کے لیے completing the square؛ اور roots کی nature کے لیے b² − 4ac دیکھو۔",
        },
        {
          title: "Step 2 · مربع مکمل کرو",
          body: "x² − 6x + 5 میں x کا آدھا coefficient −3 ہے۔ اس لیے x² − 6x = (x − 3)² − 9، اور پوری expression (x − 3)² − 4 بنتی ہے۔",
        },
        {
          title: "Step 3 · مطلب نکالو",
          body: "(x − 3)² − 4 سے turning point فوراً (3, −4) ملتا ہے۔ یہی form graph اور range سمجھنے کے لیے سب سے useful ہے۔",
        },
      ],
      check: {
        prompt: "x² − 8x + 3 کا turning point کیا ہے؟",
        options: ["(4, −13)", "(−4, 13)", "(8, 3)"],
        correctIndex: 0,
        explanation: "x² − 8x + 3 = (x − 4)² − 13، اس لیے turning point (4, −13) ہے۔",
      },
    },
  },
  "p1-functions": {
    video: {
      id: "ka-functions-inverse-composite",
      title: "Functions, composites, inverses and transformations",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/algebra2/alg-functions",
      durationMinutes: 16,
      whyItHelps: "Connects function notation with domain, range, composition, inverses, and graph transformations.",
      followUp: "Without notes, find f⁻¹(x) for f(x)=3x−5 and verify both compositions give x.",
    },
    urduLesson: {
      id: "urdu-functions-machine",
      title: "Function کو machine کی طرح سمجھو",
      summary: "Function input لیتا ہے، ایک rule لگاتا ہے اور output دیتا ہے۔ Composite میں machines کی ترتیب اہم ہے، جبکہ inverse اسی process کو الٹا کرتا ہے۔",
      steps: [
        { title: "Step 1 · ترتیب پڑھو", body: "(g∘f)(x) کا مطلب پہلے f لگاؤ، پھر اس output پر g لگاؤ۔ دائیں طرف والا function ہمیشہ پہلے کام کرتا ہے۔" },
        { title: "Step 2 · inverse بناؤ", body: "y=f(x) لکھو، x کو subject بناؤ، پھر y کی جگہ x لکھ دو۔ Domain restriction کو ساتھ رکھنا ضروری ہے۔" },
        { title: "Step 3 · verify کرو", body: "صحیح inverse کے لیے f(f⁻¹(x))=x اور f⁻¹(f(x))=x ہونا چاہیے، لیکن صرف allowed domain پر۔" },
      ],
      check: {
        prompt: "f(x)=2x+3 اور g(x)=x² ہو تو (g∘f)(1) کیا ہے؟",
        options: ["5", "25", "7"],
        correctIndex: 1,
        explanation: "پہلے f(1)=5، پھر g(5)=25۔ ترتیب بدلنے سے جواب بدل سکتا ہے۔",
      },
    },
  },
  "p1-coordinate-geometry": {
    video: {
      id: "ka-circle-tangents",
      title: "Circle tangents and radius geometry",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/geometry/cc-geometry-circles/tangents",
      durationMinutes: 12,
      whyItHelps: "Makes the radius–tangent perpendicular fact visual before it is translated into gradients and line equations.",
      followUp: "Draw a circle, radius and tangent; then form the tangent equation at one chosen point using exact gradients.",
    },
    urduLesson: {
      id: "urdu-circle-tangent",
      title: "Diagram سے line equation تک",
      summary: "Coordinate geometry میں picture کو algebra میں بدلنا اصل skill ہے۔ پہلے centre، radius اور point mark کرو، پھر gradients اور perpendicular facts استعمال کرو۔",
      steps: [
        { title: "Step 1 · gradient نکالو", body: "دو points (x₁,y₁) اور (x₂,y₂) کے درمیان gradient (y₂−y₁)/(x₂−x₁) ہے۔ Signs کو brackets کے ساتھ رکھو۔" },
        { title: "Step 2 · perpendicular rule", body: "Perpendicular non-vertical lines کے gradients کا product −1 ہوتا ہے، یعنی tangent gradient radius gradient کا negative reciprocal ہے۔" },
        { title: "Step 3 · line بناؤ", body: "Known point اور gradient کو y−y₁=m(x−x₁) میں رکھو۔ آخری answer سے پہلے check کرو کہ point line پر آتا ہے۔" },
      ],
      check: {
        prompt: "Centre (0,0) سے point (3,4) تک radius کا gradient 4/3 ہے۔ وہاں tangent کا gradient کیا ہوگا؟",
        options: ["3/4", "−3/4", "−4/3"],
        correctIndex: 1,
        explanation: "Perpendicular gradient negative reciprocal ہوتا ہے، اس لیے −3/4۔",
      },
    },
  },
  "p1-circular-measure": {
    video: {
      id: "ka-circles-arc-sector",
      title: "Radians, arc length and sector area",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/engageny-geo/geo-5/geo-5b-arc-length-sector-area",
      durationMinutes: 14,
      whyItHelps: "Uses circle geometry to connect the angle in radians with arc length, sectors, and tangents.",
      followUp: "Sketch two sectors, label r and θ, then calculate one arc length and one sector area without notes.",
    },
    urduLesson: {
      id: "urdu-radian-model",
      title: "Radian formula کو diagram سے جوڑو",
      summary: "s=rθ اور area=½r²θ صرف تب سیدھا کام کرتے ہیں جب θ radians میں ہو۔ Compound shape میں پہلے arc، sector اور triangle الگ کرو۔",
      steps: [
        { title: "Step 1 · unit check", body: "اگر angle degrees میں ہو تو پہلے π/180 سے multiply کر کے radians میں بدلو۔ Formula لگانے سے پہلے calculator mode بھی check کرو۔" },
        { title: "Step 2 · arc یا area؟", body: "Length چاہیے تو s=rθ؛ sector area چاہیے تو ½r²θ۔ Perimeter میں دو radii بھی شامل ہو سکتے ہیں۔" },
        { title: "Step 3 · segment", body: "Minor segment area عموماً sector area minus triangle area ہوتا ہے۔ Diagram پر shaded region mark کر کے sign طے کرو۔" },
      ],
      check: {
        prompt: "r=5 اور θ=1.2 radians ہو تو arc length کیا ہے؟",
        options: ["4.2", "6", "15"],
        correctIndex: 1,
        explanation: "s=rθ=5×1.2=6 units۔",
      },
    },
  },
  "p1-trigonometry": {
    video: {
      id: "ka-trig-graphs-identities",
      title: "Trigonometric graphs, identities and equations",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/algebra-home/alg-trig-functions",
      durationMinutes: 18,
      whyItHelps: "Brings exact values, periodic graphs, identities, and interval solutions into one visual unit.",
      followUp: "Rebuild the exact-value table, sketch sin x and tan x, then solve two equations on a stated interval.",
    },
    urduLesson: {
      id: "urdu-trig-all-solutions",
      title: "Trig equation میں کوئی root miss نہ کرو",
      summary: "پہلے identity سے equation کو ایک trig ratio تک لاؤ، reference angle نکالو، پھر graph یا quadrant signs سے stated interval کے سارے solutions لکھو۔",
      steps: [
        { title: "Step 1 · simplify", body: "Identity استعمال کر کے equation کو sin x=k، cos x=k یا tan x=k کی شکل دو۔ جلدی decimal میں نہ جاؤ۔" },
        { title: "Step 2 · reference angle", body: "Calculator یا exact values سے بنیادی angle نکالو، مگر یہ صرف پہلا solution ہے۔" },
        { title: "Step 3 · interval scan", body: "Graph یا ASTC signs سے پورے interval میں ہر valid angle لکھو اور endpoints بھی check کرو۔" },
      ],
      check: {
        prompt: "0≤x≤2π میں sin x=1/2 کے solutions کون سے ہیں؟",
        options: ["π/6 only", "π/6 and 5π/6", "π/6 and 7π/6"],
        correctIndex: 1,
        explanation: "Sine پہلے اور دوسرے quadrant میں positive ہے، اس لیے π/6 اور 5π/6۔",
      },
    },
  },
  "p1-series": {
    video: {
      id: "ka-series-binomial",
      title: "Arithmetic, geometric and binomial series",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/precalculus/precalculus",
      durationMinutes: 16,
      whyItHelps: "Separates sequence terms from sums and connects AP, GP, convergence, and binomial expansion.",
      followUp: "Classify four sequences as AP or GP, write the matching formula, then expand one binomial without Pascal’s triangle.",
    },
    urduLesson: {
      id: "urdu-series-structure",
      title: "پہلے pattern پہچانو، پھر formula",
      summary: "AP میں constant difference ہوتا ہے، GP میں constant ratio۔ سوال nth term مانگ رہا ہے یا sum، یہ طے کیے بغیر formula لگانا سب سے عام غلطی ہے۔",
      steps: [
        { title: "Step 1 · AP یا GP", body: "Consecutive terms subtract کرو؛ constant ملے تو AP۔ Divide کرو؛ constant ملے تو GP۔" },
        { title: "Step 2 · term یا sum", body: "uₙ ایک term دیتا ہے، Sₙ پہلے n terms کا total۔ n کو number of terms سمجھو، آخری term نہیں۔" },
        { title: "Step 3 · infinity gate", body: "GP کا sum to infinity صرف |r|<1 پر موجود ہے، اور formula a/(1−r) ہے۔ شرط ضرور لکھو۔" },
      ],
      check: {
        prompt: "GP کا first term 3 اور common ratio 1/2 ہے۔ Sum to infinity کیا ہے؟",
        options: ["4.5", "6", "9"],
        correctIndex: 1,
        explanation: "3/(1−1/2)=6، اور |r|<1 اس لیے series converge کرتی ہے۔",
      },
    },
  },
  "p1-differentiation": {
    video: {
      id: "ka-derivative-analysis",
      title: "Using derivatives to analyse functions",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/math/ap-calculus-bc/bc-diff-analytical-applications-new",
      durationMinutes: 18,
      whyItHelps: "Shows how derivative signs locate increasing intervals, stationary points, and local maxima or minima.",
      followUp: "Differentiate a five-expression ladder, then find and classify the stationary points of one cubic.",
    },
    urduLesson: {
      id: "urdu-derivative-meaning",
      title: "Derivative صرف formula نہیں، graph کی رفتار ہے",
      summary: "dy/dx ہر x پر gradient بتاتا ہے۔ Stationary point پر derivative zero ہوتا ہے، مگر maximum یا minimum ثابت کرنے کے لیے sign change یا second derivative چاہیے۔",
      steps: [
        { title: "Step 1 · differentiate", body: "xⁿ کا derivative nxⁿ⁻¹ ہے۔ Gradient چاہیے تو x value derivative میں substitute کرو، original function میں نہیں۔" },
        { title: "Step 2 · stationary points", body: "dy/dx=0 solve کر کے x values نکالو، پھر original y=f(x) میں رکھ کر coordinates مکمل کرو۔" },
        { title: "Step 3 · classify", body: "+ سے − sign change maximum، − سے + minimum۔ Second derivative بھی classification دے سکتا ہے۔" },
      ],
      check: {
        prompt: "y=x³−3x کے stationary x-values کیا ہیں؟",
        options: ["x=0", "x=±1", "x=±3"],
        correctIndex: 1,
        explanation: "dy/dx=3x²−3=0، اس لیے x²=1 اور x=±1۔",
      },
    },
  },
  "p1-integration": {
    video: {
      id: "ka-integral-area-volume",
      title: "Integration, area and solids of revolution",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/mission/integral-calculus",
      durationMinutes: 18,
      whyItHelps: "Connects antiderivatives with definite area, area between curves, and disc-method volume.",
      followUp: "Integrate a power ladder, sketch one bounded region, then write its area integral before calculating.",
    },
    urduLesson: {
      id: "urdu-integration-setup",
      title: "Integration سے پہلے region سمجھو",
      summary: "Integration reverse differentiation ہے، لیکن area اور volume میں صحیح limits اور صحیح expression بنانا calculation سے زیادہ اہم ہے۔",
      steps: [
        { title: "Step 1 · power reverse", body: "xⁿ integrate کرتے وقت power میں 1 add کرو اور نئی power سے divide کرو۔ Indefinite integral میں +C مت بھولو۔" },
        { title: "Step 2 · area sign", body: "Definite integral signed area دیتا ہے۔ Curve axis کے نیچے ہو تو geometric area کے لیے حصہ الگ یا absolute لینا پڑ سکتا ہے۔" },
        { title: "Step 3 · volume", body: "x-axis کے گرد volume عموماً π∫y²dx ہے۔ Function کو square کرنے اور limits لکھنے سے پہلے sketch کرو۔" },
      ],
      check: {
        prompt: "∫₀² 3x² dx کی value کیا ہے؟",
        options: ["4", "8", "12"],
        correctIndex: 1,
        explanation: "Antiderivative x³ ہے، اس لیے [x³]₀²=8۔",
      },
    },
  },
  "m-forces": {
    video: {
      id: "ka-free-body-diagrams",
      title: "Types of forces and free-body diagrams",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/v/types-of-forces-and-free-body-diagrams",
      durationMinutes: 12,
      whyItHelps: "Shows weight, normal reaction, tension, and friction on one isolated body before equations are written.",
      followUp: "Draw four fresh force diagrams from memory. Label directions before resolving any components.",
    },
    urduLesson: {
      id: "urdu-force-diagram",
      title: "Force diagram پہلے، equation بعد میں",
      summary:
        "Mechanics میں object کو الگ کرو، صرف اس object پر لگنے والی forces بناؤ، پھر positive direction declare کر کے equations لکھو۔",
      steps: [
        {
          title: "Step 1 · جسم کو isolate کرو",
          body: "پورا scene copy نہ کرو۔ ایک dot یا box بناؤ جو صرف اس particle کو represent کرے جس کی equation بنانی ہے۔",
        },
        {
          title: "Step 2 · ہر force کی direction",
          body: "Weight ہمیشہ نیچے، normal reaction surface کے perpendicular، tension string کے ساتھ، اور friction motion یا impending motion کے opposite ہوتا ہے۔",
        },
        {
          title: "Step 3 · پھر resolve کرو",
          body: "Axes slope کے parallel اور perpendicular رکھنا اکثر آسان ہوتا ہے۔ Equilibrium میں ہر axis پر resultant zero ہوگا۔",
        },
      ],
      check: {
        prompt: "Rough horizontal surface پر block کو دائیں کھینچا جا رہا ہے مگر وہ equilibrium میں ہے۔ Friction کس طرف ہوگا؟",
        options: ["دائیں", "بائیں", "اوپر"],
        correctIndex: 1,
        explanation: "Block کی حرکت کا tendency دائیں ہے، اس لیے friction اس tendency کے opposite یعنی بائیں ہوگا۔",
      },
    },
  },
  "m-kinematics": {
    video: {
      id: "ka-velocity-time-graphs",
      title: "Velocity–time graphs and one-dimensional motion",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/science/physics/one-dimensional-motion/displacement-velocity-acceleration/a/what-are-velocity-vs-time-graphs",
      durationMinutes: 15,
      whyItHelps: "Links gradient to acceleration, area to displacement, and sign changes to direction of motion.",
      followUp: "Sketch a velocity–time graph, label two gradients and calculate signed displacement plus total distance.",
    },
    urduLesson: {
      id: "urdu-kinematics-model-choice",
      title: "Graph، SUVAT یا calculus؟ پہلے model چنو",
      summary: "Kinematics میں formula سے پہلے decide کرو کہ acceleration constant ہے یا variable۔ Velocity کا sign direction بتاتا ہے اور total distance کے لیے sign changes split کرنے پڑتے ہیں۔",
      steps: [
        { title: "Step 1 · quantities الگ", body: "Distance scalar ہے، displacement signed۔ Speed magnitude ہے، velocity direction کے ساتھ۔ سوال کے لفظ غور سے پڑھو۔" },
        { title: "Step 2 · graph meaning", body: "Displacement–time graph کا gradient velocity؛ velocity–time graph کا gradient acceleration اور area displacement ہے۔" },
        { title: "Step 3 · method gate", body: "SUVAT صرف constant acceleration پر۔ اگر a(t) یا v(t) دیا ہو تو differentiation یا integration استعمال کرو۔" },
      ],
      check: {
        prompt: "Velocity–time graph کے نیچے signed area کیا دیتا ہے؟",
        options: ["Acceleration", "Displacement", "Speed"],
        correctIndex: 1,
        explanation: "v کو time کے لحاظ سے integrate کرنے سے displacement ملتا ہے۔ Total distance کے لیے negative حصے کی magnitude بھی add ہوتی ہے۔",
      },
    },
  },
  "m-momentum": {
    video: {
      id: "ka-collisions-momentum",
      title: "Momentum in one-dimensional collisions",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/science/physics/collisions",
      durationMinutes: 18,
      whyItHelps: "Uses signed velocity and system boundaries to show why total momentum is conserved in impacts.",
      followUp: "Declare a positive direction and solve three impact equations, interpreting every negative final velocity.",
    },
    urduLesson: {
      id: "urdu-momentum-signs",
      title: "Momentum میں direction کو sign بناؤ",
      summary: "Conservation equation سے پہلے positive direction declare کرو۔ ہر velocity کو اسی convention کے مطابق plus یا minus دو، پھر result کی sign کو direction میں translate کرو۔",
      steps: [
        { title: "Step 1 · system", body: "وہ bodies select کرو جن پر impact کے دوران external impulse negligible ہے۔ تب total momentum before = total momentum after۔" },
        { title: "Step 2 · signed equation", body: "p=mv vector ہے۔ Right positive ہو تو left-moving velocity negative ہوگی؛ speed کو ہمیشہ positive لکھنا غلط ہے۔" },
        { title: "Step 3 · coalescence", body: "اگر particles stick کریں تو final velocity مشترک ہے، مگر kinetic energy لازماً conserve نہیں ہوتی۔" },
      ],
      check: {
        prompt: "2 kg particle 3 m/s دائیں، 1 kg particle rest پر؛ دونوں stick کریں۔ Final velocity؟",
        options: ["1 m/s right", "2 m/s right", "3 m/s right"],
        correctIndex: 1,
        explanation: "Initial momentum 6، total mass 3، اس لیے v=6/3=2 m/s دائیں۔",
      },
    },
  },
  "m-newtons-laws": {
    video: {
      id: "ka-newtons-laws",
      title: "Forces and Newton’s laws of motion",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/science/physics/motion-and-kinematics/newtons-laws-of-motion",
      durationMinutes: 16,
      whyItHelps: "Shows how a non-zero resultant produces acceleration and how separate bodies need separate force models.",
      followUp: "Draw separate diagrams for two connected particles, then write one F=ma equation for each body.",
    },
    urduLesson: {
      id: "urdu-newton-connected-particles",
      title: "Connected particles میں ہر body کی الگ equation",
      summary: "String common acceleration دیتی ہے، مگر ہر particle پر forces مختلف ہو سکتی ہیں۔ دونوں free-body diagrams الگ بناؤ اور declared direction میں F=ma لکھو۔",
      steps: [
        { title: "Step 1 · separate diagrams", body: "ہر body کو isolate کرو۔ Tension دونوں diagrams میں string کے along pull کرتی ہے، push نہیں۔" },
        { title: "Step 2 · common condition", body: "Taut inextensible string ہو تو acceleration magnitude same ہوتی ہے۔ Directions pulley geometry سے طے کرو۔" },
        { title: "Step 3 · solve together", body: "ہر body کے لیے resultant=ma equation بناؤ، پھر simultaneous equations سے acceleration اور tension نکالو۔" },
      ],
      check: {
        prompt: "5 kg body پر resultant force 20 N ہے۔ Acceleration کیا ہے؟",
        options: ["0.25 m/s²", "4 m/s²", "100 m/s²"],
        correctIndex: 1,
        explanation: "F=ma، اس لیے a=20/5=4 m/s²۔",
      },
    },
  },
  "m-energy": {
    video: {
      id: "ka-work-energy-power",
      title: "Work, energy and power",
      provider: "Khan Academy",
      url: "https://www.khanacademy.org/science/physics/work-and-energy/work-kinetic-energy/a/work-and-energy",
      durationMinutes: 13,
      whyItHelps: "Connects work by a force with kinetic-energy change, resistance, gravitational energy, and power.",
      followUp: "Label initial and final energy stores for three situations, then solve one P=Fv question with units.",
    },
    urduLesson: {
      id: "urdu-energy-ledger",
      title: "Energy question کو ledger کی طرح لکھو",
      summary: "Initial energy، work added یا removed، اور final energy الگ لکھو۔ Resistance energy نکالتا ہے؛ direction اور efficiency کو equation میں واضح رکھو۔",
      steps: [
        { title: "Step 1 · states", body: "Start اور finish پر KE=½mv² اور GPE=mgh identify کرو۔ Reference height واضح رکھو۔" },
        { title: "Step 2 · transfer", body: "Driving force کا positive work energy بڑھاتا ہے؛ resistance کا work motion کے خلاف ہونے سے energy کم کرتا ہے۔" },
        { title: "Step 3 · power", body: "Power energy transfer per second ہے۔ Constant force velocity کے ساتھ same direction میں ہو تو P=Fv۔" },
      ],
      check: {
        prompt: "2 kg mass 3 m/s سے چل رہی ہے۔ Kinetic energy کیا ہے؟",
        options: ["6 J", "9 J", "18 J"],
        correctIndex: 1,
        explanation: "KE=½×2×3²=9 J۔",
      },
    },
  },
  "b-environment": {
    video: {
      id: "bized-paper-one-analysis",
      title: "AS Business Paper 1: chain of analysis",
      provider: "BizEdMadeSimple",
      url: "https://www.youtube.com/watch?v=oSPSCQt3r1E&t=254s",
      durationMinutes: 8,
      whyItHelps: "The selected chapter demonstrates how Cambridge Business answers move from a point to a developed impact.",
      followUp: "Write one because → therefore → business impact chain about a stakeholder decision using a named context.",
    },
    urduLesson: {
      id: "urdu-stakeholder-conflict",
      title: "Stakeholder conflict کو analysis chain بناؤ",
      summary:
        "صرف یہ نہ لکھو کہ stakeholders disagree کرتے ہیں۔ ہر group کا objective بتاؤ، decision کا اثر جوڑو، اور آخر میں business performance تک chain مکمل کرو۔",
      steps: [
        {
          title: "Step 1 · دونوں objectives",
          body: "Employees بہتر pay اور job security چاہتے ہیں، جبکہ shareholders زیادہ profit اور dividend چاہتے ہیں۔ یہی مختلف objectives conflict کی بنیاد ہیں۔",
        },
        {
          title: "Step 2 · because اور therefore",
          body: "Wages بڑھانے سے costs بڑھ سکتی ہیں، therefore short-term profit کم ہو سکتا ہے۔ لیکن motivation بڑھے تو productivity اور quality بہتر ہو سکتی ہے۔",
        },
        {
          title: "Step 3 · context والی judgement",
          body: "Final judgement business کی labour intensity، موجودہ morale، cash position اور competitors کی pay پر depend کرے گی۔",
        },
      ],
      check: {
        prompt: "کون سا جواب developed analysis ہے؟",
        options: [
          "Higher wages motivate workers.",
          "Higher wages raise costs, so profit may fall.",
          "Higher wages may reduce labour turnover, therefore recruitment costs fall and profit margin may improve if productivity also rises.",
        ],
        correctIndex: 2,
        explanation: "تیسرا جواب دو linked effects اور business outcome دیتا ہے، اس لیے یہ developed analysis ہے۔",
      },
    },
  },
  "b-hrm": {
    video: {
      id: "takingthebiz-motivation",
      title: "A-level Business: motivation theory",
      provider: "TakingTheBiz",
      url: "https://www.youtube.com/watch?v=lwbjAPiDp9c",
      durationMinutes: 18,
      whyItHelps: "Compares Taylor, Mayo, Maslow and Herzberg while connecting motivation to measurable business effects.",
      followUp: "Choose one theory for a named workforce, then write a two-link chain from method to productivity or retention.",
    },
    urduLesson: {
      id: "urdu-motivation-application",
      title: "Motivation theory کو case پر apply کرو",
      summary: "Theory کا نام لکھنا کافی نہیں۔ Worker کی need، مناسب method، behaviour میں change اور business performance پر اثر کی مکمل chain بناؤ۔",
      steps: [
        { title: "Step 1 · diagnosis", body: "Case سے اصل problem نکالو: low pay، boring job، no recognition، poor relations یا training gap؟" },
        { title: "Step 2 · theory match", body: "Taylor financial reward، Mayo social relations، Maslow needs، Herzberg hygiene اور motivators الگ کرتا ہے۔ Context کے مطابق چنو۔" },
        { title: "Step 3 · measurable impact", body: "Motivation کو productivity، quality، absenteeism، labour turnover یا customer service سے جوڑو، پھر limitation لکھو۔" },
      ],
      check: {
        prompt: "Herzberg کے مطابق کون سا factor اصل motivator ہے؟",
        options: ["Safe working conditions", "Recognition and responsibility", "Minimum wage"],
        correctIndex: 1,
        explanation: "Recognition، achievement اور responsibility motivators ہیں؛ pay اور conditions بنیادی hygiene factors ہو سکتے ہیں۔",
      },
    },
  },
  "b-marketing": {
    video: {
      id: "bizconsesh-marketing-mix",
      title: "A-level Business: marketing mix",
      provider: "Bizconsesh",
      url: "https://www.youtube.com/watch?v=JC8lGW1T1bY",
      durationMinutes: 12,
      whyItHelps: "Explains how product, price, promotion and place must fit the target market rather than operate separately.",
      followUp: "Create a coherent 4P recommendation for one product and support every choice with the same target segment.",
    },
    urduLesson: {
      id: "urdu-marketing-evidence",
      title: "Marketing decision کو evidence سے بناؤ",
      summary: "پہلے target segment اور research insight لکھو، پھر 4Ps کو اسی customer need کے مطابق align کرو۔ Generic promotion list analysis نہیں ہے۔",
      steps: [
        { title: "Step 1 · market evidence", body: "Primary research نیا first-hand data دیتا ہے؛ secondary موجود data۔ Sample، cost، speed اور reliability compare کرو۔" },
        { title: "Step 2 · segment", body: "Age، income، location، lifestyle یا behaviour سے segment define کرو۔ ہر P اسی segment کے لیے justify کرو۔" },
        { title: "Step 3 · coherent mix", body: "Premium product کے ساتھ price، promotion اور place بھی premium positioning support کریں؛ contradictions marks کم کرتی ہیں۔" },
      ],
      check: {
        prompt: "نئے local sports drink کا taste جاننے کے لیے بہترین primary method کون سا ہے؟",
        options: ["Old government report", "Target customers کا product test focus group", "Competitor annual accounts"],
        correctIndex: 1,
        explanation: "Product test focus group target customers سے direct qualitative feedback دے گا۔",
      },
    },
  },
  "b-operations": {
    video: {
      id: "edurev-capacity-utilisation",
      title: "Capacity utilisation for A-level Business",
      provider: "EduRev",
      url: "https://edurev.in/v/306309/Capacity-Utilisation",
      durationMinutes: 10,
      whyItHelps: "Explains capacity utilisation calculations and how unused or excessive capacity affects cost and flexibility.",
      followUp: "Calculate utilisation for two factories, then explain one cost and one customer-service consequence.",
    },
    urduLesson: {
      id: "urdu-operations-tradeoffs",
      title: "Operations میں ہر choice کا trade-off لکھو",
      summary: "Process، inventory اور capacity decisions cost، quality، speed اور flexibility کو مختلف طرح affect کرتے ہیں۔ ایک فائدہ لکھ کر رکنا analysis نہیں۔",
      steps: [
        { title: "Step 1 · calculate", body: "Capacity utilisation=(actual output/maximum output)×100۔ Formula، working اور percent unit دکھاؤ۔" },
        { title: "Step 2 · operational effect", body: "High utilisation unit cost کم کر سکتا ہے، مگر breakdown، delay اور rush quality کا risk بڑھ سکتا ہے۔" },
        { title: "Step 3 · context judgement", body: "Demand volatility، spare capacity، supplier reliability اور product type دیکھ کر JIT/JIC یا process choice evaluate کرو۔" },
      ],
      check: {
        prompt: "Maximum output 1000 units اور actual output 800 ہو تو capacity utilisation؟",
        options: ["20%", "80%", "125%"],
        correctIndex: 1,
        explanation: "800/1000×100=80%۔",
      },
    },
  },
  "b-finance": {
    video: {
      id: "bized-paper-two-calculation",
      title: "AS Business Paper 2: calculations in context",
      provider: "BizEdMadeSimple",
      url: "https://www.youtube.com/watch?v=aVEdrWmvrw8&t=280s",
      durationMinutes: 12,
      whyItHelps: "Shows how calculations and case evidence are converted into developed Cambridge data-response answers.",
      followUp: "Complete a contribution and break-even calculation, show every stage, then interpret the result for the case.",
    },
    urduLesson: {
      id: "urdu-finance-working",
      title: "Finance میں working بھی marks ہے",
      summary: "Formula لکھو، values substitute کرو، unit دو اور business meaning explain کرو۔ صرف calculator answer دینے سے method marks اور interpretation دونوں ضائع ہو سکتے ہیں۔",
      steps: [
        { title: "Step 1 · contribution", body: "Contribution per unit=selling price−variable cost۔ Total contribution fixed cost cover کرتا ہے، پھر profit بنتا ہے۔" },
        { title: "Step 2 · break-even", body: "Break-even output=fixed cost/contribution per unit۔ Margin of safety actual output minus break-even output ہے۔" },
        { title: "Step 3 · interpret", body: "Number کو context میں لکھو: required sales realistic ہیں؟ demand، capacity، price change اور cash position کیا کہتے ہیں؟" },
      ],
      check: {
        prompt: "Price $20، variable cost $12، fixed cost $16,000۔ Break-even output؟",
        options: ["800 units", "1,333 units", "2,000 units"],
        correctIndex: 2,
        explanation: "Contribution $8، اس لیے 16,000/8=2,000 units۔",
      },
    },
  },
};
