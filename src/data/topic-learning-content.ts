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
};
