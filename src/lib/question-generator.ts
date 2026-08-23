import type { DailyQuestion } from "@/src/types/study";

interface QuestionDraft {
  skill: string;
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
}

type RandomSource = () => number;
type QuestionBuilder = (random: RandomSource) => QuestionDraft;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): RandomSource {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function choose<T>(random: RandomSource, values: readonly T[]) {
  return values[Math.floor(random() * values.length)]!;
}

function integer(random: RandomSource, minimum: number, maximum: number) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function numberText(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function choiceDraft(
  skill: string,
  prompt: string,
  answer: string,
  distractors: string[],
  explanation: string,
): QuestionDraft {
  return { skill, prompt, answer, distractors, explanation };
}

const questionBuilders: Record<string, QuestionBuilder> = {
  "p1-quadratics": (random) => {
    const h = integer(random, 2, 6);
    const k = choose(random, [-12, -9, -5, -3, 2, 4]);
    const constant = h * h + k;
    const middle = -2 * h;
    return choiceDraft(
      "Completing the square",
      `y=x²${middle < 0 ? "−" : "+"}${Math.abs(middle)}x${constant < 0 ? "−" : "+"}${Math.abs(constant)} کا turning point کیا ہے؟`,
      `(${h}, ${k})`,
      [`(${-h}, ${-k})`, `(${2 * h}, ${constant})`, `(${h}, ${-k})`],
      `Expression (x−${h})²${k < 0 ? "−" : "+"}${Math.abs(k)} بنتی ہے، اس لیے turning point (${h}, ${k}) ہے۔`,
    );
  },
  "p1-functions": (random) => {
    const a = integer(random, 2, 5);
    const b = integer(random, 1, 5);
    const x = integer(random, 0, 3);
    const first = a * x + b;
    const answer = first ** 2;
    return choiceDraft(
      "Composite functions",
      `f(x)=${a}x+${b} اور g(x)=x² ہو تو (g∘f)(${x}) کیا ہے؟`,
      numberText(answer),
      [numberText(first), numberText(a * x * x + b), numberText(answer + b)],
      `پہلے f(${x})=${first}، پھر g(${first})=${answer}۔ Composite میں دائیں والا function پہلے لگتا ہے۔`,
    );
  },
  "p1-coordinate-geometry": (random) => {
    const [run, rise] = choose(random, [[3, 4], [4, 3], [5, 2], [2, 5]] as const);
    return choiceDraft(
      "Perpendicular gradients",
      `Circle کے centre سے tangent point تک radius کا gradient ${rise}/${run} ہے۔ Tangent کا gradient؟`,
      `−${run}/${rise}`,
      [`${run}/${rise}`, `−${rise}/${run}`, `${rise}/${run}`],
      `Tangent radius کے perpendicular ہے، اس لیے gradient negative reciprocal یعنی −${run}/${rise} ہوگا۔`,
    );
  },
  "p1-circular-measure": (random) => {
    const radius = choose(random, [4, 5, 6, 8, 10]);
    const theta = choose(random, [0.5, 0.75, 1.2, 1.5]);
    const answer = radius * theta;
    return choiceDraft(
      "Arc length",
      `Radius ${radius} cm اور angle ${theta} radians ہو تو arc length کیا ہے؟`,
      `${numberText(answer)} cm`,
      [`${numberText(radius + theta)} cm`, `${numberText(0.5 * radius * radius * theta)} cm`, `${numberText(radius / theta)} cm`],
      `Radians میں s=rθ، اس لیے ${radius}×${theta}=${numberText(answer)} cm۔`,
    );
  },
  "p1-trigonometry": (random) => choose(random, [
    choiceDraft("Interval solutions", "0≤x≤2π میں cos x=1/2 کے solutions؟", "π/3 and 5π/3", ["π/3 only", "π/3 and 2π/3", "2π/3 and 4π/3"], "Cosine پہلے اور چوتھے quadrant میں positive ہے۔"),
    choiceDraft("Exact values", "sin(π/4) کی exact value؟", "√2/2", ["1/2", "√3/2", "1"], "45° یعنی π/4 پر sine اور cosine دونوں √2/2 ہیں۔"),
    choiceDraft("Trig identities", "1−sin²x کس کے برابر ہے؟", "cos²x", ["sin²x", "tan²x", "1+cos²x"], "sin²x+cos²x=1 کو rearrange کرنے سے 1−sin²x=cos²x۔"),
    choiceDraft("Period", "y=sin(3x) کا period کیا ہے؟", "2π/3", ["2π", "3π", "π/3"], "sin(kx) کا period 2π/k ہوتا ہے۔"),
  ]),
  "p1-series": (random) => {
    const first = choose(random, [3, 4, 6, 8]);
    const ratio = choose(random, [0.2, 0.25, 0.5]);
    const answer = first / (1 - ratio);
    return choiceDraft(
      "Geometric sum to infinity",
      `GP کا first term ${first} اور common ratio ${ratio} ہے۔ Sum to infinity؟`,
      numberText(answer),
      [numberText(first * (1 + ratio)), numberText(first / (1 + ratio)), numberText(answer + first)],
      `|r|<1 اور S∞=a/(1−r)، اس لیے ${first}/(1−${ratio})=${numberText(answer)}۔`,
    );
  },
  "p1-differentiation": (random) => {
    const root = integer(random, 2, 4);
    const coefficient = 3 * root * root;
    return choiceDraft(
      "Stationary points",
      `y=x³−${coefficient}x کے stationary x-values کیا ہیں؟`,
      `x=±${root}`,
      ["x=0", `x=±${root + 1}`, `x=±${root * root}`],
      `dy/dx=3x²−${coefficient}=0، لہٰذا x²=${root * root} اور x=±${root}۔`,
    );
  },
  "p1-integration": (random) => {
    const upper = integer(random, 2, 4);
    const multiplier = integer(random, 1, 3);
    const coefficient = 3 * multiplier;
    const answer = multiplier * upper ** 3;
    return choiceDraft(
      "Definite integration",
      `∫₀${upper} ${coefficient}x² dx کی value کیا ہے؟`,
      numberText(answer),
      [numberText(multiplier * upper ** 2), numberText(3 * multiplier * upper ** 3), numberText(answer + upper)],
      `Antiderivative ${multiplier}x³ ہے، اس لیے [${multiplier}x³]₀${upper}=${answer}۔`,
    );
  },
  "m-forces": (random) => choose(random, [
    choiceDraft("Friction direction", "Block rough slope پر اوپر move کرنے والا ہے۔ Friction کس direction میں ہوگا؟", "Slope کے نیچے", ["Slope کے اوپر", "Surface کے perpendicular", "Vertically upward"], "Friction motion یا impending motion کے opposite ہوتا ہے۔"),
    choiceDraft("Normal reaction", "Horizontal table پر stationary block کے لیے normal reaction کس direction میں ہے؟", "Vertically upward", ["Vertically downward", "Horizontally right", "Motion کے opposite"], "Normal reaction surface کے perpendicular اور block سے باہر ہوتی ہے۔"),
    choiceDraft("Limiting friction", "F=μR کب لکھ سکتے ہیں؟", "جب motion impending یا limiting ہو", ["ہر rough surface پر", "صرف equilibrium میں", "صرف smooth surface پر"], "عمومی rule F≤μR ہے؛ equality limiting حالت میں آتی ہے۔"),
  ]),
  "m-kinematics": (random) => {
    const velocity = integer(random, 3, 10);
    const time = integer(random, 2, 8);
    const answer = velocity * time;
    return choiceDraft(
      "Velocity–time area",
      `ایک particle ${velocity} m/s کی constant velocity سے ${time} s چلتا ہے۔ Displacement؟`,
      `${answer} m`,
      [`${numberText(velocity / time)} m`, `${numberText(0.5 * answer)} m`, `${velocity + time} m`],
      `Velocity–time graph کے نیچے rectangle کا area ${velocity}×${time}=${answer} m ہے۔`,
    );
  },
  "m-momentum": (random) => {
    const mass = integer(random, 2, 5);
    const secondMass = mass;
    const finalVelocity = integer(random, 1, 4);
    const initialVelocity = 2 * finalVelocity;
    return choiceDraft(
      "Coalescing particles",
      `${mass} kg particle ${initialVelocity} m/s دائیں اور ${secondMass} kg particle rest پر ہے۔ دونوں stick کریں تو final velocity؟`,
      `${finalVelocity} m/s right`,
      [`${initialVelocity} m/s right`, `${numberText(initialVelocity / 3)} m/s right`, `${finalVelocity} m/s left`],
      `Momentum ${mass}×${initialVelocity} ہے اور total mass ${mass + secondMass}، اس لیے v=${finalVelocity} m/s right۔`,
    );
  },
  "m-newtons-laws": (random) => {
    const mass = integer(random, 2, 8);
    const acceleration = integer(random, 2, 6);
    const force = mass * acceleration;
    return choiceDraft(
      "Newton's second law",
      `${mass} kg mass پر resultant force ${force} N ہے۔ Acceleration؟`,
      `${acceleration} m/s²`,
      [`${force + mass} m/s²`, `${mass * (acceleration + 1)} m/s²`, `${numberText(force / acceleration)} m/s²`],
      `F=ma، اس لیے a=${force}/${mass}=${acceleration} m/s²۔`,
    );
  },
  "m-energy": (random) => {
    const mass = choose(random, [2, 4, 6]);
    const velocity = integer(random, 2, 6);
    const answer = 0.5 * mass * velocity ** 2;
    return choiceDraft(
      "Kinetic energy",
      `${mass} kg mass ${velocity} m/s سے چل رہی ہے۔ Kinetic energy؟`,
      `${numberText(answer)} J`,
      [`${mass * velocity} J`, `${mass * velocity ** 2} J`, `${numberText(0.5 * mass * velocity)} J`],
      `KE=½mv²=½×${mass}×${velocity}²=${numberText(answer)} J۔`,
    );
  },
  "b-environment": (random) => choose(random, [
    choiceDraft("Stakeholder analysis", "کون سا answer مکمل chain of analysis دیتا ہے؟", "Training raises skill, so errors fall and customer satisfaction may improve.", ["Training is useful.", "Workers like training.", "Training costs money."], "Developed analysis cause کو business outcome تک link کرتا ہے۔"),
    choiceDraft("Opportunity cost", "A business £20,000 machinery پر لگاتا ہے، advertising نہیں کرتا۔ Opportunity cost؟", "Advertising سے ملنے والا اگلا بہترین فائدہ", ["Machinery کی purchase price", "تمام future profit", "Workers کی wages"], "Opportunity cost next-best alternative forgone ہے۔"),
    choiceDraft("External influence", "Interest rates بڑھنے کا highly geared business پر ممکنہ اثر؟", "Loan repayments بڑھیں، cash flow دباؤ میں آئے", ["Variable cost لازماً صفر ہو", "Demand ہمیشہ بڑھے", "Employees کی productivity فوراً double ہو"], "Higher rates borrowing cost بڑھا سکتی ہیں، خاص طور پر debt والے business میں۔"),
  ]),
  "b-hrm": (random) => choose(random, [
    choiceDraft("Motivation theory", "Herzberg کے مطابق کون سا motivator ہے؟", "Recognition and responsibility", ["Safe conditions", "Minimum pay", "Company policy"], "Recognition، achievement اور responsibility motivators ہیں۔"),
    choiceDraft("Mayo", "Mayo کی theory کس چیز پر زور دیتی ہے؟", "Social relations and belonging", ["Piece-rate pay only", "Hierarchy of five needs", "Job losses"], "Mayo نے group belonging اور management attention کی اہمیت دکھائی۔"),
    choiceDraft("Labour turnover", "Labour turnover کم ہونے کا ممکنہ financial benefit؟", "Recruitment and training costs fall", ["Revenue لازماً zero ہو", "Fixed assets بڑھیں", "Interest rates کم ہوں"], "Fewer leavers replacement hiring اور induction cost کم کر سکتے ہیں۔"),
  ]),
  "b-marketing": (random) => choose(random, [
    choiceDraft("Primary research", "نئے snack کا taste test کرنے کے لیے best primary method؟", "Target customers کا product-test focus group", ["Old census report", "Competitor accounts", "Industry article"], "Focus group first-hand qualitative reaction دیتا ہے۔"),
    choiceDraft("Segmentation", "Income اور lifestyle کے مطابق customers تقسیم کرنا کیا ہے؟", "Market segmentation", ["Mass production", "Job enrichment", "Break-even analysis"], "Segmentation customers کو shared characteristics کے مطابق groups میں بانٹتا ہے۔"),
    choiceDraft("Marketing mix", "Premium brand کے لیے coherent decision کون سا ہے؟", "High-quality product, premium price and selective distribution", ["Premium price with poor quality", "No target market and random promotion", "Low quality with luxury positioning"], "4Ps کو ایک ہی target position support کرنی چاہیے۔"),
  ]),
  "b-operations": (random) => {
    const maximum = choose(random, [800, 1000, 1200]);
    const percentage = choose(random, [60, 70, 75, 80, 90]);
    const actual = maximum * percentage / 100;
    const other = percentage === 90 ? 85 : percentage + 10;
    return choiceDraft(
      "Capacity utilisation",
      `Maximum output ${maximum} units اور actual output ${actual} units ہے۔ Capacity utilisation؟`,
      `${percentage}%`,
      [`${100 - percentage}%`, `${other}%`, `${numberText(maximum / actual * 100)}%`],
      `${actual}/${maximum}×100=${percentage}%۔`,
    );
  },
  "b-finance": (random) => {
    const contribution = choose(random, [5, 8, 10, 12]);
    const variableCost = integer(random, 6, 15);
    const price = variableCost + contribution;
    const breakEven = choose(random, [1000, 1500, 2000, 2500]);
    const fixedCost = contribution * breakEven;
    return choiceDraft(
      "Break-even",
      `Price $${price}، variable cost $${variableCost}، fixed cost $${fixedCost.toLocaleString("en-US")}۔ Break-even output؟`,
      `${breakEven.toLocaleString("en-US")} units`,
      [`${(breakEven + 500).toLocaleString("en-US")} units`, `${Math.max(500, breakEven - 500).toLocaleString("en-US")} units`, `${fixedCost.toLocaleString("en-US")} units`],
      `Contribution $${contribution}، اس لیے ${fixedCost.toLocaleString("en-US")}/${contribution}=${breakEven.toLocaleString("en-US")} units۔`,
    );
  },
};

function shuffleOptions(random: RandomSource, draft: QuestionDraft) {
  const choices = [draft.answer, ...draft.distractors]
    .filter((option, index, all) => all.indexOf(option) === index)
    .map((option) => ({ option, correct: option === draft.answer }));

  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [choices[index], choices[swapIndex]] = [choices[swapIndex]!, choices[index]!];
  }

  return {
    options: choices.map(({ option }) => option),
    correctIndex: choices.findIndex(({ correct }) => correct),
  };
}

export function buildDailyQuestion(topicId: string, dateKey: string, slot = 0): DailyQuestion {
  const builder = questionBuilders[topicId];
  if (!builder) throw new Error(`No daily question generator for ${topicId}.`);

  const seed = hashSeed(`${dateKey}:${topicId}:${slot}`);
  const random = seededRandom(seed);
  const draft = builder(random);
  const { options, correctIndex } = shuffleOptions(random, draft);

  return {
    id: `${dateKey}:${topicId}:${slot}`,
    topicId,
    skill: draft.skill,
    prompt: draft.prompt,
    options,
    correctIndex,
    explanation: draft.explanation,
  };
}

export const dailyQuestionTopicIds = Object.freeze(Object.keys(questionBuilders));
